"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";
import { toggleLike, toggleBookmark, deletePost } from "@/lib/actions/community";
import { timeAgo } from "@/lib/utils/tags";
import type { Post } from "@/lib/types/community";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onOpenDetail?: (post: Post) => void;
}

export default function PostCard({ post, currentUserId, onOpenDetail }: PostCardProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked ?? false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwner = currentUserId === post.user_id;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const result = await toggleLike(post.id);
      setLiked(result.liked);
    } catch {
      setLiked(liked);
      setLikesCount(likesCount);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;
    setBookmarked(!bookmarked);
    try {
      const result = await toggleBookmark(post.id);
      setBookmarked(result.bookmarked);
    } catch {
      setBookmarked(bookmarked);
    }
  };

  const handleDelete = async () => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(post.id);
      setDeleted(true);
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (deleted) return null;

  const profile = post.profiles;

  return (
    <article className="flex flex-col gap-3">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-[28px] h-[28px] rounded-full overflow-hidden bg-surface-card shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.nickname}
                fill
                className="object-cover"
                sizes="28px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-caption text-[11px] text-fg-tertiary">
                {profile.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-caption text-[11px] font-medium tracking-[1px] text-fg-primary">
            {profile.nickname.toUpperCase()}
          </span>
          <span className="font-caption text-[10px] text-fg-tertiary">
            {timeAgo(post.created_at)}
          </span>
        </div>
        {isOwner && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-fg-tertiary hover:text-fg-primary"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 bg-surface-primary border border-border-light shadow-sm z-10">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2.5 font-caption text-[11px] text-red-500 hover:bg-surface-card w-full"
                >
                  <Trash2 size={13} />
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      <div
        className="relative w-full h-[320px] md:h-[380px] overflow-hidden cursor-pointer bg-surface-card"
        onClick={() => onOpenDetail?.(post)}
      >
        <Image
          src={post.image_url}
          alt={post.caption ?? "Post"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-fg-secondary hover:text-fg-primary transition-colors">
            <Heart size={16} className={liked ? "fill-red-500 text-red-500" : ""} />
            <span className="font-caption text-[11px]">{likesCount}</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDetail?.(post); }}
            className="flex items-center gap-1.5 text-fg-secondary hover:text-fg-primary transition-colors"
          >
            <MessageCircle size={16} />
            <span className="font-caption text-[11px]">{post.comments_count}</span>
          </button>
        </div>
        <button onClick={handleBookmark} className="text-fg-secondary hover:text-fg-primary transition-colors">
          <Bookmark size={16} className={bookmarked ? "fill-fg-primary text-fg-primary" : ""} />
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="font-body text-[13px] text-fg-primary leading-[1.6] line-clamp-2">
          {post.caption}
        </p>
      )}
    </article>
  );
}
