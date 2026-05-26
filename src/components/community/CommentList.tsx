"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { addComment, deleteComment } from "@/lib/actions/community";
import { timeAgo } from "@/lib/utils/tags";
import type { Comment } from "@/lib/types/community";

interface CommentListProps {
  postId: number;
  initialComments: Comment[];
  currentUserId?: string;
}

export default function CommentList({ postId, initialComments, currentUserId }: CommentListProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUserId) return;

    setLoading(true);
    try {
      const newComment = await addComment(postId, content.trim());
      setComments([...comments, newComment as Comment]);
      setContent("");
    } catch {
      alert("댓글 작성에 실패했습니다.");
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Comments */}
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
        {comments.length === 0 && (
          <p className="font-body text-[13px] text-fg-tertiary text-center py-4">
            아직 댓글이 없습니다.
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2.5">
            <div className="relative w-[24px] h-[24px] rounded-full overflow-hidden bg-surface-card shrink-0">
              {comment.profiles.avatar_url ? (
                <Image
                  src={comment.profiles.avatar_url}
                  alt={comment.profiles.nickname}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-caption text-[10px] text-fg-tertiary">
                  {comment.profiles.nickname.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-caption text-[11px] font-medium text-fg-primary">
                  {comment.profiles.nickname.toUpperCase()}
                </span>
                <span className="font-caption text-[10px] text-fg-tertiary">
                  {timeAgo(comment.created_at)}
                </span>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-fg-tertiary hover:text-red-500 transition-colors ml-auto"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <p className="font-body text-[13px] text-fg-secondary leading-[1.5] mt-0.5">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border-light pt-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            maxLength={1000}
            className="flex-1 font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="font-caption text-[11px] font-medium tracking-[1px] text-accent disabled:text-fg-tertiary"
          >
            POST
          </button>
        </form>
      )}
    </div>
  );
}
