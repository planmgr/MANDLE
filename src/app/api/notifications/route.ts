import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 401 });
  }

  const countOnly = request.nextUrl.searchParams.get("countOnly") === "true";

  // Count-only mode for polling (lightweight)
  if (countOnly) {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("read", false);

    return NextResponse.json({ unreadCount: count ?? 0 });
  }

  // Full fetch for modal
  const [notificationsRes, unreadRes] = await Promise.all([
    supabase
      .from("notifications")
      .select("*, actor:profiles!notifications_actor_id_fkey(id, nickname, avatar_url)")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .eq("read", false),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifications = (notificationsRes.data ?? []).map((n: any) => ({
    ...n,
    actor: Array.isArray(n.actor) ? n.actor[0] : n.actor,
  }));

  return NextResponse.json({
    notifications,
    unreadCount: unreadRes.count ?? 0,
  });
}
