"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, Bookmark, Flag } from "lucide-react";
import { toggleLike, toggleBookmark } from "@/lib/actions/community";
import { timeAgo } from "@/lib/utils/tags";
import CommentList from "./CommentList";
import ReportModal from "./ReportModal";
import type { Post, Comment } from "@/lib/types/community";

interface PostDetailModalProps {
  post: Post;
  currentUserId?: string;
  onClose: () => void;
}

export default function PostDetailModal({ post, currentUserId, onClose }: PostDetailModalProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked ?? false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/community/comments?postId=${post.id}`);
        const data = await res.json();
        setComments(data);
      } catch {
        // silently fail
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [post.id]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleLike = async () => {
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

  const handleBookmark = async () => {
    if (!currentUserId) return;
    setBookmarked(!bookmarked);
    try {
      const result = await toggleBookmark(post.id);
      setBookmarked(result.bookmarked);
    } catch {
      setBookmarked(bookmarked);
    }
  };

  const profile = post.profiles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-[95vw] md:w-[90vw] md:max-w-[1100px] mx-4 flex flex-col md:flex-row h-[85vh] md:h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full md:w-[60%] h-[300px] md:h-auto bg-surface-card shrink-0">
          <Image
            src={post.image_url}
            alt={post.caption ?? "Post"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
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
            <div className="flex items-center gap-2">
              {currentUserId && currentUserId !== post.user_id && (
                <button
                  onClick={() => setShowReport(true)}
                  className="text-fg-tertiary hover:text-fg-primary"
                  title="신고"
                >
                  <Flag size={15} />
                </button>
              )}
              <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="px-5 py-3 border-b border-border-light">
              <p className="font-body text-[13px] text-fg-primary leading-[1.6]">
                {post.caption}
              </p>
            </div>
          )}

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loadingComments ? (
              <p className="font-caption text-[11px] text-fg-tertiary text-center py-4 tracking-[1px]">
                LOADING...
              </p>
            ) : (
              <CommentList
                postId={post.id}
                initialComments={comments}
                currentUserId={currentUserId}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-light">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-1.5 text-fg-secondary hover:text-fg-primary transition-colors">
                <Heart size={16} className={liked ? "fill-red-500 text-red-500" : ""} />
                <span className="font-caption text-[11px]">{likesCount}</span>
              </button>
            </div>
            <button onClick={handleBookmark} className="text-fg-secondary hover:text-fg-primary transition-colors">
              <Bookmark size={16} className={bookmarked ? "fill-fg-primary text-fg-primary" : ""} />
            </button>
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal
          targetType="post"
          targetId={post.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
