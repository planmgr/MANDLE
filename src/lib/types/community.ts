export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
}

export interface Post {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: Profile;
  tags?: Tag[];
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

export interface Tag {
  id: number;
  name: string;
  post_count: number;
}

export interface BoardPost {
  id: number;
  user_id: string;
  title: string;
  body: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: Profile;
  is_liked?: boolean;
}

export interface BoardComment {
  id: number;
  board_post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

export interface FeaturedMember {
  id: number;
  user_id: string;
  interview: string;
  cover_image_url: string | null;
  tagline: string | null;
  display_order: number;
  profiles: Profile;
}

export interface TopMember {
  user_id: string;
  posts_count: number;
  total_likes: number;
  profiles: Profile;
}

export type FeedTab = "feed" | "popular" | "collections" | "board";
