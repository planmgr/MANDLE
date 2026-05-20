import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getFeedPosts,
  getPopularPosts,
  getBookmarkedPosts,
  getFollowingPosts,
  getBoardPosts,
} from "@/lib/queries/community";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tab = searchParams.get("tab") ?? "feed";
  const filter = searchParams.get("filter") ?? "all";
  const page = parseInt(searchParams.get("page") ?? "1");
  const tag = searchParams.get("tag") ?? undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let posts;
  if (tab === "board") {
    posts = await getBoardPosts(page, user?.id);
  } else if (tab === "popular") {
    posts = await getPopularPosts(page, user?.id);
  } else if (tab === "collections" && user) {
    posts = await getBookmarkedPosts(user.id, page);
  } else if (filter === "following" && user) {
    posts = await getFollowingPosts(user.id, page);
  } else {
    posts = await getFeedPosts(page, user?.id, tag);
  }

  return Response.json(posts);
}
