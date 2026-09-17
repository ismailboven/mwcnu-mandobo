-- ============================================================================
-- MWCNU MANDOBO — COMPLETE DUMMY DATA SEED SCRIPT (SUPABASE SQL EDITOR READY)
-- ============================================================================
-- Petunjuk:
-- 1. Buka Supabase Dashboard -> SQL Editor
-- 2. Paste seluruh isi script ini dan klik "RUN"
-- 3. Script ini bersifat idempotent (aman dijalankan berulang kali tanpa duplikasi)
-- ============================================================================

-- 1. ROLES
INSERT INTO public.roles (name, description, level)
VALUES
  ('super_admin', 'Akses penuh seluruh sistem termasuk pengguna dan role', 4),
  ('admin', 'Mengelola semua konten dan konfigurasi', 3),
  ('editor', 'Membuat dan mengelola konten (berita, agenda, galeri, kajian)', 2),
  ('viewer', 'Hanya membaca konten internal (read-only)', 1)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description, level = EXCLUDED.level;

-- 2. KATEGORI BERITA
INSERT INTO public.categories (id, name, slug, is_active)
VALUES
  ('00000000-0000-0000-0005-000000000001', 'Berita', 'berita', true),
  ('00000000-0000-0000-0005-000000000002', 'Kegiatan', 'kegiatan', true),
  ('00000000-0000-0000-0005-000000000003', 'Kajian & Dakwah', 'kajian-dakwah', true),
  ('00000000-0000-0000-0005-000000000004', 'Sosial', 'sosial', true),
  ('00000000-0000-0000-0005-000000000005', 'Pendidikan', 'pendidikan', true)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, is_active = EXCLUDED.is_active;

-- 3. TAGS
INSERT INTO public.tags (name, slug)
VALUES
  ('NU', 'nu'),
  ('MWCNU', 'mwcnu'),
  ('Kajian', 'kajian'),
  ('Santri', 'santri'),
  ('Ramadan', 'ramadan'),
  ('Bakti Sosial', 'bakti-sosial'),
  ('Mandobo', 'mandobo')
ON CONFLICT (slug) DO NOTHING;

-- 4. PENGUMUMAN RESMI
INSERT INTO public.announcements (id, title, content, announcement_type, is_pinned, expires_at)
VALUES
  ('00000000-0000-0000-0007-000000000001', 'Pendaftaran Calon Pengurus Ranting & Anak Ranting Periode 2026-2030', 'Dibuka kesempatan khidmah bagi seluruh kader Nahdlatul Ulama di setiap ranting se-Distrik Mandobo. Berkas pendaftaran dan surat rekomendasi dapat diserahkan langsung ke sekretariat MWCNU paling lambat akhir bulan ini.', 'himbauan', true, '2026-12-31 23:59:59+00'),
  ('00000000-0000-0000-0007-000000000002', 'Jadwal Layanan Sekretariat & Konsultasi Syariah', 'Sekretariat MWCNU Mandobo beroperasi setiap Senin hingga Sabtu pukul 08.30 - 15.30 WIT untuk melayani administrasi persuratan, rekomendasi organisasi, dan bimbingan keagamaan.', 'info', true, NULL),
  ('00000000-0000-0000-0007-000000000003', 'Himbauan Pelaksanaan Sholat Istisqo & Doa Bersama Musim Kemarau', 'Menyikapi musim kemarau di Kabupaten Boven Digoel, jajaran Syuriyah menghimbau seluruh masjid dan musholla naungan NU menyelenggarakan sholat Istisqo memohon berkah hujan dan keselamatan.', 'peringatan', false, '2026-11-30 23:59:59+00')
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title, content = EXCLUDED.content, announcement_type = EXCLUDED.announcement_type, is_pinned = EXCLUDED.is_pinned;

-- 5. LEMBAGA & BADAN OTONOM (BANOM)
INSERT INTO public.institutions (name, slug, abbreviation, description, category, chairman, contact_email, sort_order)
VALUES
  ('Lembaga Dakwah Nahdlatul Ulama Mandobo', 'ldnu-mandobo', 'LDNU', 'Mengembangkan dakwah Ahlussunnah wal Jama''ah melalui mimbar, majelis taklim, dan digitalisasi dakwah.', 'lembaga', 'Ustadz H. Mahfudz', 'ldnu@mwcnumandobo.or.id', 1),
  ('Lembaga Pendidikan Ma''arif NU Mandobo', 'lp-marif-mandobo', 'LP Ma''arif', 'Membina madrasah, sekolah Islam, dan TPQ di wilayah Distrik Mandobo.', 'lembaga', 'Drs. H. Mulyadi', 'maarif@mwcnumandobo.or.id', 2),
  ('LAZISNU Mandobo', 'lazisnu-mandobo', 'LAZISNU', 'Lembaga Amil Zakat, Infaq, dan Shadaqah untuk pengentasan kemiskinan dan kemandirian umat.', 'lembaga', 'Ahmad Fauzi, S.Sos.', 'lazisnu@mwcnumandobo.or.id', 3),
  ('Gerakan Pemuda Ansor Mandobo', 'gp-ansor-mandobo', 'GP Ansor', 'Kader muda garda terdepan penjaga ulama, NKRI, dan nilai-nilai kebangsaan.', 'banom', 'Sahabat Hasan Basri', 'ansor@mwcnumandobo.or.id', 4),
  ('Muslimat NU Mandobo', 'muslimat-mandobo', 'Muslimat NU', 'Wadah perempuan nahdliyin dalam dakwah sosial, kesehatan, dan keluarga maslahah.', 'banom', 'Hj. Siti Rahmah', 'muslimat@mwcnumandobo.or.id', 5),
  ('Fatayat NU Mandobo', 'fatayat-mandobo', 'Fatayat NU', 'Pemberdayaan pemudi nahdliyin di bidang pendidikan, ekonomi kreatif, dan kepemimpinan.', 'banom', 'Sahabat Nurul Hidayah, S.Pd.', 'fatayat@mwcnumandobo.or.id', 6),
  ('IPNU - IPPNU Mandobo', 'ipnu-ippnu-mandobo', 'IPNU-IPPNU', 'Ikatan Pelajar Nahdlatul Ulama & Pelajar Putri NU untuk kaderisasi generasi muda penerus.', 'banom', 'Rekan Fajar Ramadhan', 'ipnu@mwcnumandobo.or.id', 7)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation, description = EXCLUDED.description, chairman = EXCLUDED.chairman, contact_email = EXCLUDED.contact_email;

-- 6. ORGANISASI & POSISI & PENGURUS
INSERT INTO public.organizations (id, name, kind, slug, description, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'MWCNU Mandobo', 'mwcnu', 'mwcnu-mandobo', 'Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.positions (id, organization_id, title, sort_order)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Rais Syuriyah', 1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Wakil Rais Syuriyah', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Ketua Tanfidziyah', 3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Sekretaris', 4),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'Bendahara', 5)
ON CONFLICT (organization_id, title) DO NOTHING;

INSERT INTO public.leaders (id, organization_id, position_id, name, term_start, term_end, is_active, bio, phone, email, sort_order)
VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'KH. Syamsul Huda, Lc.', '2026-01-01', '2030-12-31', true, 'Pengasuh Pondok Pesantren di Boven Digoel, mendedikasikan hidup untuk bimbingan spiritual umat.', '+6281234567801', 'rois@mwcnumandobo.or.id', 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002', 'K.H. Nur Cholish', '2026-01-01', '2030-12-31', true, 'Wakil Rais Syuriyah, aktif dalam majelis fatwa dan pembinaan hukum Islam.', '+6281234567802', 'wakilrois@mwcnumandobo.or.id', 2),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003', 'H. Muhammad Nur, S.Ag.', '2026-01-01', '2030-12-31', true, 'Ketua Tanfidziyah MWCNU Mandobo periode 2026-2030, fokus memodernisasi tata kelola organisasi.', '+6281234567803', 'ketua@mwcnumandobo.or.id', 3),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004', 'Ustadz Ahmad Zainuri, Lc.', '2026-01-01', '2030-12-31', true, 'Sekretaris MWCNU Mandobo, mengkoordinir operasional harian dan sistem arsip digital.', '+6281234567804', 'sekretaris@mwcnumandobo.or.id', 4),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000005', 'Muhammad Ridwan, S.E.', '2026-01-01', '2030-12-31', true, 'Bendahara MWCNU Mandobo, penanggung jawab transparansi akuntabilitas keuangan organisasi.', '+6281234567805', 'bendahara@mwcnumandobo.or.id', 5)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, bio = EXCLUDED.bio, phone = EXCLUDED.phone, email = EXCLUDED.email;

-- 7. BERITA ARTIKEL
INSERT INTO public.articles (id, title, slug, excerpt, content, category_id, status, is_featured, is_pinned, pinned_order, published_at, view_count)
VALUES
  (
    '00000000-0000-0000-0006-000000000001',
    'MWCNU Mandobo Gelar Rapat Pleno Perdana Periode 2026-2030',
    'rapat-pleno-perdana-2026-2030',
    'Pengurus MWCNU Mandobo menggelar rapat pleno perdana untuk menyusun program kerja lima tahun ke depan.',
    '<p>Tanah Merah, Boven Digoel — Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Mandobo periode 2026-2030 menggelar rapat pleno perdana di Kantor MWCNU Mandobo.</p><p>Rapat ini membahas penyusunan program kerja, pembagian tupoksi, serta penguatan koordinasi dengan lembaga dan banom di lingkungan NU Mandobo.</p><p>Ketua MWCNU Mandobo menegaskan pentingnya kerja sama dan amanah dalam melayani umat di Distrik Mandobo dan sekitarnya.</p>',
    '00000000-0000-0000-0005-000000000002',
    'published',
    true,
    true,
    1,
    NOW() - INTERVAL '5 days',
    214
  ),
  (
    '00000000-0000-0000-0006-000000000002',
    'Kajian Rutin Ahad Pagi: Menata Hati di Bulan Ramadan',
    'kajian-ahad-pagi-menata-hati-ramadan',
    'Kajian rutin Ahad pagi bersama Ustadz Ahmad Zainuri membahas tazkiyatun nafs di bulan Ramadan.',
    '<p>Kajian rutin Ahad pagi kembali digelar di Masjid Baiturrahman, Tanah Merah. Mengangkat tema ''Menata Hati di Bulan Ramadan'', ustadz mengajak jamaah memperbanyak amal dan menjaga lisan.</p><p>Kegiatan ini diikuti puluhan jamaah dari berbagai ranting dan diakhiri dengan sesi tanya jawab.</p>',
    '00000000-0000-0000-0005-000000000003',
    'published',
    false,
    false,
    0,
    NOW() - INTERVAL '3 days',
    178
  ),
  (
    '00000000-0000-0000-0006-000000000003',
    'Santunan Anak Yatim dan Dhuafa Menyambut Hari Raya',
    'santunan-anak-yatim-dhuafa-2026',
    'Lembaga Sosial MWCNU Mandobo menyalurkan santunan kepada anak yatim dan dhuafa di wilayah Mandobo.',
    '<p>LazisNU Mandobo bersama MWCNU menyalurkan santunan kepada 75 anak yatim dan dhuafa. Penyaluran dilakukan di Balai Kampung, dihadiri pengurus ranting dan tokoh masyarakat.</p><p>Program ini merupakan wujud kepedulian NU terhadap warga yang membutuhkan di Distrik Mandobo.</p>',
    '00000000-0000-0000-0005-000000000004',
    'published',
    true,
    false,
    0,
    NOW() - INTERVAL '8 days',
    342
  ),
  (
    '00000000-0000-0000-0006-000000000004',
    'MWCNU Mandobo Luncurkan Program Pendidikan Al-Qur''an',
    'program-pendidikan-alquran',
    'MWCNU Mandobo bersama LP Ma''arif meluncurkan program pendidikan baca tulis Al-Qur''an untuk anak-anak.',
    '<p>Program pendidikan Al-Qur''an resmi diluncurkan sebagai bagian dari upaya penguatan literasi keagamaan generasi muda di Mandobo.</p><p>Program ini akan berjalan di tiap ranting dengan pendampingan para guru TPQ.</p>',
    '00000000-0000-0000-0005-000000000005',
    'published',
    false,
    false,
    0,
    NOW() - INTERVAL '12 days',
    96
  ),
  (
    '00000000-0000-0000-0006-000000000005',
    'Pengurus Ranting Dilantik, Siap Gerakkan Organisasi',
    'pelantikan-pengurus-ranting-2026',
    'Pelantikan pengurus ranting se-Distrik Mandobo berlangsung khidmat dan dihadiri unsur pemerintah distrik.',
    '<p>Pelantikan pengurus ranting se-Distrik Mandobo digelar di Aula Kantor Distrik. Masa khidmat pengurus baru adalah 2026-2030.</p><p>Dalam sambutannya, Ketua MWCNU berpesan agar pengurus ranting aktif mendampingi warga dan menjaga ukhuwah.</p>',
    '00000000-0000-0000-0005-000000000001',
    'published',
    false,
    false,
    0,
    NOW() - INTERVAL '15 days',
    125
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, category_id = EXCLUDED.category_id, status = EXCLUDED.status;

-- 8. AGENDA & KEGIATAN
INSERT INTO public.events (id, title, slug, description, event_type, status, starts_at, ends_at, location, organizer, pic_name, is_featured)
VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    'Kajian Rutin Ahad Pagi',
    'kajian-rutin-ahad-pagi',
    'Kajian pekanan bertema keislaman dan ke-NU-an bersama jamaah Mandobo.',
    'kajian',
    'upcoming',
    NOW() + INTERVAL '4 days 8 hours',
    NOW() + INTERVAL '4 days 10 hours',
    'Masjid Baiturrahman, Tanah Merah',
    'MWCNU Mandobo',
    'Ustadz Ahmad Zainuri',
    true
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    'Rapat Koordinasi Pengurus Bulanan',
    'rapat-koordinasi-pengurus-bulanan',
    'Evaluasi program kerja dan penyusunan langkah strategis bulan berikutnya.',
    'rapat',
    'upcoming',
    NOW() + INTERVAL '9 days 9 hours',
    NULL,
    'Kantor MWCNU Mandobo',
    'Pengurus Harian',
    'Sekretariat',
    false
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    'Bakti Sosial dan Santunan Anak Yatim',
    'bakti-sosial-santunan-anak-yatim',
    'Penyaluran santunan dan bingkisan kepada anak yatim serta warga kurang mampu.',
    'sosial',
    'upcoming',
    NOW() + INTERVAL '16 days 8 hours',
    NOW() + INTERVAL '16 days 12 hours',
    'Balai Kampung Mandobo',
    'LazisNU Mandobo',
    'Ahmad Fauzi, S.Sos.',
    true
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    'Pelatihan Dakwah untuk Kader Muda',
    'pelatihan-dakwah-kader-muda',
    'Pelatihan teknik ceramah dan manajemen dakwah bagi kader muda NU.',
    'pelatihan',
    'upcoming',
    NOW() + INTERVAL '23 days 9 hours',
    NOW() + INTERVAL '24 days 15 hours',
    'Aula Kantor Distrik Mandobo',
    'Lembaga Dakwah NU',
    'Ustadz H. Mahfudz',
    false
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description, starts_at = EXCLUDED.starts_at, location = EXCLUDED.location;

-- 9. DOKUMEN & UNDUHAN
INSERT INTO public.documents (title, slug, description, category, visibility, document_number, issued_date, subject, file_url, file_size_bytes, mime_type, version, download_count)
VALUES
  (
    'Surat Keputusan (SK) Susunan Pengurus MWCNU Mandobo 2026-2030',
    'sk-susunan-pengurus-mwcnu-mandobo-2026-2030',
    'Salinan resmi Surat Keputusan PCNU Boven Digoel tentang pengesahan susunan pengurus MWCNU Mandobo masa khidmat 2026-2030.',
    'sk',
    'public',
    '012/SK/PCNU-BVD/VIII/2026',
    '2026-01-15',
    'Pengesahan Pengurus',
    'https://example.com/docs/sk-pengurus-2026.pdf',
    2450000,
    'application/pdf',
    1,
    142
  ),
  (
    'Panduan Manajemen Kemakmuran & Aset Masjid NU',
    'panduan-manajemen-kemakmuran-aset-masjid',
    'Pedoman tata kelola administrasi, ta''mir, dan perlindungan aset wakaf masjid naungan Lembaga Ta''mir Masjid.',
    'panduan',
    'public',
    '004/PD/LTM-MWC/2026',
    '2026-02-10',
    'Pedoman Ta''mir',
    'https://example.com/docs/panduan-masjid.pdf',
    3820000,
    'application/pdf',
    1,
    89
  ),
  (
    'Kumpulan Khutbah Jumat Pilihan Bahasa Indonesia & Arab',
    'kumpulan-khutbah-jumat-pilihan',
    'Materi khutbah tematik seputar ukhuwah wathaniyah, moderasi beragama, dan tasamuh bernafaskan Ahlussunnah wal Jama''ah.',
    'khutbah',
    'public',
    '008/KH/LDNU/2026',
    '2026-03-01',
    'Materi Khutbah',
    'https://example.com/docs/khutbah-jumat-mwc.pdf',
    1950000,
    'application/pdf',
    2,
    267
  ),
  (
    'Formulir Pendaftaran Kaderisasi & Anggota NU',
    'formulir-pendaftaran-kaderisasi-anggota-nu',
    'Formulir registrasi keanggotaan dan pendaftaran kaderisasi tingkat distrik.',
    'formulir',
    'public',
    '001/FRM/MWC/2026',
    '2026-01-05',
    'Formulir Anggota',
    'https://example.com/docs/formulir-anggota.pdf',
    520000,
    'application/pdf',
    1,
    115
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description, file_url = EXCLUDED.file_url;

-- 10. KAJIAN & DAKWAH
INSERT INTO public.sermons (title, slug, summary, speaker, series, cover_image_url, published_at, view_count)
VALUES
  (
    'Menjaga Sanad Keilmuan & Tradisi Keagamaan di Tanah Papua',
    'menjaga-sanad-keilmuan-tradisi-tanah-papua',
    'Ulasan mendalam mengenai pentingnya bersandar pada ulama muktabar dan menjaga kerukunan antar umat beragama.',
    'KH. Ahmad Marzuqi, M.Pd.',
    'Kajian Aswaja An-Nahdliyah',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    NOW() - INTERVAL '10 days',
    430
  ),
  (
    'Filsafat Zakat & Keadilan Sosial Berbasis Jam''iyyah',
    'filsafat-zakat-keadilan-sosial',
    'Bagaimana LazisNU menggerakkan ekonomi umat melalui transparansi dan ketepatan sasaran mustahiq.',
    'Ustadz M. Ridwan, S.E.',
    'Fiqih Muamalah & Kedermawanan',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    NOW() - INTERVAL '20 days',
    285
  ),
  (
    'Pendidikan Karakter Anak Berlandaskan Akhlaqul Karimah',
    'pendidikan-karakter-anak-akhlaqul-karimah',
    'Strategi keluarga nahdliyin dalam mendidik generasi penerus menghadapi era kecerdasan buatan.',
    'Nyai Hj. Siti Rahmah',
    'Keluarga Maslahah',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    NOW() - INTERVAL '35 days',
    312
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, summary = EXCLUDED.summary, speaker = EXCLUDED.speaker, cover_image_url = EXCLUDED.cover_image_url;

-- 11. ALBUM GALERI
INSERT INTO public.albums (title, slug, description)
VALUES
  ('Konferensi & Pelantikan Pengurus MWCNU Mandobo 2026-2030', 'pelantikan-pengurus-mwcnu-2026', 'Dokumentasi prosesi bai''at dan pelantikan pengurus di Gedung Serbaguna Mandobo.'),
  ('Penyaluran Santunan Ramadhan & Beras Dhuafa', 'santunan-ramadhan-dhuafa', 'Kegiatan bakti sosial dan pembagian sembako dari LazisNU untuk warga Mandobo.'),
  ('Peringatan Hari Santri Nasional & Kirab Merah Putih', 'hari-santri-kirab-merah-putih', 'Apel Akbar ribuan santri dan kader badan otonom di Lapangan Tanah Merah.')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description;

-- 12. PROGRAM KERJA
INSERT INTO public.programs (id, title, slug, description, field, period, status, sort_order)
VALUES
  ('00000000-0000-0000-0004-000000000001', 'Penguatan Literasi & Digitalisasi Organisasi', 'penguatan-literasi-digitalisasi-organisasi', 'Pembangunan portal digital resmi, arsip daring, dan kanal publikasi multi-platform terpadu.', 'Informasi & Komunikasi', '2026-2028', 'active', 1),
  ('00000000-0000-0000-0004-000000000002', 'Kemandirian Ekonomi Jamaah & Koin LazisNU', 'kemandirian-ekonomi-jamaah-koin-lazisnu', 'Gerakan Koin NU di setiap ranting untuk mendukung dana abadi pendidikan dan santunan sosial.', 'Sosial & Ekonomi', '2026-2030', 'active', 2),
  ('00000000-0000-0000-0004-000000000003', 'Revitalisasi & Pembinaan Kaderisasi Berjenjang', 'revitalisasi-pembinaan-kaderisasi', 'Penyelenggaraan Pendidikan Kader Penggerak NU (PKPNU) dan Masa Kesetiaan Anggota (Makesta).', 'Kaderisasi', '2026-2027', 'active', 3)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description, field = EXCLUDED.field, period = EXCLUDED.period, status = EXCLUDED.status;

INSERT INTO public.program_items (program_id, title, description, progress, status, target_date, sort_order)
VALUES
  ('00000000-0000-0000-0004-000000000001', 'Peluncuran Portal Resmi Web & Database Terpusat', 'Membangun sistem informasi berbasis web dengan performa tinggi & akses mobile-first.', 100, 'completed', '2026-08-31', 1),
  ('00000000-0000-0000-0004-000000000001', 'Digitalisasi Arsip Surat & SK Pengurus Se-Distrik', 'Pengumpulan dan digitalisasi dokumen historis serta SK ranting.', 60, 'active', '2026-11-30', 2),
  ('00000000-0000-0000-0004-000000000002', 'Distribusi 500 Kotak Koin NU ke Rumah Jamaah', 'Penyaluran kotak koin untuk pengumpulan infaq harian jamaah.', 80, 'active', '2026-10-15', 1),
  ('00000000-0000-0000-0004-000000000002', 'Beasiswa Pendidikan Santri Prasejahtera Mandobo', 'Bantuan SPP dan kitab bagi 30 santri berprestasi.', 50, 'active', '2026-12-31', 2),
  ('00000000-0000-0000-0004-000000000003', 'Pendidikan Kader Penggerak NU (PKPNU) Angkatan I', 'Kaderisasi intensif 3 hari bersama instruktur PWNU.', 30, 'active', '2027-02-15', 1)
ON CONFLICT DO NOTHING;

-- 13. SEJARAH & TOKOH
INSERT INTO public.timeline_events (year_start, year_end, title, description, sort_order)
VALUES
  (1985, NULL, 'Awal Mula Masuknya Warga Nahdliyin di Tanah Merah', 'Gelombang pendatang dan perintis dakwah dari Jawa dan Sulawesi mulai mengadakan pengajian tahlilan dan istighotsah rutin di Tanah Merah, Boven Digoel.', 1),
  (1998, NULL, 'Pendirian Majelis Taklim & Musholla Pertama', 'Pembangunan sarana ibadah pertama yang menjadi pusat berkumpulnya para sesepuh nahdliyin dan rintisan pendidikan Al-Qur''an anak-anak.', 2),
  (2008, NULL, 'Pembentukan Struktur MWCNU Mandobo', 'Peresmian status struktural MWCNU Mandobo di bawah naungan Cabang Boven Digoel untuk mengonsolidasi seluruh ranting dan banom.', 3),
  (2026, NULL, 'Transformasi Digital & Visi Modern Nusantara', 'Peluncuran platform digital resmi dan penegasan komitmen dakwah moderat di perbatasan timur Nusantara.', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.figures (name, slug, title, category, birth_place, birth_year, bio, quote, sort_order)
VALUES
  ('KH. Syamsul Huda, Lc.', 'kh-syamsul-huda', 'Rais Syuriyah', 'ulama', 'Jember', 1968, 'Tokoh ulama perintis kajian kitab kuning dan penasehat keagamaan lintas etnis di Boven Digoel.', 'Rawatlah ukhuwah sebagaimana kita merawat iman, sebab persaudaraan adalah ladang subur tumbuhnya kebaikan.', 1),
  ('H. Muhammad Nur, S.Ag.', 'h-muhammad-nur', 'Ketua Tanfidziyah', 'aktivis', 'Makassar', 1975, 'Pendidik dan tokoh penggerak kemasyarakatan yang aktif mengawal kerukunan sosial di Papua Selatan.', 'Teknologi adalah sarana, tujuan kita tetap satu: melayani umat dengan keikhlasan dan keteladanan.', 2)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, bio = EXCLUDED.bio, quote = EXCLUDED.quote;

-- 14. BANNERS
INSERT INTO public.banners (title, subtitle, image_url, is_active, sort_order)
VALUES
  ('Selamat Datang di Portal Resmi MWCNU Mandobo', 'Membangun peradaban melalui dakwah, pendidikan, dan pelayanan umat.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1600&q=80', true, 1),
  ('Kajian Rutin Ahad Pagi', 'Masjid Baiturrahman, setiap Ahad pukul 08.00 WIT', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80', true, 2)
ON CONFLICT DO NOTHING;
