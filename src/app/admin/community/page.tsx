import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminCommunityList from "@/components/admin/AdminCommunityList";

export default async function AdminCommunityPage() {
  const supabase = await createClient();

  const [postsRes, boardPostsRes, reportsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id, user_id, image_url, caption, likes_count, comments_count, created_at, profiles!posts_user_id_profiles_fkey(nickname)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("board_posts")
      .select("id, user_id, title, body, image_url, category, is_hidden, likes_count, comments_count, created_at, profiles!board_posts_user_id_fkey(nickname)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("reports")
      .select("id, reporter_id, target_type, target_id, reason, description, status, created_at, reporter:profiles!reports_reporter_id_fkey(nickname)")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  // Supabase returns profiles as object (not array) for FK joins, but TS infers array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = (postsRes.data ?? []).map((p: any) => ({
    ...p,
    profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boardPosts = (boardPostsRes.data ?? []).map((p: any) => ({
    ...p,
    profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reports = (reportsRes.data ?? []).map((r: any) => ({
    ...r,
    reporter: Array.isArray(r.reporter) ? r.reporter[0] : r.reporter,
  }));

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] md:text-[28px] tracking-[2px] text-fg-primary mb-6">
        COMMUNITY
      </h1>
      <AdminCommunityList
        posts={posts}
        boardPosts={boardPosts}
        reports={reports}
      />
    </AdminLayout>
  );
}
