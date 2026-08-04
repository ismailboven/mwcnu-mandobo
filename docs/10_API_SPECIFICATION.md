# API Specification: MWCNU Mandobo Web Platform

> Dokumentasi kontrak Server Actions (mutasi) dan read model (queries).
> v1.0 **tidak** membuka public REST API untuk third-party. Semua akses lewat halaman aplikasi.

---

## 1. Konvensi

### Response Shape (Server Action)
```ts
type ActionResult<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; code: ErrorCode; message: string; fieldErrors?: Record<string, string[]> };
```

### Error Codes
| Code | Arti |
|------|------|
| `UNAUTHORIZED` | Belum login |
| `FORBIDDEN` | Login tapi tidak punya akses |
| `NOT_FOUND` | Resource tidak ditemukan |
| `VALIDATION_ERROR` | Input tidak valid |
| `CONFLICT` | Duplikat (slug/nomor) |
| `RATE_LIMITED` | Terlalu banyak permintaan |
| `INTERNAL` | Error server |

---

## 2. Autentikasi

| Endpoint | Type | Deskripsi |
|----------|------|-----------|
| `auth.signUp` | Supabase | Daftar (email + password) |
| `auth.signInWithPassword` | Supabase | Login |
| `auth.signInWithOtp` | Supabase | Magic link |
| `auth.signInWithOAuth` | Supabase | Google |
| `auth.signOut` | Supabase | Logout |
| `auth.resetPasswordForEmail` | Supabase | Lupa password |
| `auth.updateUser` | Supabase | Ubah password/email |

> Detail flow di **11_AUTHENTICATION.md**.

---

## 3. Mutasi (Server Actions)

### 3.1 Berita
| Action | Signature | Peran |
|--------|-----------|-------|
| `createArticleAction(input: ArticleCreateInput)` | Validasi Zod → insert → log | editor+ |
| `updateArticleAction(id, input)` | Update + revalidate | editor+ |
| `deleteArticleAction(id)` | Soft delete + log | admin |
| `publishArticleAction(id)` | Set published_at + status | editor+ |
| `togglePinnedAction(id, order)` | Pin/featured, max 3 | admin |
| `incrementArticleViewsAction(slug)` | Hit counter (rate-limited) | anon |

**ArticleCreateInput (Zod)**
```ts
{
  title: z.string().min(10).max(160),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  categoryId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).default([]),
  status: z.enum(["draft", "published", "scheduled"]),
  scheduledFor: z.date().optional(),
  isFeatured: z.boolean().default(false),
}
```

### 3.2 Agenda
| Action | Signature | Peran |
|--------|-----------|-------|
| `createEventAction(input)` | Insert event | editor+ |
| `updateEventAction(id, input)` | Update | editor+ |
| `deleteEventAction(id)` | Soft delete | admin |
| `exportCalendarAction(id?)` | Generate `.ics` | anon |

### 3.3 Pengumuman
| Action | Signature | Peran |
|--------|-----------|-------|
| `createAnnouncementAction(input)` | Insert | editor+ |
| `updateAnnouncementAction(id, input)` | Update | editor+ |
| `deleteAnnouncementAction(id)` | Soft delete | admin |

### 3.4 Galeri / Media
| Action | Signature | Peran |
|--------|-----------|-------|
| `uploadMediaAction(file, metadata)` | Upload ke Storage → insert media | editor+ |
| `createAlbumAction(input)` | Insert album | editor+ |
| `addMediaToAlbumAction(albumId, mediaIds)` | Link album_media | editor+ |
| `deleteAlbumAction(id)` | Hapus album + relasi | admin |

### 3.5 Dokumen / Download
| Action | Signature | Peran |
|--------|-----------|-------|
| `uploadDocumentAction(file, metadata)` | Upload + insert documents | admin |
| `updateDocumentAction(id, metadata)` | Update metadata/versi | admin |
| `deleteDocumentAction(id)` | Soft delete | admin |
| `recordDownloadAction(documentId)` | Insert downloads + counter | anon/auth |

### 3.6 Struktur & Pengurus
| Action | Signature | Peran |
|--------|-----------|-------|
| `createOrganizationAction(input)` | Insert node tree | admin |
| `updateOrganizationAction(id, input)` | Update node | admin |
| `deleteOrganizationAction(id)` | Hapus (cek children) | admin |
| `upsertLeaderAction(input)` | Create/update pengurus | admin |
| `createInstitutionAction(input)` | Insert lembaga/banom | admin |

### 3.7 Program Kerja
| Action | Signature | Peran |
|--------|-----------|-------|
| `createProgramAction(input)` | Insert program | admin |
| `updateProgramProgressAction(itemId, progress)` | Update % | admin |
| `deleteProgramAction(id)` | Hapus | admin |

### 3.8 Kajian
| Action | Signature | Peran |
|--------|-----------|-------|
| `createSermonAction(input)` | Insert sermon + media links | editor+ |
| `updateSermonAction(id, input)` | Update | editor+ |
| `deleteSermonAction(id)` | Soft delete | admin |
| `incrementSermonViewsAction(slug)` | Hit | anon |

### 3.9 Konten Pendukung
| Action | Signature | Peran |
|--------|-----------|-------|
| `createTimelineEventAction(input)` | Timeline | admin |
| `upsertFigureAction(input)` | Tokoh | admin |
| `upsertMosqueAction(input)` | Masjid | admin |
| `upsertBannerAction(input)` | Banner | admin |
| `updateSettingsAction(key, value)` | Settings | admin |
| `upsertPageAction(input)` | Halaman statis | admin |
| `updateMenuAction(items)` | Menu | admin |

### 3.10 Pengguna
| Action | Signature | Peran |
|--------|-----------|-------|
| `inviteUserAction(email, role)` | Undang via Supabase invite | admin |
| `updateUserRoleAction(userId, roleId)` | Ubah peran | super_admin |
| `deactivateUserAction(userId)` | Nonaktifkan | super_admin |
| `updateProfileAction(input)` | Update profil sendiri | auth (owner) |

---

## 4. Read Model (Queries)

> Dipanggil dari Server Component via Repository. Bukan endpoint HTTP.

### 4.1 Berita
| Query | Param | Return |
|-------|-------|--------|
| `listPublished({page, limit, categorySlug, tagSlug, search})` | filter opsional | `PageResult<ArticleCard>` |
| `getPublishedBySlug(slug)` | slug | `Article` (content + author + tags) |
| `listFeatured(limit=3)` | — | `ArticleCard[]` pinned/featured |
| `listRelated(articleId, limit=4)` | kategori sama | `ArticleCard[]` |
| `getCategoriesTree()` | — | kategori + anak |

### 4.2 Agenda
| Query | Param | Return |
|-------|-------|--------|
| `listEvents({month, type, status})` | kalender | `EventCard[]` |
| `getEventBySlug(slug)` | — | `Event` |
| `listUpcoming(limit=6)` | — | `EventCard[]` |
| `getEventsBetween(start, end)` | — | untuk kalender bulanan |

### 4.3 Galeri
| Query | Param | Return |
|-------|-------|--------|
| `listAlbums()` | — | `AlbumCard[]` + cover |
| `getAlbumBySlug(slug)` | — | `Album` + media list |

### 4.4 Dokumen
| Query | Param | Return |
|-------|-------|--------|
| `listDocuments({category, visibility})` | RLS handle internal | `DocumentCard[]` |
| `getDocumentBySlug(slug)` | — | `Document` |
| `listRecentDownloads(limit=8)` | — | counter |

### 4.5 Struktur
| Query | Param | Return |
|-------|-------|--------|
| `getOrganizationTree()` | — | root + nested |
| `getLeadersByOrganization(orgId)` | — | pengurus + periode |
| `listInstitutions()` | — | lembaga/banom |

### 4.6 Konten Dakwah
| Query | Param | Return |
|-------|-------|--------|
| `listSermons({series, format})` | — | `SermonCard[]` |
| `getSermonBySlug(slug)` | — | sermon + media playlist |

### 4.7 Pendukung
| Query | Param | Return |
|-------|-------|--------|
| `getTimeline()` | — | `TimelineEvent[]` |
| `listFigures({category})` | — | `Figure[]` |
| `listMosques({village})` | — | `Mosque[]` + coords |
| `listActiveBanners()` | sekarang dalam range | `Banner[]` |
| `searchGlobal(q)` | debounce | grouped results |
| `getPublicSettings()` | keys publik | settings (kontak, nav) |

---

## 5. Search Contract

```
GET /api/search?q=ketua&type=all&page=1   [Server Route Handler]

Response:
{
  ok: true,
  data: {
    query: "ketua",
    total: 42,
    groups: {
      articles:  { total, items: [...] },
      events:    { total, items: [...] },
      sermons:   { total, items: [...] },
      documents: { total, items: [...] },
      leaders:   { total, items: [...] },
    },
    page: 1
  }
}
```
- Rate limit: 60 req/min per IP.
- Highlight: tambahkan `<mark>` pada snippet match.

---

## 6. Upload Contract (Storage)

```
POST /api/upload (Server Route, multipart)

Auth: required (editor+)
Body: file + entityType + entityId + mediaType

Response:
{
  ok: true,
  data: { mediaId, publicUrl, storagePath, sizeBytes, mimeType }
}
```

### Validasi Server-Side
- Max size: gambar 10MB, audio 50MB, video 200MB, pdf 20MB
- MIME whitelist: `image/*`, `audio/mpeg`, `video/mp4`, `application/pdf`
- Generate path: `{entityType}/{entityId}/{timestamp}-{sanitized-name}`
- Set `Cache-Control: public, max-age=31536000, immutable` di Storage

---

## 7. iCal Export

```
GET /api/events/{slug}.ics   atau   /api/calendar.ics

Content-Type: text/calendar; charset=utf-8
- Di-generate dari events aktif
- Field: SUMMARY, DTSTART, DTEND, LOCATION, DESCRIPTION, UID
```

---

## 8. Versioning & Deprecation

- v1.0: internal contract (Server Actions) — **tidak stabil secara publik**.
- v1.1+: jika membuka API publik, gunakan prefix `/api/v1/`, dokumentasi OpenAPI, auth via JWT/API key.
- Setiap perubahan breaking: tambah entry di changelog + roadmap.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
