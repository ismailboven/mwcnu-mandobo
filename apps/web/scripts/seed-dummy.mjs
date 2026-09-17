#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Env belum lengkap. Jalankan dari apps/web dengan --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

const now = new Date();
const daysAgo = (n, hour = 8) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const daysAhead = (n, hour = 19) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const categories = [
  { name: "Berita", slug: "berita", is_active: true },
  { name: "Kegiatan", slug: "kegiatan", is_active: true },
  { name: "Kajian & Dakwah", slug: "kajian-dakwah", is_active: true },
  { name: "Sosial", slug: "sosial", is_active: true },
  { name: "Pendidikan", slug: "pendidikan", is_active: true },
];

const tags = [
  { name: "NU", slug: "nu" },
  { name: "MWCNU", slug: "mwcnu" },
  { name: "Kajian", slug: "kajian" },
  { name: "Santri", slug: "santri" },
  { name: "Ramadan", slug: "ramadan" },
  { name: "Bakti Sosial", slug: "bakti-sosial" },
];

const articles = [
  {
    title: "MWCNU Mandobo Gelar Rapat Pleno Perdana Periode 2026-2030",
    slug: "rapat-pleno-perdana-2026-2030",
    excerpt:
      "Pengurus MWCNU Mandobo menggelar rapat pleno perdana untuk menyusun program kerja lima tahun ke depan.",
    content:
      "<p>Tanah Merah, Boven Digoel — Pengurus Majelis Wakil Cabang Nahdlatul Ulama (MWCNU) Mandobo periode 2026-2030 menggelar rapat pleno perdana di Kantor MWCNU Mandobo.</p><p>Rapat ini membahas penyusunan program kerja, pembagian tupoksi, serta penguatan koordinasi dengan lembaga dan banom di lingkungan NU Mandobo.</p><p>Ketua MWCNU Mandobo menegaskan pentingnya kerja sama dan amanah dalam melayani umat di Distrik Mandobo dan sekitarnya.</p>",
    category_slug: "kegiatan",
    status: "published",
    is_featured: true,
    is_pinned: true,
    pinned_order: 1,
    published_at: daysAgo(5, 9),
    view_count: 214,
  },
  {
    title: "Kajian Rutin Ahad Pagi: Menata Hati di Bulan Ramadan",
    slug: "kajian-ahad-pagi-menata-hati-ramadan",
    excerpt:
      "Kajian rutin Ahad pagi bersama Ustadz Ahmad Zainuri membahas tazkiyatun nafs di bulan Ramadan.",
    content:
      "<p>Kajian rutin Ahad pagi kembali digelar di Masjid Baiturrahman, Tanah Merah. Mengangkat tema 'Menata Hati di Bulan Ramadan', ustadz mengajak jamaah memperbanyak amal dan menjaga lisan.</p><p>Kegiatan ini diikuti puluhan jamaah dari berbagai ranting dan diakhiri dengan sesi tanya jawab.</p>",
    category_slug: "kajian-dakwah",
    status: "published",
    is_featured: false,
    is_pinned: false,
    pinned_order: 0,
    published_at: daysAgo(3, 9),
    view_count: 178,
  },
  {
    title: "Santunan Anak Yatim dan Dhuafa Menyambut Hari Raya",
    slug: "santunan-anak-yatim-dhuafa-2026",
    excerpt:
      "Lembaga Sosial MWCNU Mandobo menyalurkan santunan kepada anak yatim dan dhuafa di wilayah Mandobo.",
    content:
      "<p>LazisNU Mandobo bersama MWCNU menyalurkan santunan kepada 75 anak yatim dan dhuafa. Penyaluran dilakukan di Balai Kampung, dihadiri pengurus ranting dan tokoh masyarakat.</p><p>Program ini merupakan wujud kepedulian NU terhadap warga yang membutuhkan di Distrik Mandobo.</p>",
    category_slug: "sosial",
    status: "published",
    is_featured: true,
    is_pinned: false,
    pinned_order: 0,
    published_at: daysAgo(8, 10),
    view_count: 342,
  },
  {
    title: "MWCNU Mandobo Luncurkan Program Pendidikan Al-Qur'an",
    slug: "program-pendidikan-alquran",
    excerpt:
      "MWCNU Mandobo bersama LP Ma'arif meluncurkan program pendidikan baca tulis Al-Qur'an untuk anak-anak.",
    content:
      "<p>Program pendidikan Al-Qur'an resmi diluncurkan sebagai bagian dari upaya penguatan literasi keagamaan generasi muda di Mandobo.</p><p>Program ini akan berjalan di tiap ranting dengan pendampingan para guru TPQ.</p>",
    category_slug: "pendidikan",
    status: "published",
    is_featured: false,
    is_pinned: false,
    pinned_order: 0,
    published_at: daysAgo(12, 8),
    view_count: 96,
  },
  {
    title: "Pengurus Ranting Dilantik, Siap Gerakkan Organisasi",
    slug: "pelantikan-pengurus-ranting-2026",
    excerpt:
      "Pelantikan pengurus ranting se-Distrik Mandobo berlangsung khidmat dan dihadiri unsur pemerintah distrik.",
    content:
      "<p>Pelantikan pengurus ranting se-Distrik Mandobo digelar di Aula Kantor Distrik. Masa khidmat pengurus baru adalah 2026-2030.</p><p>Dalam sambutannya, Ketua MWCNU berpesan agar pengurus ranting aktif mendampingi warga dan menjaga ukhuwah.</p>",
    category_slug: "berita",
    status: "published",
    is_featured: false,
    is_pinned: false,
    pinned_order: 0,
    published_at: daysAgo(15, 9),
    view_count: 125,
  },
  {
    title: "Khitanan Massal Gratis untuk Masyarakat Kurang Mampu",
    slug: "khitanan-massal-gratis",
    excerpt:
      "Kerja sama MWCNU Mandobo dengan fasilitas kesehatan menggelar khitanan massal gratis.",
    content:
      "<p>MWCNU Mandobo bekerja sama dengan Puskesmas setempat menggelar khitanan massal gratis bagi puluhan anak dari keluarga kurang mampu.</p><p>Kegiatan ini disambut antusias warga dan menjadi agenda rutin tahunan lembaga sosial.</p>",
    category_slug: "sosial",
    status: "published",
    is_featured: false,
    is_pinned: false,
    pinned_order: 0,
    published_at: daysAgo(20, 8),
    view_count: 88,
  },
];

const events = [
  {
    title: "Kajian Rutin Ahad Pagi",
    slug: "kajian-rutin-ahad-pagi",
    description: "Kajian pekanan bertema keislaman dan ke-NU-an bersama jamaah Mandobo.",
    event_type: "kajian",
    status: "upcoming",
    starts_at: daysAhead(4, 8),
    ends_at: daysAhead(4, 10),
    location: "Masjid Baiturrahman, Tanah Merah",
    organizer: "MWCNU Mandobo",
    pic_name: "Ustadz Ahmad Zainuri",
  },
  {
    title: "Rapat Koordinasi Pengurus Bulanan",
    slug: "rapat-koordinasi-pengurus-bulanan",
    description: "Evaluasi program kerja dan penyusunan langkah strategis bulan berikutnya.",
    event_type: "rapat",
    status: "upcoming",
    starts_at: daysAhead(9, 9),
    location: "Kantor MWCNU Mandobo",
    organizer: "Pengurus Harian",
  },
  {
    title: "Bakti Sosial dan Santunan Anak Yatim",
    slug: "bakti-sosial-santunan-anak-yatim",
    description: "Penyaluran santunan dan bingkisan kepada anak yatim serta warga kurang mampu.",
    event_type: "sosial",
    status: "upcoming",
    starts_at: daysAhead(16, 8),
    ends_at: daysAhead(16, 12),
    location: "Balai Kampung Mandobo",
    organizer: "LazisNU Mandobo",
  },
  {
    title: "Pelatihan Dakwah untuk Kader Muda",
    slug: "pelatihan-dakwah-kader-muda",
    description: "Pelatihan teknik ceramah dan manajemen dakwah bagi kader muda NU.",
    event_type: "pelatihan",
    status: "upcoming",
    starts_at: daysAhead(23, 9),
    ends_at: daysAhead(24, 15),
    location: "Aula Kantor Distrik Mandobo",
    organizer: "Lembaga Dakwah NU",
  },
  {
    title: "Peringatan Hari Santri Nasional",
    slug: "peringatan-hari-santri-nasional",
    description: "Upacara dan doa bersama memperingati Hari Santri Nasional.",
    event_type: "peringatan",
    status: "upcoming",
    starts_at: daysAhead(30, 7),
    ends_at: daysAhead(30, 11),
    location: "Lapangan Tanah Merah",
    organizer: "MWCNU Mandobo",
  },
];

const announcements = [
  {
    title: "Pendaftaran Calon Pengurus Ranting & Anak Ranting Periode 2026-2030",
    content:
      "Dibuka kesempatan khidmah bagi kader NU di setiap ranting se-Distrik Mandobo. Berkas pendaftaran dan rekomendasi dapat diserahkan ke sekretariat MWCNU.",
    announcement_type: "himbauan",
    is_pinned: true,
  },
  {
    title: "Jadwal Layanan Sekretariat & Konsultasi Syariah",
    content:
      "Sekretariat MWCNU Mandobo beroperasi setiap Senin-Sabtu pukul 08.30-15.30 WIT untuk melayani persuratan dan bimbingan keagamaan.",
    announcement_type: "info",
    is_pinned: true,
  },
  {
    title: "Himbauan Pelaksanaan Sholat Istisqo & Doa Bersama Musim Kemarau",
    content:
      "Menghimbau seluruh masjid dan musholla naungan NU menyelenggarakan sholat Istisqo memohon berkah hujan dan keselamatan.",
    announcement_type: "peringatan",
    is_pinned: false,
  },
];

const institutions = [
  {
    name: "Lembaga Dakwah NU Mandobo",
    slug: "ldnu-mandobo",
    abbreviation: "LDNU",
    description:
      "Mengembangkan dakwah Ahlussunnah wal Jama'ah melalui mimbar, majelis taklim, dan digital.",
    category: "lembaga",
    chairman: "Ustadz H. Mahfudz",
    contact_email: "ldnu@mwcnumandobo.or.id",
    sort_order: 1,
  },
  {
    name: "LP Ma'arif NU Mandobo",
    slug: "lp-marif-mandobo",
    abbreviation: "LP Ma'arif",
    description: "Membina madrasah, sekolah Islam, dan TPQ di wilayah Distrik Mandobo.",
    category: "lembaga",
    chairman: "Drs. H. Mulyadi",
    contact_email: "maarif@mwcnumandobo.or.id",
    sort_order: 2,
  },
  {
    name: "LazisNU Mandobo",
    slug: "lazisnu-mandobo",
    abbreviation: "LazisNU",
    description:
      "Lembaga Amil Zakat, Infaq, dan Shadaqah untuk pengentasan kemiskinan dan kemandirian umat.",
    category: "lembaga",
    chairman: "Ahmad Fauzi, S.Sos.",
    contact_email: "lazisnu@mwcnumandobo.or.id",
    sort_order: 3,
  },
  {
    name: "Gerakan Pemuda Ansor Mandobo",
    slug: "gp-ansor-mandobo",
    abbreviation: "GP Ansor",
    description: "Kader muda garda terdepan penjaga ulama, NKRI, dan nilai-nilai kebangsaan.",
    category: "banom",
    chairman: "Sahabat Hasan Basri",
    contact_email: "ansor@mwcnumandobo.or.id",
    sort_order: 4,
  },
  {
    name: "Muslimat NU Mandobo",
    slug: "muslimat-mandobo",
    abbreviation: "Muslimat NU",
    description: "Wadah perempuan nahdliyin dalam dakwah sosial, kesehatan, dan keluarga maslahah.",
    category: "banom",
    chairman: "Hj. Siti Rahmah",
    contact_email: "muslimat@mwcnumandobo.or.id",
    sort_order: 5,
  },
  {
    name: "Fatayat NU Mandobo",
    slug: "fatayat-mandobo",
    abbreviation: "Fatayat NU",
    description:
      "Pemberdayaan pemudi nahdliyin di bidang pendidikan, ekonomi kreatif, dan kepemimpinan.",
    category: "banom",
    chairman: "Sahabat Nurul Hidayah, S.Pd.",
    contact_email: "fatayat@mwcnumandobo.or.id",
    sort_order: 6,
  },
  {
    name: "IPNU-IPPNU Mandobo",
    slug: "ipnu-ippnu-mandobo",
    abbreviation: "IPNU-IPPNU",
    description:
      "Ikatan Pelajar Nahdlatul Ulama & Pelajar Putri NU untuk kaderisasi generasi muda penerus.",
    category: "banom",
    chairman: "Rekan Fajar Ramadhan",
    contact_email: "ipnu@mwcnumandobo.or.id",
    sort_order: 7,
  },
];

const documents = [
  {
    title: "Surat Keputusan (SK) Susunan Pengurus MWCNU Mandobo 2026-2030",
    slug: "sk-susunan-pengurus-mwcnu-mandobo-2026-2030",
    description:
      "Salinan resmi Surat Keputusan PCNU Boven Digoel tentang pengesahan susunan pengurus MWCNU Mandobo masa khidmat 2026-2030.",
    category: "sk",
    visibility: "public",
    document_number: "012/SK/PCNU-BVD/VIII/2026",
    issued_date: "2026-01-15",
    subject: "Pengesahan Pengurus",
    file_url: "https://example.com/docs/sk-pengurus-2026.pdf",
    file_size_bytes: 2450000,
    mime_type: "application/pdf",
    version: 1,
    download_count: 142,
  },
  {
    title: "Panduan Manajemen Kemakmuran & Aset Masjid NU",
    slug: "panduan-manajemen-kemakmuran-aset-masjid",
    description:
      "Pedoman tata kelola administrasi, ta'mir, dan perlindungan aset wakaf masjid naungan Lembaga Ta'mir Masjid.",
    category: "panduan",
    visibility: "public",
    document_number: "004/PD/LTM-MWC/2026",
    issued_date: "2026-02-10",
    subject: "Pedoman Ta'mir",
    file_url: "https://example.com/docs/panduan-masjid.pdf",
    file_size_bytes: 3820000,
    mime_type: "application/pdf",
    version: 1,
    download_count: 89,
  },
  {
    title: "Kumpulan Khutbah Jumat Pilihan Bahasa Indonesia & Arab",
    slug: "kumpulan-khutbah-jumat-pilihan",
    description:
      "Materi khutbah tematik seputar ukhuwah wathaniyah, moderasi beragama, dan tasamuh bernafaskan Ahlussunnah wal Jama'ah.",
    category: "khutbah",
    visibility: "public",
    document_number: "008/KH/LDNU/2026",
    issued_date: "2026-03-01",
    subject: "Materi Khutbah",
    file_url: "https://example.com/docs/khutbah-jumat-mwc.pdf",
    file_size_bytes: 1950000,
    mime_type: "application/pdf",
    version: 2,
    download_count: 267,
  },
  {
    title: "Formulir Pendaftaran Kaderisasi & Anggota NU",
    slug: "formulir-pendaftaran-kaderisasi-anggota-nu",
    description: "Formulir registrasi keanggotaan dan pendaftaran kaderisasi tingkat distrik.",
    category: "formulir",
    visibility: "public",
    document_number: "001/FRM/MWC/2026",
    issued_date: "2026-01-05",
    subject: "Formulir Anggota",
    file_url: "https://example.com/docs/formulir-anggota.pdf",
    file_size_bytes: 520000,
    mime_type: "application/pdf",
    version: 1,
    download_count: 115,
  },
];

const sermons = [
  {
    title: "Menjaga Sanad Keilmuan & Tradisi Keagamaan di Tanah Papua",
    slug: "menjaga-sanad-keilmuan-tradisi-tanah-papua",
    summary:
      "Ulasan mendalam mengenai pentingnya bersandar pada ulama muktabar dan menjaga kerukunan antar umat beragama.",
    speaker: "KH. Ahmad Marzuqi, M.Pd.",
    series: "Kajian Aswaja An-Nahdliyah",
    cover_image_url:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    published_at: daysAgo(10),
    view_count: 430,
  },
  {
    title: "Filsafat Zakat & Keadilan Sosial Berbasis Jam'iyyah",
    slug: "filsafat-zakat-keadilan-sosial",
    summary:
      "Bagaimana LazisNU menggerakkan ekonomi umat melalui transparansi dan ketepatan sasaran mustahiq.",
    speaker: "Ustadz M. Ridwan, S.E.",
    series: "Fiqih Muamalah & Kedermawanan",
    cover_image_url:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    published_at: daysAgo(20),
    view_count: 285,
  },
  {
    title: "Pendidikan Karakter Anak Berlandaskan Akhlaqul Karimah",
    slug: "pendidikan-karakter-anak-akhlaqul-karimah",
    summary:
      "Strategi keluarga nahdliyin dalam mendidik generasi penerus menghadapi era kecerdasan buatan.",
    speaker: "Nyai Hj. Siti Rahmah",
    series: "Keluarga Maslahah",
    cover_image_url:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    published_at: daysAgo(35),
    view_count: 312,
  },
];

const albums = [
  {
    title: "Konferensi & Pelantikan Pengurus MWCNU Mandobo 2026-2030",
    slug: "pelantikan-pengurus-mwcnu-2026",
    description: "Dokumentasi prosesi bai'at dan pelantikan pengurus di Gedung Serbaguna Mandobo.",
  },
  {
    title: "Penyaluran Santunan Ramadhan & Beras Dhuafa",
    slug: "santunan-ramadhan-dhuafa",
    description: "Kegiatan bakti sosial dan pembagian sembako dari LazisNU untuk warga Mandobo.",
  },
  {
    title: "Peringatan Hari Santri Nasional & Kirab Merah Putih",
    slug: "hari-santri-kirab-merah-putih",
    description: "Apel Akbar ribuan santri dan kader badan otonom di Lapangan Tanah Merah.",
  },
];

const timeline_events = [
  {
    year_start: 1985,
    title: "Awal Mula Masuknya Warga Nahdliyin di Tanah Merah",
    description:
      "Gelombang pendatang dan perintis dakwah mulai mengadakan pengajian tahlilan dan istighotsah rutin di Tanah Merah, Boven Digoel.",
    sort_order: 1,
  },
  {
    year_start: 1998,
    title: "Pendirian Majelis Taklim & Musholla Pertama",
    description:
      "Pembangunan sarana ibadah pertama yang menjadi pusat berkumpulnya para sesepuh nahdliyin.",
    sort_order: 2,
  },
  {
    year_start: 2008,
    title: "Pembentukan Struktur MWCNU Mandobo",
    description: "Peresmian status struktural MWCNU Mandobo di bawah naungan Cabang Boven Digoel.",
    sort_order: 3,
  },
  {
    year_start: 2026,
    title: "Transformasi Digital & Visi Modern Nusantara",
    description: "Peluncuran platform digital resmi dan penegasan komitmen dakwah moderat.",
    sort_order: 4,
  },
];

const figures = [
  {
    name: "KH. Syamsul Huda, Lc.",
    slug: "kh-syamsul-huda",
    title: "Rais Syuriyah",
    category: "ulama",
    birth_place: "Jember",
    birth_year: 1968,
    bio: "Tokoh ulama perintis kajian kitab kuning dan penasehat keagamaan lintas etnis di Boven Digoel.",
    quote:
      "Rawatlah ukhuwah sebagaimana kita merawat iman, sebab persaudaraan adalah ladang subur tumbuhnya kebaikan.",
    sort_order: 1,
  },
  {
    name: "H. Muhammad Nur, S.Ag.",
    slug: "h-muhammad-nur",
    title: "Ketua Tanfidziyah",
    category: "aktivis",
    birth_place: "Makassar",
    birth_year: 1975,
    bio: "Pendidik dan tokoh penggerak kemasyarakatan yang aktif mengawal kerukunan sosial di Papua Selatan.",
    quote:
      "Teknologi adalah sarana, tujuan kita tetap satu: melayani umat dengan keikhlasan dan keteladanan.",
    sort_order: 2,
  },
];

const programs = [
  {
    title: "Penguatan Literasi & Digitalisasi Organisasi",
    slug: "penguatan-literasi-digitalisasi-organisasi",
    description:
      "Pembangunan portal digital resmi, arsip daring, dan kanal publikasi multi-platform terpadu.",
    field: "Informasi & Komunikasi",
    period: "2026-2028",
    status: "active",
    sort_order: 1,
  },
  {
    title: "Kemandirian Ekonomi Jamaah & Koin LazisNU",
    slug: "kemandirian-ekonomi-jamaah-koin-lazisnu",
    description:
      "Gerakan Koin NU di setiap ranting untuk mendukung dana abadi pendidikan dan santunan sosial.",
    field: "Sosial & Ekonomi",
    period: "2026-2030",
    status: "active",
    sort_order: 2,
  },
  {
    title: "Revitalisasi & Pembinaan Kaderisasi Berjenjang",
    slug: "revitalisasi-pembinaan-kaderisasi",
    description:
      "Penyelenggaraan Pendidikan Kader Penggerak NU (PKPNU) dan Masa Kesetiaan Anggota (Makesta).",
    field: "Kaderisasi",
    period: "2026-2027",
    status: "active",
    sort_order: 3,
  },
];

const banners = [
  {
    title: "Selamat Datang di Portal Resmi MWCNU Mandobo",
    subtitle: "Membangun peradaban melalui dakwah, pendidikan, dan pelayanan umat.",
    image_url:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1600&q=80",
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Kajian Rutin Ahad Pagi",
    subtitle: "Masjid Baiturrahman, setiap Ahad pukul 08.00 WIT",
    image_url:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80",
    is_active: true,
    sort_order: 2,
  },
];

async function upsert(table, rows, onConflict) {
  if (!rows || rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`Gagal upsert ${table}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`OK ${table}: ${rows.length} baris`);
  }
}

async function replace(table, rows) {
  if (!rows || rows.length === 0) return;
  const { error: delError } = await supabase
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) {
    console.error(`Gagal bersihkan ${table}:`, delError.message);
    process.exitCode = 1;
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`Gagal insert ${table}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`OK ${table}: ${rows.length} baris (replace)`);
  }
}

async function getCategoryId(slug) {
  const { data } = await supabase.from("categories").select("id").eq("slug", slug).single();
  return data?.id ?? null;
}

async function main() {
  console.log("🚀 Memulai proses seeding dummy data lengkap...");

  await upsert("categories", categories, "slug");
  await upsert("tags", tags, "slug");
  await replace("announcements", announcements);
  await upsert("institutions", institutions, "slug");
  await replace("banners", banners);
  await upsert("documents", documents, "slug");
  await upsert("sermons", sermons, "slug");
  await upsert("albums", albums, "slug");
  await replace("timeline_events", timeline_events);
  await upsert("figures", figures, "slug");
  await upsert("programs", programs, "slug");

  const withCategory = [];
  for (const article of articles) {
    const category_id = await getCategoryId(article.category_slug);
    const { category_slug: _category_slug, ...rest } = article;
    withCategory.push({ ...rest, category_id });
  }
  await upsert("articles", withCategory, "slug");

  await upsert("events", events, "slug");

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "mwcnu-mandobo")
    .single();

  if (org) {
    await upsert(
      "positions",
      [
        { organization_id: org.id, title: "Rais Syuriyah", sort_order: 1 },
        { organization_id: org.id, title: "Wakil Rais Syuriyah", sort_order: 2 },
        { organization_id: org.id, title: "Ketua Tanfidziyah", sort_order: 3 },
        { organization_id: org.id, title: "Wakil Ketua Tanfidziyah", sort_order: 4 },
        { organization_id: org.id, title: "Sekretaris", sort_order: 5 },
        { organization_id: org.id, title: "Bendahara", sort_order: 6 },
      ],
      "organization_id,title"
    );

    const { data: positions } = await supabase
      .from("positions")
      .select("id,title")
      .eq("organization_id", org.id);

    const posByTitle = Object.fromEntries((positions ?? []).map((p) => [p.title, p.id]));

    await replace("leaders", [
      {
        organization_id: org.id,
        position_id: posByTitle["Rais Syuriyah"],
        name: "KH. Syamsul Huda, Lc.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        bio: "Pengasuh Pondok Pesantren di Boven Digoel, mendedikasikan hidup untuk bimbingan spiritual umat.",
        sort_order: 1,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Wakil Rais Syuriyah"],
        name: "K.H. Nur Cholish",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        bio: "Wakil Rais Syuriyah, aktif dalam majelis fatwa dan pembinaan hukum Islam.",
        sort_order: 2,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Ketua Tanfidziyah"],
        name: "H. Muhammad Nur, S.Ag.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        bio: "Ketua Tanfidziyah MWCNU Mandobo periode 2026-2030, fokus memodernisasi tata kelola organisasi.",
        sort_order: 3,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Sekretaris"],
        name: "Ustadz Ahmad Zainuri, Lc.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        bio: "Sekretaris MWCNU Mandobo, mengkoordinir operasional harian dan sistem arsip digital.",
        sort_order: 4,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Bendahara"],
        name: "Muhammad Ridwan, S.E.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        bio: "Bendahara MWCNU Mandobo, penanggung jawab transparansi akuntabilitas keuangan organisasi.",
        sort_order: 5,
      },
    ]);
  } else {
    console.warn("Organisasi 'mwcnu-mandobo' tidak ditemukan, leaders dilewati.");
  }

  // Program items seeding
  const { data: progList } = await supabase.from("programs").select("id,slug");
  if (progList && progList.length > 0) {
    const progMap = Object.fromEntries(progList.map((p) => [p.slug, p.id]));
    const programItems = [];

    if (progMap["penguatan-literasi-digitalisasi-organisasi"]) {
      programItems.push({
        program_id: progMap["penguatan-literasi-digitalisasi-organisasi"],
        title: "Peluncuran Portal Resmi Web & Database Terpusat",
        description:
          "Membangun sistem informasi berbasis web dengan performa tinggi & akses mobile-first.",
        progress: 100,
        status: "completed",
        target_date: "2026-08-31",
        sort_order: 1,
      });
    }

    if (progMap["kemandirian-ekonomi-jamaah-koin-lazisnu"]) {
      programItems.push({
        program_id: progMap["kemandirian-ekonomi-jamaah-koin-lazisnu"],
        title: "Distribusi 500 Kotak Koin NU ke Rumah Jamaah",
        description: "Penyaluran kotak koin untuk pengumpulan infaq harian jamaah.",
        progress: 80,
        status: "active",
        target_date: "2026-10-15",
        sort_order: 1,
      });
    }

    if (programItems.length > 0) {
      await replace("program_items", programItems);
    }
  }

  if (process.exitCode) {
    console.error("\n❌ Ada kegagalan saat seeding.");
  } else {
    console.log("\n✅ Seeding data dummy lengkap selesai tanpa error!");
  }
}

main();
