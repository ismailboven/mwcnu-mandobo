# User Personas: MWCNU Mandobo Web Platform

---

## 1. Cara Menggunakan Dokumen Ini

- Personas dipakai sebagai **acuan desain & prioritas fitur**.
- Setiap keputusan produk harus bisa dijawab: *"Bagaimana ini membantu persona mana?"*
- Personas bersifat **contoh representatif**, bukan data lapangan. Validasi lanjutan melalui wawancara pengurus disarankan.

---

## 2. Persona 1 — Pengurus Aktif (Internal / Admin)

### "Pak Suryadi" — Wakil Ketua / Sekretaris, 48 tahun
| Atribut | Detail |
|---------|--------|
| **Peran** | Sekretaris MWCNU Mandobo, aktif 10+ tahun |
| **Konteks** | Kelola agenda, surat menyurat, arsip SK, koordinasi pengurus |
| **Perangkat** | Android (mid-range), laptop kantor; koneksi 3G-4G kadang lemah |
| **Kemampuan digital** | Menengah; familiar WhatsApp, Google Drive, jarang pakai admin panel modern |
| **Kebutuhan** | - Upload/publish konten cepat tanpa belajar sistem rumit<br>- Arsip terpusat yang mudah dicari<br>- Struktur organisasi terkini untuk koordinasi |
| **Pain Points** | Surat & SK berserakan; pengurus tidak tahu jadwal; tidak ada jejak digital |
| **Goal** | Semua administrasi transparan, cepat, dan terdokumentasi |
| **Kriteria Sukses** | Bisa publish berita + upload SK dalam < 5 menit dari HP |

> **Dampak desain**: Admin panel harus **mobile-friendly**, form minimal, upload drag-drop, tidak ada jargon teknis. UX pendidikan (inline help). Huruf besar, kontras tinggi.

---

## 3. Persona 2 — Kader Muda / Anggota

### "Rahmat" — Mahasiswa & Anggota IPNU-IPPNU, 21 tahun
| Atribut | Detail |
|---------|--------|
| **Peran** | Kader muda, mengikuti kajian & kegiatan |
| **Konteks** | Cari info kajian, unduh materi, ikut agenda, cari pengurus untuk keperluan organisasi |
| **Perangkat** | Smartphone modern; fast internet |
| **Kemampuan digital** | Tinggi; terbiasa aplikasi modern (Instagram, TikTok, Notion) |
| **Kebutuhan** | - Konten kekinian & inspiratif<br>- Kajian dalam berbagai format (video/audio/PDF)<br>- Struktur organisasi interaktif untuk memahami organisasi<br>- Berbagi konten ke medsos |
| **Pain Points** | Informasi tersebar di grup WA; tidak ada arsip yang rapih; branding kuno |
| **Goal** | Terlibat aktif, belajar dari tokoh, merasa bagian dari organisasi yang modern |
| **Kriteria Sukses** | Menemukan jadwal kajian bulan ini dalam 30 detik, bisa share ke teman |

> **Dampak desain**: Modern, cepat, animasi halus, mudah share (OG image menarik), mobile-first, dark mode.

---

## 4. Persona 3 — Jamaah Umum / Publik

### "Ibu Siti" — Jamaah Pengajian, 55 tahun
| Atribut | Detail |
|---------|--------|
| **Peran** | Jamaah masjid, pengikut pengajian rutin |
| **Konteks** | Cari jadwal pengajian, unduh ceramah, cek pengumuman |
| **Perangkat** | Android entry-level; sering sinyal lemah |
| **Kemampuan digital** | Rendah-menengah; WhatsApp & YouTube saja |
| **Kebutuhan** | - Tampilan sederhana, teks besar<br>- Informasi jelas (apa, kapan, di mana)<br>- Audio ceramah mudah diputar |
| **Pain Points** | Jadwal tidak jelas; materi tidak bisa diakses; teks terlalu kecil |
| **Goal** | Tidak ketinggalan kegiatan, merasa dilayani |
| **Kriteria Sukses** | Menemukan jadwal pengajian + memutar audio tanpa bantuan |

> **Dampak desain**: Aksesibilitas WCAG AA (kontras, ukuran font), audio player sederhana, tanpa pop-up, loading cepat di 3G, teks Indonesia yang ramah.

---

## 5. Persona 4 — Organisasi NU Lain / Pemerintah

### "Kak Dewi" — Staff Sekretariat PCNU Kabupaten / Dinas Kementerian Agama, 32 tahun
| Atribut | Detail |
|---------|--------|
| **Peran** | Perwakilan lembaga eksternal |
| **Konteks** | Verifikasi keabsahan organisasi, mencari kontak resmi, referensi struktur, kerjasama program |
| **Perangkat** | Laptop kantor |
| **Kebutuhan** | - Informasi resmi & kredibel (SK, struktur, kontak)<br>- Kecepatan menemukan data<br>- Kontak pengurus yang valid |
| **Pain Points** | Sulit verifikasi keabsahan; data kontak tidak update |
| **Goal** | Mendapat data organisasi yang akurat dan dapat dipercaya |
| **Kriteria Sukses** | Menemukan SK/struktur terbaru dalam 1 menit, kontak valid |

> **Dampak desain**: Halaman profil & struktur yang authoritative (JSON-LD Organization, schema), dokumentasi publik lengkap, kontak terpampang jelas, halaman statis yang cepat diindeks.

---

## 6. Matriks Kebutuhan vs Fitur

| Fitur | Suryadi (Admin) | Rahmat (Kader) | Ibu Siti (Publik) | Dewi (Eksternal) |
|-------|:-:|:-:|:-:|:-:|
| CMS Berita | ✅ | ✅ | ✅ | ➖ |
| Agenda/Kalender | ✅ | ✅ | ✅ | ➖ |
| Galeri | ✅ | ✅ | ➖ | ➖ |
| Download Center | ✅ | ✅ | ✅ | ✅ |
| Struktur Interaktif | ✅ | ✅ | ➖ | ✅ |
| Kajian Multi-format | ➖ | ✅ | ✅ | ➖ |
| Pencarian Global | ✅ | ✅ | ➖ | ✅ |
| Dark Mode | ➖ | ✅ | ➖ | ➖ |
| Aksesibilitas | ✅ | ✅ | ✅ | ✅ |
| SEO/JSON-LD | ➖ | ➖ | ➖ | ✅ |

> ✅ = berdampak besar | ➖ = dampak kecil

---

## 7. Prinsip Desain Berdasarkan Personas

1. **Suryadi pertama** — kelola konten semudah pakai WhatsApp.
2. **Ibu Siti tidak boleh tersesat** — navigasi 1 tingkat, label jelas.
3. **Rahmat harus bangga share** — visual menawan & shareable.
4. **Dewi harus percaya** — data akurat, dokumen resmi, schema terstruktur.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
