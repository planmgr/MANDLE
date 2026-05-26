"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import BoardPostCard from "./BoardPostCard";
import BoardPostDetailModal from "./BoardPostDetailModal";
import type { BoardPost } from "@/lib/types/community";

interface BoardPostListProps {
  initialPosts: BoardPost[];
  currentUserId?: string;
  category?: string;
  apiTab?: string;
}

export default function BoardPostList({ initialPosts, currentUserId, category, apiTab }: BoardPostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 15);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [prevInitialPosts, setPrevInitialPosts] = useState(initialPosts);

  if (prevInitialPosts !== initialPosts) {
    setPrevInitialPosts(initialPosts);
    setPosts(initialPosts);
    setPage(2);
    setHasMore(initialPosts.length >= 15);
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const fetchTab = apiTab || category || "talk";
      const res = await fetch(`/api/community/posts?tab=${fetchTab}&page=${page}`);
      const newPosts: BoardPost[] = await res.json();

      if (newPosts.length < 15) setHasMore(false);
      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [loading, hasMore, page]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <BoardPostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onOpenDetail={setSelectedPost}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
          게시글이 없습니다. 첫 번째 글을 작성해보세요.
        </p>
      )}

      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <span className="font-caption text-[11px] text-fg-tertiary tracking-[1px]">
              LOADING...
            </span>
          )}
        </div>
      )}

      {selectedPost && (
        <BoardPostDetailModal
          post={selectedPost}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
