"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import type { Post, FeedTab } from "@/lib/types/community";

interface PostGridProps {
  initialPosts: Post[];
  currentUserId?: string;
  tab: FeedTab;
  tag?: string;
}

export default function PostGrid({ initialPosts, currentUserId, tab, tag }: PostGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [prevInitialPosts, setPrevInitialPosts] = useState(initialPosts);

  // Reset when tab/tag changes (render-time sync)
  if (prevInitialPosts !== initialPosts) {
    setPrevInitialPosts(initialPosts);
    setPosts(initialPosts);
    setPage(2);
    setHasMore(initialPosts.length >= 12);
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params = new URLSearchParams({ tab, page: String(page) });
    if (tag) params.set("tag", tag);

    try {
      const res = await fetch(`/api/community/posts?${params}`);
      const newPosts: Post[] = await res.json();

      if (newPosts.length < 12) setHasMore(false);
      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [loading, hasMore, page, tab, tag]);

  // Intersection Observer for infinite scroll
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onOpenDetail={setSelectedPost}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
          게시글이 없습니다.
        </p>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <span className="font-caption text-[11px] text-fg-tertiary tracking-[1px]">
              LOADING...
            </span>
          )}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
