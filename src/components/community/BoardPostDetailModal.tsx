"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { toggleBoardLike, deleteBoardPost } from "@/lib/actions/community";
import { timeAgo } from "@/lib/utils/tags";
import BoardCommentList from "./BoardCommentList";
import ReportModal from "./ReportModal";
import type { BoardPost, BoardComment } from "@/lib/types/community";

interface BoardPostDetailModalProps {
  post: BoardPost;
  currentUserId?: string;
  onClose: () => void;
}

export default function BoardPostDetailModal({ post, currentUserId, onClose }: BoardPostDetailModalProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwner = currentUserId === post.user_id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/community/comments?postId=${post.id}&type=board`);
        const data = await res.json();
        setComments(data);
      } catch {
        // silently fail
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleLike = async () => {
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
      onClose();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (deleted) return null;

  const profile = post.profiles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-full max-w-[90vw] md:max-w-[720px] mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <div className="flex items-center gap-2.5">
            <div className="relative w-[28px] h-[28px] rounded-full overflow-hidden bg-surface-card shrink-0">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.nickname} fill className="object-cover" sizes="28px" />
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
          <div className="flex items-center gap-2">
            {currentUserId && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-fg-tertiary hover:text-fg-primary"
                >
                  <MoreHorizontal size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-6 bg-surface-primary border border-border-light shadow-sm z-10 min-w-[100px]">
                    {isOwner ? (
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2.5 font-caption text-[11px] text-red-500 hover:bg-surface-card w-full"
                      >
                        <Trash2 size={13} />
                        삭제
                      </button>
                    ) : (
                      <button
                        onClick={() => { setShowMenu(false); setShowReport(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 font-caption text-[11px] text-fg-secondary hover:bg-surface-card w-full"
                      >
                        <Flag size={13} />
                        신고
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 flex flex-col gap-3">
            <h2 className="font-body text-[17px] font-semibold text-fg-primary leading-[1.4]">
              {post.title}
            </h2>
            <p className="font-body text-[14px] text-fg-secondary leading-[1.7] whitespace-pre-wrap">
              {post.body}
            </p>
            {post.image_url && (
              <div className="relative w-full h-[250px] md:h-[400px] bg-surface-card overflow-hidden mt-1">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-contain"
                  sizes="720px"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-b border-border-light">
            <button onClick={handleLike} className="flex items-center gap-1.5 text-fg-secondary hover:text-fg-primary transition-colors">
              <Heart size={16} className={liked ? "fill-red-500 text-red-500" : ""} />
              <span className="font-caption text-[11px]">{likesCount}</span>
            </button>
          </div>

          {/* Comments */}
          <div className="px-5 py-4">
            {loadingComments ? (
              <p className="font-caption text-[11px] text-fg-tertiary text-center py-4 tracking-[1px]">
                LOADING...
              </p>
            ) : (
              <BoardCommentList
                boardPostId={post.id}
                initialComments={comments}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal
          targetType="board_post"
          targetId={post.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
