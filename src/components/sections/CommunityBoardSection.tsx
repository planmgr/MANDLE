import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import type { BoardPost } from "@/lib/types/community";

interface CommunityBoardSectionProps {
  talkPosts: BoardPost[];
  itemPosts: BoardPost[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}달 전`;
}

export default function CommunityBoardSection({ talkPosts, itemPosts }: CommunityBoardSectionProps) {
  if (talkPosts.length === 0 && itemPosts.length === 0) return null;

  // Limit: ITEM 2x2 = 4, TALK matches ITEM height (~5 items)
  const visibleTalk = talkPosts.slice(0, 5);
  const visibleItem = itemPosts.slice(0, 4);

  return (
    <section className="section-px py-9 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 md:items-start">
        {/* TALK — Left */}
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-heading text-2xl md:text-[32px] tracking-[2px] text-fg-primary">
              TALK
            </h2>
            <Link
              href="/community?tab=talk"
              className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary hover:opacity-70 transition-opacity"
            >
              VIEW ALL →
            </Link>
          </div>

          {visibleTalk.length === 0 ? (
            <p className="font-body text-[13px] text-fg-tertiary py-8">게시글이 없습니다.</p>
          ) : (
            <div className="divide-y divide-border-light border-t border-b border-border-light">
              {visibleTalk.map((post) => (
                <Link
                  key={post.id}
                  href="/community?tab=talk"
                  className="flex items-start gap-3 py-4 hover:bg-surface-card/50 transition-colors px-1"
                >
                  <div className="relative w-[28px] h-[28px] rounded-full overflow-hidden bg-surface-card shrink-0 ring-1 ring-border-light mt-0.5">
                    {post.profiles.avatar_url ? (
                      <Image
                        src={post.profiles.avatar_url}
                        alt={post.profiles.nickname}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-caption text-[9px] text-fg-tertiary">
                        {post.profiles.nickname.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body text-[13px] md:text-[14px] font-medium text-fg-primary line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="font-body text-[11px] md:text-[12px] text-fg-tertiary line-clamp-1 mt-0.5">
                      {post.body}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-caption text-[10px] text-fg-tertiary tracking-[0.5px]">
                        {post.profiles.nickname.toUpperCase()}
                      </span>
                      <span className="font-caption text-[10px] text-fg-tertiary">
                        {timeAgo(post.created_at)}
                      </span>
                      <div className="flex items-center gap-1 text-fg-tertiary">
                        <Heart size={9} />
                        <span className="font-caption text-[10px]">{post.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1 text-fg-tertiary">
                        <MessageCircle size={9} />
                        <span className="font-caption text-[10px]">{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ITEM — Right */}
        <div>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-heading text-2xl md:text-[32px] tracking-[2px] text-fg-primary">
              ITEM
            </h2>
            <Link
              href="/community?tab=item"
              className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary hover:opacity-70 transition-opacity"
            >
              VIEW ALL →
            </Link>
          </div>

          {visibleItem.length === 0 ? (
            <p className="font-body text-[13px] text-fg-tertiary py-8">게시글이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleItem.map((post) => (
                <Link
                  key={post.id}
                  href="/community?tab=item"
                  className="group flex flex-col border border-border-light hover:border-fg-primary transition-colors"
                >
                  {post.image_url ? (
                    <div className="relative w-full h-[140px] md:h-[160px] overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[140px] md:h-[160px] bg-surface-card flex items-center justify-center">
                      <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">NO IMAGE</span>
                    </div>
                  )}
                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="font-body text-[12px] md:text-[13px] font-medium text-fg-primary line-clamp-2 leading-[1.4]">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-[10px] text-fg-tertiary tracking-[0.5px]">
                        {post.profiles.nickname.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2 text-fg-tertiary">
                        <div className="flex items-center gap-0.5">
                          <Heart size={9} />
                          <span className="font-caption text-[10px]">{post.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <MessageCircle size={9} />
                          <span className="font-caption text-[10px]">{post.comments_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
