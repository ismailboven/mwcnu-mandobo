# Role & Permission (RBAC + RLS): MWCNU Mandobo Web Platform

---

## 1. Model Otorisasi (Dua Lapis)

1. **RBAC (Aplikasi)** — kontrol UI & akses halaman (Server Actions guard, menu admin).
2. **RLS (Database)** — lapisan terakhir pengamanan data (wajib aktif, defense-in-depth).

> Prinsip: **UI boleh salah**, database tidak boleh bocor. Semua query melewati RLS.

---

## 2. Definisi Role

| Role | Level | Deskripsi |
|------|:-----:|-----------|
| `super_admin` | 4 | Akses penuh termasuk pengguna, role, settings sistem |
| `admin` | 3 | Kelola semua konten, struktur, arsip, konfigurasi konten |
| `editor` | 2 | Kelola konten (berita, agenda, galeri, kajian) |
| `viewer` | 1 | Hanya melihat data admin (read-only) |

### Hierarki
`super_admin ⊇ admin ⊇ editor ⊇ viewer`

Perhitungan akses: `level >= kebutuhan`.

---

## 3. Matriks Fitur per Role

| Area | super_admin | admin | editor | viewer |
|------|:-:|:-:|:-:|:-:|
| **Berita** CRUD | ✅ | ✅ | ✅ | 👁 |
| Publish / Pin / Featured | ✅ | ✅ | ✅ | — |
| **Agenda** CRUD | ✅ | ✅ | ✅ | 👁 |
| **Galeri** CRUD | ✅ | ✅ | ✅ | 👁 |
| **Kajian** CRUD | ✅ | ✅ | ✅ | 👁 |
| **Pengumuman** CRUD | ✅ | ✅ | ✅ | 👁 |
| **Dokumen/Arsip** | ✅ | ✅ | ❌ (unduh saja) | 👁 |
| **Struktur/Pengurus** | ✅ | ✅ | 👁 | 👁 |
| **Lembaga/Banom** | ✅ | ✅ | 👁 | 👁 |
| **Program Kerja** | ✅ | ✅ | 👁 | 👁 |
| **Banner** | ✅ | ✅ | ❌ | 👁 |
| **Tokoh/Timeline/Masjid** | ✅ | ✅ | 👁 | 👁 |
| **Pengguna & Role** | ✅ | ❌ | ❌ | ❌ |
| **Settings & Menu** | ✅ | ❌ | ❌ | ❌ |
| **Activity Log** | ✅ | ✅ | ❌ | ❌ |
| Hapus permanen | ✅ | ✅* | ❌ | ❌ |

> ✅ = create/update/delete | 👁 = baca | ✅* = admin tidak bisa hapus pengguna/role

---

## 4. RLS Policies

### 4.1 Helper
```sql
create or replace function public.get_user_role_level() returns int as $$
  select coalesce(max(r.level), 0)
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = auth.uid();
$$ language sql stable security definer set search_path = public;
```

> Tambahkan kolom `level int` pada `public.roles` untuk perbandingan hierarki.

### 4.2 Pola Policy per Tabel

```sql
-- CONTOH: articles
-- 1) Read publik (published, non-deleted)
create policy "articles_public_read"
  on public.articles for select
  using (status = 'published' and deleted_at is null);

-- 2) Read internal (semua status untuk pengurus)
create policy "articles_staff_read"
  on public.articles for select
  to authenticated
  using (public.get_user_role_level() >= 1 and deleted_at is null);

-- 3) Write (editor+)
create policy "articles_editor_write"
  on public.articles for insert to authenticated
  with check (public.get_user_role_level() >= 2);

create policy "articles_editor_update"
  on public.articles for update to authenticated
  using (public.get_user_role_level() >= 2);

-- 4) Delete (admin+, soft via updated status)
create policy "articles_admin_delete"
  on public.articles for delete to authenticated
  using (public.get_user_role_level() >= 3);
```

### 4.3 Ringkasan Policy per Tabel

| Tabel | Select (anon/publik) | Select (staff) | Insert/Update | Delete |
|-------|:--------------------:|:--------------:|:-------------:|:------:|
| `articles` | published + not deleted | level ≥ 1 (semua status) | level ≥ 2 | level ≥ 3 |
| `categories`, `tags` | aktif | semua | level ≥ 2 | level ≥ 3 |
| `events` | non-deleted | semua | level ≥ 2 | level ≥ 3 |
| `announcements` | aktif & `expires_at > now()` | semua | level ≥ 2 | level ≥ 3 |
| `albums`, `media`, `gallery` | aktif | semua | level ≥ 2 | level ≥ 3 |
| `documents` | `visibility='public'` | semua | level ≥ 3 | level ≥ 3 |
| `downloads` | — (no direct select) | level ≥ 3 (analytics) | via function | — |
| `sermons` + `sermon_media` | published | semua | level ≥ 2 | level ≥ 3 |
| `organizations`, `positions` | semua | semua | level ≥ 3 | level ≥ 3 |
| `leaders` | aktif | semua | level ≥ 3 | level ≥ 3 |
| `institutions` | semua | semua | level ≥ 3 | level ≥ 3 |
| `programs`, `program_items` | aktif | semua | level ≥ 3 | level ≥ 3 |
| `timeline_events` | semua | semua | level ≥ 3 | level ≥ 3 |
| `figures`, `mosques` | semua | semua | level ≥ 3 | level ≥ 3 |
| `banners` | aktif + dalam range waktu | semua | level ≥ 3 | level ≥ 3 |
| `pages`, `menus` | published | semua | level ≥ 3 | level ≥ 3 |
| `settings` | whitelist key publik | whitelist | level ≥ 4 | — |
| `profiles` | kolom publik (nama, foto) | sendiri | owner / level ≥ 4 | — |
| `user_roles` | — | sendiri (read) | level ≥ 4 | level ≥ 4 |
| `activity_logs` | — | — (via function) | **no direct write** | level ≥ 4 |

---

## 5. Pola Akses Khusus

### 5.1 Dokumen Internal
```sql
create policy "documents_internal_read"
  on public.documents for select to authenticated
  using (
    public.get_user_role_level() >= 1
    or visibility = 'public'
  );
```
> Akses file Storage harus dicek juga (lihat Storage policy di bawah).

### 5.2 Storage Policy
```sql
-- Bucket documents: hanya staff yang bisa baca file internal
create policy "documents_staff_read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents'
    and public.get_user_role_level() >= 1
  );
```

| Bucket | anon read | staff write | staff read |
|--------|:---------:|:-----------:|:----------:|
| `public-assets` | ✅ | editor+ | ✅ |
| `documents` | ❌ (via public file dibedakan) | admin | ✅ (RLS) |
| `media-audio` | ✅ | editor+ | ✅ |
| `media-video` | ✅ | editor+ | ✅ |
| `avatars` | ✅ | owner/admin | ✅ |

---

## 6. Guard di Aplikasi (Server)

```ts
// lib/authz.ts (server-only)
import "server-only";

const LEVELS: Record<RoleName, number> = {
  viewer: 1, editor: 2, admin: 3, super_admin: 4,
};

export async function requireLevel(sb, min: number) {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const level = await getUserLevel(sb, user.id);
  if (level < min) throw new Error("FORBIDDEN");
  return { user, level };
}

// Penggunaan:
export async function createArticleAction(input: unknown) {
  await requireLevel(sb, LEVELS.editor);
  // ...
}
```

---

## 7. Uji Keamanan RLS

Setiap sprint, jalankan **RLS test suite** (lihat 16_TESTING_GUIDELINES.md):

1. `anon` tidak bisa SELECT data internal.
2. `viewer` tidak bisa INSERT/UPDATE/DELETE.
3. `editor` tidak bisa DELETE dokumen/admin data.
4. `admin` tidak bisa ubah role pengguna.
5. `user A` tidak bisa baca/ubah data milik `user B` (kecuali publik).
6. Soft-deleted rows tidak muncul di query publik.
7. Ekspired announcements tidak muncul.

---

## 8. Anti-Pattern

- ❌ Menonaktifkan RLS "sementara".
- ❌ Policy `true` pada tabel sensitif.
- ❌ `security definer` pada function tanpa `set search_path`.
- ❌ Memakai `service_role` key di app client (bypass RLS total).
- ❌ Cek role hanya di frontend (backend/DB harus mengamankan sendiri).

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
