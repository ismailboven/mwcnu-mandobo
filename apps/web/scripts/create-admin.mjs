#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2];
const password = process.argv[3];

if (!url || !serviceRole || !email || !password) {
  console.error(
    "Pemakaian: node scripts/create-admin.mjs <email> <password>\nJalankan dari apps/web dengan --env-file=.env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

async function main() {
  let userId;

  const { data: existing, error: _lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing?.id) {
    userId = existing.id;
    console.log(`User ${email} sudah ada, memakai uid ${userId}`);
  } else {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Administrator MWCNU Mandobo" },
    });

    if (createError) {
      console.error("Gagal membuat user:", createError.message);
      process.exit(1);
    }
    userId = created.user.id;
    console.log(`User ${email} dibuat dengan uid ${userId}`);
  }

  const { data: superRole, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "super_admin")
    .single();

  if (roleError) {
    console.error("Gagal mencari role super_admin:", roleError.message);
    process.exit(1);
  }

  const { error: assignError } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role_id: superRole.id }, { onConflict: "user_id,role_id" });

  if (assignError) {
    console.error("Gagal assign role:", assignError.message);
    process.exit(1);
  }

  console.log(`Role super_admin ditetapkan untuk ${email}`);

  const { data: level } = await supabase.rpc("get_user_role_level").select();
  console.log("Cek level (harus 4):", JSON.stringify(level));

  console.log("\nSelesai. User bisa login di /masuk.");
}

main();
