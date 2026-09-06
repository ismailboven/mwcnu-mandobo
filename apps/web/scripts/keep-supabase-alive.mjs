// Script untuk ping API Supabase agar tidak otomatis ter-pause oleh Supabase (Free Tier)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ URL atau Publishable Key Supabase wajib diatur di environment variable.");
  process.exit(1);
}

async function ping() {
  console.log(`📡 Memanggil Supabase REST API di ${url} ...`);
  try {
    const response = await fetch(`${url}/rest/v1/articles?select=id&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Ping Supabase berhasil! Status:", response.status);
      console.log("📊 Data:", JSON.stringify(data));
    } else {
      console.error("⚠️ Ping Supabase mengembalikan status:", response.status, response.statusText);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Gagal terhubung ke Supabase:", error);
    process.exit(1);
  }
}

ping();
