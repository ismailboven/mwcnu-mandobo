# Authentication: MWCNU Mandobo Web Platform

---

## 1. Ringkasan

- Provider: **Supabase Auth** (PostgreSQL-backed, JWT).
- Mode: Email + Password (primary), Magic Link (secondary), Google OAuth (optional, fase lanjut).
- Session: HTTP-only cookies via `@supabase/ssr` + Next.js Middleware auto-refresh.
- Roles: `super_admin`, `admin`, `editor`, `viewer` (detail di 12_ROLE_PERMISSION.md).

---

## 2. Flow Autentikasi

### 2.1 Registrasi & Undangan (Admin Invite — utama)
```
Admin → inviteUserAction(email, role)
  → Supabase invite email (session link, expire 7 hari)
  → Pengurus klik link → set password → aktif
  → Default role sesuai undangan
```

### 2.2 Login
```
Pengurus buka /masuk → email + password
  → supabase.auth.signInWithPassword
  → session cookie di-set (httpOnly, secure, sameSite=lax)
  → redirect ke /admin
```
- Login gagal 5x berturut-turut → lockout 15 menit (Supabase built-in).

### 2.3 Magic Link (fallback untuk yang lupa password)
```
Kirim link OTP ke email → klik → masuk otomatis (session)
```
- OTP expire 10 menit, sekali pakai.

### 2.4 Logout
```
Middleware/action → supabase.auth.signOut → hapus session cookie → redirect /
```

---

## 3. Middleware (Next.js)

```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/admin", "/member"];

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: { getAll, setAll },  // dari request/response
  });

  // 1. Refresh token bila mendekati expire
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((p) => path.startsWith(p));

  if (needsAuth && !user) {
    return NextResponse.redirect(new URL(`/masuk?next=${path}`, request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
```

> **Jangan** verifikasi role di middleware (mahal). Cek role di Server Action / layout admin via query cepat ke `user_roles`.

---

## 4. Guard untuk Role

### Helper server
```ts
// lib/auth.ts (server-only)
import "server-only";

export async function requireEditor(sb) {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new UnauthorizedError();
  const role = await getUserRole(sb, user.id);   // cache 60s
  if (!["editor", "admin", "super_admin"].includes(role)) {
    throw new ForbiddenError();
  }
  return { user, role };
}
```

### Guard di Server Component
```tsx
// app/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const { user, role } = await requireUser();
  if (!canAccessAdmin(role)) return <AccessDenied />;
  return <AdminShell user={user} role={role}>{children}</AdminShell>;
}
```

---

## 5. Model Data Auth

| Konsep | Implementasi |
|--------|--------------|
| User | `auth.users` (Supabase managed) |
| Profil | `public.profiles` (1:1, auto-create via trigger) |
| Role | `public.roles` + `public.user_roles` (M:N) |
| Session | Supabase JWT access + refresh token |

### Auto-create profile (trigger)
```sql
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email,
          coalesce(new.raw_user_meta_data->>'avatar_url', null));
  return new;
end; $$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Bootstrap super_admin
```sql
-- Jalankan sekali via SQL/migration setelah membuat akun admin pertama.
insert into public.roles (name, description) values
  ('super_admin', 'Akses penuh sistem'),
  ('admin', 'Kelola semua konten & konfigurasi'),
  ('editor', 'Kelola konten'),
  ('viewer', 'Lihat admin read-only');
```

---

## 6. Session & Cookie

| Setting | Value |
|---------|-------|
| Nama cookie | `sb-{ref}-auth-token` (default Supabase) |
| HttpOnly | ✅ |
| Secure | ✅ (production) |
| SameSite | `lax` |
| Max age | sesuai refresh token (default 30 hari di supabase) |
| Refresh | otomatis di middleware jika access token < 60s expiry |

### Custom cookie (opsional)
Jika perlu nama cookie sendiri, aktifkan `useSecureCookies` + konfigurasi di `createClient` per lingkungan.

---

## 7. Keamanan Akun

| Aspek | Implementasi |
|-------|--------------|
| Password policy | Min 8 karakter (Supabase default), sarankan kuat |
| Email confirmation | WAJIB diaktifkan (production) |
| Brute force | Supabase lockout bawaan |
| Token | JWT HS256, `exp` short (1 jam access) |
| Session invalidation | `signOut` di semua perangkat via `auth.admin.signOutAll` (admin) |
| Audit | `activity_logs` untuk login gagal & perubahan role |
| OAuth (Google) | `allowlist` domain `@gmail.com` opsional; disarankan allowlist organisasi |

---

## 8. Reset Password Flow

1. Pengguna klik "Lupa Password" → `resetPasswordForEmail(email)`.
2. Email berisi link ke `/update-password` (buka recovery session).
3. Halaman minta password baru (min 8, konfirmasi).
4. `updateUser({ password })` → sukses → redirect login.
5. Logout sesi lain bila perlu.

---

## 9. Best Practices

- ✅ Semua operasi admin cek role **di server** (jangan percaya UI).
- ✅ Gunakan `getUser()` bukan hanya `getSession()` untuk validasi token (mencegah stale/JWT replay).
- ✅ Rate-limit route login (middleware + Supabase).
- ✅ Simpan `redirect` param saat redirect ke login (UX).
- ❌ Jangan pernah menyimpan password plaintext / hash sendiri.
- ❌ Jangan expose token ke client (pakai cookie server).
- ❌ Jangan cek role dengan JWT claim saja tanpa verifikasi DB bila role sering berubah (fallback ke `user_roles`).

---

## 10. Env Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server only
SUPABASE_JWT_SECRET=...            # untuk custom JWT jika dipakai
```

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
