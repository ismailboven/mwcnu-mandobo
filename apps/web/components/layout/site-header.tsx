import { Navbar } from "@/components/layout/navbar";
import { createServerSupabase } from "@/lib/supabase/server";

export async function SiteHeader() {
  let isLoggedIn = false;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  } catch {
    isLoggedIn = false;
  }

  return <Navbar isLoggedIn={isLoggedIn} />;
}
