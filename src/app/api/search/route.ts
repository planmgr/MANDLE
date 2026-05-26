import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LIMIT = 5;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return Response.json({ posts: [], boardPosts: [], styleArticles: [], groomingArticles: [], users: [] });
  }

  const supabase = await createClient();
  const pattern = `%${q}%`;

  const [postsRes, boardPostsRes, styleRes, groomingRes, usersRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id, caption, image_url, created_at, profiles!posts_user_id_profiles_fkey(nickname)")
      .ilike("caption", pattern)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase
      .from("board_posts")
      .select("id, title, category, created_at, profiles!board_posts_user_id_fkey(nickname)")
      .eq("is_hidden", false)
      .or(`title.ilike.${pattern},body.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase
      .from("style_articles")
      .select("id, title, category, cover_image_url, created_at")
      .ilike("title", pattern)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase
      .from("grooming_articles")
      .select("id, title, category, cover_image_url, created_at")
      .ilike("title", pattern)
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    supabase
      .from("profiles")
      .select("id, nickname, avatar_url, bio")
      .ilike("nickname", pattern)
      .limit(LIMIT),
  ]);

  return Response.json({
    posts: postsRes.data ?? [],
    boardPosts: boardPostsRes.data ?? [],
    styleArticles: styleRes.data ?? [],
    groomingArticles: groomingRes.data ?? [],
    users: usersRes.data ?? [],
  });
}
