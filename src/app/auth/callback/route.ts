import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function waitForProfile(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname_set_by_user")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) return data;
    if (i < retries - 1) await new Promise((r) => setTimeout(r, 200));
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await waitForProfile(supabase, user.id);

        if (!profile || !profile.nickname_set_by_user) {
          return NextResponse.redirect(`${origin}/my?setup=nickname`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
