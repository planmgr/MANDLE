"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, MoreHorizontal, Trash2, ImageIcon } from "lucide-react";
import { toggleBoardLike, deleteBoardPost } from "@/lib/actions/community";
import { timeAgo } from "@/lib/utils/tags";
import type { BoardPost } from "@/lib/types/community";

interface BoardPostCardProps {
  post: BoardPost;
  currentUserId?: string;
  onOpenDetail?: (post: BoardPost) => void;
}

export default function BoardPostCard({ post, currentUserId, onOpenDetail }: BoardPostCardProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showMenu, setShowMenu] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwner = currentUserId === post.user_id;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const result = await toggleBoardLike(post.id);
      setLiked(result.liked);
    } catch {
      setLiked(liked);
      setLikesCount(likesCount);
    }
  };

  const handleDelete = async () => {
    if (!confirm("글을 삭제하시겠습니까?")) return;
    try {
      await deleteBoardPost(post.id);
      setDeleted(true);
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (deleted) return null;

  const profile = post.profiles;

  return (
    <article
      className="flex flex-col gap-3 p-4 border border-border-light hover:border-fg-tertiary transition-colors cursor-pointer"
      onClick={() => onOpenDetail?.(post)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-[24px] h-[24px] rounded-full overflow-hidden bg-surface-card shrink-0">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.nickname} fill className="object-cover" sizes="24px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-caption text-[10px] text-fg-tertiary">
                {profile.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-caption text-[11px] font-medium tracking-[0.5px] text-fg-secondary">
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
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
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

      {/* Title */}
      <h3 className="font-body text-[15px] font-semibold text-fg-primary leading-[1.4]">
        {post.title}
      </h3>

      {/* Body preview */}
      <p className="font-body text-[13px] text-fg-secondary leading-[1.6] line-clamp-2">
        {post.body}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-fg-tertiary hover:text-fg-primary transition-colors"
          >
            <Heart size={14} className={liked ? "fill-red-500 text-red-500" : ""} />
            <span className="font-caption text-[11px]">{likesCount}</span>
          </button>
          <span className="flex items-center gap-1.5 text-fg-tertiary">
            <MessageCircle size={14} />
            <span className="font-caption text-[11px]">{post.comments_count}</span>
          </span>
        </div>
        {post.image_url && (
          <ImageIcon size={14} className="text-fg-tertiary" />
        )}
      </div>
    </article>
  );
}
