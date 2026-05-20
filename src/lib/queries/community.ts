import { createClient } from "@/lib/supabase/server";
import type { Post, Comment, Tag, Profile, BoardPost, BoardComment, FeaturedMember, TopMember } from "@/lib/types/community";

const PAGE_SIZE = 12;

export async function getFeedPosts(
  page: number,
  userId?: string,
  tag?: string
): Promise<Post[]> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (tag) {
    const { data: tagData } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .single();
    if (tagData) {
      const { data: postIds } = await supabase
        .from("post_tags")
        .select("post_id")
        .eq("tag_id", tagData.id);
      const ids = postIds?.map((pt) => pt.post_id) ?? [];
      if (ids.length === 0) return [];
      query = query.in("id", ids);
    } else {
      return [];
    }
  }

  const { data: posts } = await query;
  if (!posts) return [];

  return attachUserInteractions(supabase, posts as Post[], userId);
}

export async function getPopularPosts(
  page: number,
  userId?: string
): Promise<Post[]> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .order("likes_count", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (!posts) return [];
  return attachUserInteractions(supabase, posts as Post[], userId);
}

export async function getFollowingPosts(
  userId: string,
  page: number
): Promise<Post[]> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data: following } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  const followingIds = following?.map((f) => f.following_id) ?? [];
  if (followingIds.length === 0) return [];

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .in("user_id", followingIds)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (!posts) return [];
  return attachUserInteractions(supabase, posts as Post[], userId);
}

export async function getBookmarkedPosts(
  userId: string,
  page: number
): Promise<Post[]> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const postIds = bookmarks?.map((b) => b.post_id) ?? [];
  if (postIds.length === 0) return [];

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .in("id", postIds);

  if (!posts) return [];

  const ordered = postIds
    .map((id) => posts.find((p) => p.id === id))
    .filter(Boolean) as Post[];

  return attachUserInteractions(supabase, ordered, userId);
}

export async function getUserPosts(
  targetUserId: string,
  page: number
): Promise<Post[]> {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .eq("user_id", targetUserId)
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  return (posts as Post[]) ?? [];
}

export async function getPostById(
  postId: number,
  userId?: string
): Promise<Post | null> {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_profiles_fkey(*)")
    .eq("id", postId)
    .single();

  if (!post) return null;

  const posts = await attachUserInteractions(
    supabase,
    [post as Post],
    userId
  );
  return posts[0] ?? null;
}

export async function getComments(
  postId: number,
  page: number
): Promise<Comment[]> {
  const supabase = await createClient();
  const from = (page - 1) * 20;

  const { data } = await supabase
    .from("comments")
    .select("*, profiles!comments_user_id_profiles_fkey(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .range(from, from + 19);

  return (data as Comment[]) ?? [];
}

export async function getPopularTags(limit: number = 8): Promise<Tag[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tags")
    .select("*")
    .order("post_count", { ascending: false })
    .limit(limit);

  return (data as Tag[]) ?? [];
}

export async function getRecommendedUsers(
  currentUserId?: string,
  limit: number = 3
): Promise<Profile[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .limit(limit);

  if (currentUserId) {
    query = query.neq("id", currentUserId);
  }

  const { data } = await query;
  return (data as Profile[]) ?? [];
}

export async function getUserStats(userId: string) {
  const supabase = await createClient();

  const [postsRes, followersRes, followingRes] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return {
    postsCount: postsRes.count ?? 0,
    followersCount: followersRes.count ?? 0,
    followingCount: followingRes.count ?? 0,
  };
}

// ===== BOARD QUERIES =====

const BOARD_PAGE_SIZE = 15;

export async function getBoardPosts(
  page: number,
  userId?: string
): Promise<BoardPost[]> {
  const supabase = await createClient();
  const from = (page - 1) * BOARD_PAGE_SIZE;

  const { data: posts } = await supabase
    .from("board_posts")
    .select("*, profiles!board_posts_user_id_fkey(*)")
    .order("created_at", { ascending: false })
    .range(from, from + BOARD_PAGE_SIZE - 1);

  if (!posts) return [];
  return attachBoardLikes(supabase, posts as BoardPost[], userId);
}

export async function getBoardPostById(
  postId: number,
  userId?: string
): Promise<BoardPost | null> {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("board_posts")
    .select("*, profiles!board_posts_user_id_fkey(*)")
    .eq("id", postId)
    .single();

  if (!post) return null;
  const posts = await attachBoardLikes(supabase, [post as BoardPost], userId);
  return posts[0] ?? null;
}

export async function getBoardComments(
  boardPostId: number,
  page: number
): Promise<BoardComment[]> {
  const supabase = await createClient();
  const from = (page - 1) * 20;

  const { data } = await supabase
    .from("board_comments")
    .select("*, profiles!board_comments_user_id_fkey(*)")
    .eq("board_post_id", boardPostId)
    .order("created_at", { ascending: true })
    .range(from, from + 19);

  return (data as BoardComment[]) ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attachBoardLikes(supabase: any, posts: BoardPost[], userId?: string): Promise<BoardPost[]> {
  if (!userId || posts.length === 0) return posts;

  const postIds = posts.map((p) => p.id);
  const { data: likes } = await supabase
    .from("board_likes")
    .select("board_post_id")
    .eq("user_id", userId)
    .in("board_post_id", postIds);

  const likedIds = new Set(likes?.map((l: { board_post_id: number }) => l.board_post_id) ?? []);
  return posts.map((post) => ({ ...post, is_liked: likedIds.has(post.id) }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attachUserInteractions(supabase: any, posts: Post[], userId?: string): Promise<Post[]> {
  if (!userId || posts.length === 0) return posts;

  const postIds = posts.map((p) => p.id);

  const [likesRes, bookmarksRes] = await Promise.all([
    supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds),
    supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds),
  ]);

  const likedIds = new Set(likesRes.data?.map((l: { post_id: number }) => l.post_id) ?? []);
  const bookmarkedIds = new Set(bookmarksRes.data?.map((b: { post_id: number }) => b.post_id) ?? []);

  return posts.map((post) => ({
    ...post,
    is_liked: likedIds.has(post.id),
    is_bookmarked: bookmarkedIds.has(post.id),
  }));
}

// ===== FEATURED MEMBERS QUERIES =====

export async function getFeaturedMembers(): Promise<FeaturedMember[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("featured_members")
    .select("*, profiles!featured_members_user_id_fkey(*)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (data as FeaturedMember[]) ?? [];
}

export async function getFeaturedMemberByUserId(
  userId: string
): Promise<FeaturedMember | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("featured_members")
    .select("*, profiles!featured_members_user_id_fkey(*)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  return (data as FeaturedMember) ?? null;
}

export async function getTopMembers(limit: number = 5): Promise<TopMember[]> {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("user_id, likes_count");

  if (!posts || posts.length === 0) return [];

  // Aggregate per user
  const userMap = new Map<string, { posts_count: number; total_likes: number }>();
  for (const post of posts) {
    const existing = userMap.get(post.user_id) ?? { posts_count: 0, total_likes: 0 };
    existing.posts_count += 1;
    existing.total_likes += post.likes_count;
    userMap.set(post.user_id, existing);
  }

  // Sort by total_likes desc, then posts_count desc
  const sorted = [...userMap.entries()]
    .sort((a, b) => b[1].total_likes - a[1].total_likes || b[1].posts_count - a[1].posts_count)
    .slice(0, limit);

  const userIds = sorted.map(([id]) => id);
  if (userIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (!profiles) return [];

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  return sorted
    .map(([id, stats]) => ({
      user_id: id,
      posts_count: stats.posts_count,
      total_likes: stats.total_likes,
      profiles: profileMap.get(id) as Profile,
    }))
    .filter((m) => m.profiles);
}
