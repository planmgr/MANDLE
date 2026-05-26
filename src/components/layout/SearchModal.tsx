"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Search, Camera, MessageSquare, FileText, Scissors, User } from "lucide-react";

interface SearchResults {
  posts: { id: number; caption: string | null; image_url: string; created_at: string; profiles: { nickname: string } }[];
  boardPosts: { id: number; title: string; category: string; created_at: string; profiles: { nickname: string } }[];
  styleArticles: { id: number; title: string; category: string; cover_image_url: string; created_at: string }[];
  groomingArticles: { id: number; title: string; category: string; cover_image_url: string; created_at: string }[];
  users: { id: string; nickname: string; avatar_url: string | null; bio: string | null }[];
}

const EMPTY: SearchResults = { posts: [], boardPosts: [], styleArticles: [], groomingArticles: [], users: [] };

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults(EMPTY);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch {
      setResults(EMPTY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const totalResults =
    results.posts.length +
    results.boardPosts.length +
    results.styleArticles.length +
    results.groomingArticles.length +
    results.users.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[52px] md:pt-[60px] bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-full max-w-[560px] mx-4 mt-4 flex flex-col max-h-[80vh] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
          <Search size={18} className="text-fg-tertiary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="flex-1 font-body text-[15px] text-fg-primary placeholder:text-fg-tertiary bg-transparent outline-none"
          />
          <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-fg-tertiary border-t-fg-primary rounded-full animate-spin" />
            </div>
          )}

          {!loading && searched && totalResults === 0 && (
            <p className="font-body text-[13px] text-fg-tertiary text-center py-12">
              검색 결과가 없습니다.
            </p>
          )}

          {!loading && totalResults > 0 && (
            <div className="py-2">
              {/* MY LOOK */}
              {results.posts.length > 0 && (
                <Section icon={Camera} label="MY LOOK">
                  {results.posts.map((post) => (
                    <button key={post.id} onClick={() => navigate(`/community?tab=mylook`)} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-surface-card transition-colors text-left">
                      <div className="relative w-[36px] h-[36px] bg-surface-card overflow-hidden shrink-0">
                        <Image src={post.image_url} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-fg-primary truncate">{post.caption || "—"}</p>
                        <p className="font-caption text-[10px] text-fg-tertiary">{post.profiles.nickname}</p>
                      </div>
                    </button>
                  ))}
                </Section>
              )}

              {/* TALK / ITEM */}
              {results.boardPosts.length > 0 && (
                <Section icon={MessageSquare} label="TALK · ITEM">
                  {results.boardPosts.map((post) => (
                    <button key={post.id} onClick={() => navigate(`/community?tab=${post.category}`)} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-surface-card transition-colors text-left">
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-fg-primary truncate">{post.title}</p>
                        <p className="font-caption text-[10px] text-fg-tertiary">{post.profiles.nickname} · {post.category.toUpperCase()}</p>
                      </div>
                    </button>
                  ))}
                </Section>
              )}

              {/* STYLE */}
              {results.styleArticles.length > 0 && (
                <Section icon={FileText} label="STYLE">
                  {results.styleArticles.map((article) => (
                    <button key={article.id} onClick={() => navigate(`/style/${article.id}`)} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-surface-card transition-colors text-left">
                      <div className="relative w-[36px] h-[36px] bg-surface-card overflow-hidden shrink-0">
                        <Image src={article.cover_image_url} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-fg-primary truncate">{article.title}</p>
                        <p className="font-caption text-[10px] text-fg-tertiary">{article.category}</p>
                      </div>
                    </button>
                  ))}
                </Section>
              )}

              {/* GROOMING */}
              {results.groomingArticles.length > 0 && (
                <Section icon={Scissors} label="GROOMING">
                  {results.groomingArticles.map((article) => (
                    <button key={article.id} onClick={() => navigate(`/grooming/${article.id}`)} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-surface-card transition-colors text-left">
                      <div className="relative w-[36px] h-[36px] bg-surface-card overflow-hidden shrink-0">
                        <Image src={article.cover_image_url} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-fg-primary truncate">{article.title}</p>
                        <p className="font-caption text-[10px] text-fg-tertiary">{article.category}</p>
                      </div>
                    </button>
                  ))}
                </Section>
              )}

              {/* USERS */}
              {results.users.length > 0 && (
                <Section icon={User} label="USERS">
                  {results.users.map((user) => (
                    <button key={user.id} onClick={() => navigate(`/members/${user.id}`)} className="flex items-center gap-3 w-full px-5 py-2.5 hover:bg-surface-card transition-colors text-left">
                      <div className="relative w-[28px] h-[28px] rounded-full bg-surface-card overflow-hidden shrink-0">
                        {user.avatar_url ? (
                          <Image src={user.avatar_url} alt={user.nickname} fill className="object-cover" sizes="28px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-caption text-[10px] text-fg-tertiary">
                            {user.nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-fg-primary">{user.nickname}</p>
                        {user.bio && <p className="font-caption text-[10px] text-fg-tertiary truncate">{user.bio}</p>}
                      </div>
                    </button>
                  ))}
                </Section>
              )}
            </div>
          )}

          {!loading && !searched && (
            <p className="font-body text-[13px] text-fg-tertiary text-center py-12">
              게시글, 아티클, 유저를 검색할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 px-5 py-1.5">
        <Icon size={13} className="text-fg-tertiary" />
        <span className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-tertiary">{label}</span>
      </div>
      {children}
    </div>
  );
}
