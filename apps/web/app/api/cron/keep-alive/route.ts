import { NextResponse } from "next/server";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Supabase belum terkonfigurasi di environment." },
      { status: 503 }
    );
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase.from("articles").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase keep-alive ping sukses! Database aktif.",
      timestamp: new Date().toISOString(),
      recordFound: Boolean(data?.length),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Internal Server Error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
