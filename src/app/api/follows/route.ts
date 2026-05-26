import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");
  const type = searchParams.get("type"); // "followers" | "following"

  if (!userId || !type || (type !== "followers" && type !== "following")) {
    return NextResponse.json([], { status: 400 });
  }

  const supabase = await createClient();

  if (type === "followers") {
    // Get follower IDs
    const { data: follows } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userId)
      .order("created_at", { ascending: false });

    const ids = (follows ?? []).map((f) => f.follower_id);
    if (ids.length === 0) return NextResponse.json([]);

    // Fetch profiles for those IDs
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname, avatar_url, bio")
      .in("id", ids);

    // Preserve order from follows query
    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const ordered = ids.map((id) => profileMap.get(id)).filter(Boolean);

    return NextResponse.json(ordered);
  }

  // type === "following"
  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });

  const ids = (follows ?? []).map((f) => f.following_id);
  if (ids.length === 0) return NextResponse.json([]);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url, bio")
    .in("id", ids);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const ordered = ids.map((id) => profileMap.get(id)).filter(Boolean);

  return NextResponse.json(ordered);
}
