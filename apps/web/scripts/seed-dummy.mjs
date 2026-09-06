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
    title: "Pendaftaran Calon Pengurus Ranting Periode 2026-2030",
    content:
      "Pendaftaran dibuka hingga akhir bulan. Bagi yang berminat, hubungi sekretariat MWCNU.",
    announcement_type: "himbauan",
    is_pinned: true,
  },
  {
    title: "Jadwal Operasional Kantor selama Ramadan",
    content: "Kantor MWCNU Mandobo beroperasional pukul 08.00-15.00 selama bulan Ramadan.",
    announcement_type: "info",
    is_pinned: false,
  },
];

const institutions = [
  {
    name: "Lembaga Dakwah NU Mandobo",
    slug: "ldnu-mandobo",
    abbreviation: "LDNU",
    category: "lembaga",
  },
  {
    name: "LP Ma'arif NU Mandobo",
    slug: "lp-marif-mandobo",
    abbreviation: "LP Ma'arif",
    category: "lembaga",
  },
  {
    name: "LazisNU Mandobo",
    slug: "lazisnu-mandobo",
    abbreviation: "LazisNU",
    category: "lembaga",
  },
  {
    name: "Muslimat NU Mandobo",
    slug: "muslimat-mandobo",
    abbreviation: "Muslimat NU",
    category: "banom",
  },
  {
    name: "Fatayat NU Mandobo",
    slug: "fatayat-mandobo",
    abbreviation: "Fatayat NU",
    category: "banom",
  },
  {
    name: "GP Ansor Mandobo",
    slug: "gp-ansor-mandobo",
    abbreviation: "GP Ansor",
    category: "banom",
  },
  {
    name: "IPNU-IPPNU Mandobo",
    slug: "ipnu-ippnu-mandobo",
    abbreviation: "IPNU-IPPNU",
    category: "banom",
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
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`Gagal upsert ${table}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`OK ${table}: ${rows.length} baris`);
  }
}

async function replace(table, rows) {
  if (rows.length === 0) return;
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
  await upsert("categories", categories, "slug");
  await upsert("tags", tags, "slug");
  await replace("announcements", announcements);
  await upsert("institutions", institutions, "slug");
  await replace("banners", banners);

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
        { organization_id: org.id, title: "Ketua", sort_order: 1 },
        { organization_id: org.id, title: "Wakil Ketua I", sort_order: 2 },
        { organization_id: org.id, title: "Wakil Ketua II", sort_order: 3 },
        { organization_id: org.id, title: "Sekretaris", sort_order: 4 },
        { organization_id: org.id, title: "Bendahara", sort_order: 5 },
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
        position_id: posByTitle["Ketua"],
        name: "H. Muhammad Nur, S.Ag.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        sort_order: 1,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Wakil Ketua I"],
        name: "H. Abdul Karim, S.Pd.I.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        sort_order: 2,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Wakil Ketua II"],
        name: "Hj. Siti Rahmah",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        sort_order: 3,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Sekretaris"],
        name: "Ustadz Ahmad Zainuri, Lc.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        sort_order: 4,
      },
      {
        organization_id: org.id,
        position_id: posByTitle["Bendahara"],
        name: "Muhammad Ridwan, S.E.",
        term_start: "2026-01-01",
        term_end: "2030-12-31",
        is_active: true,
        sort_order: 5,
      },
    ]);
  } else {
    console.warn("Organisasi 'mwcnu-mandobo' tidak ditemukan, leaders dilewati.");
  }

  if (process.exitCode) {
    console.error("\nAda kegagalan saat seeding.");
  } else {
    console.log("\nSeeding selesai tanpa error.");
  }
}

main();
