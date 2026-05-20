import Link from "next/link";
import Image from "next/image";
import { FileText, Heart } from "lucide-react";
import type { TopMember } from "@/lib/types/community";

interface TopMemberItemProps {
  member: TopMember;
  rank: number;
}

export default function TopMemberItem({ member, rank }: TopMemberItemProps) {
  const profile = member.profiles;

  return (
    <Link
      href={`/members/${member.user_id}`}
      className="group flex flex-col border border-border-light hover:border-fg-tertiary transition-colors"
    >
      {/* Avatar */}
      <div className="relative w-full aspect-square overflow-hidden bg-surface-card">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.nickname}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-heading text-[40px] text-fg-tertiary bg-surface-card">
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="font-caption text-[14px] font-semibold tracking-[2px] text-fg-primary" style={{ WebkitTextStroke: "2px white", paintOrder: "stroke fill" }}>
            #{String(rank).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <p className="font-caption text-[12px] font-medium tracking-[1.5px] text-fg-primary">
          {profile.nickname.toUpperCase()}
        </p>
        <p className="font-body text-[12px] text-fg-tertiary leading-[1.5] line-clamp-1 min-h-[18px]">
          {profile.bio || "\u00A0"}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 font-caption text-[11px] text-fg-tertiary">
            <FileText size={12} />
            {member.posts_count}
          </span>
          <span className="flex items-center gap-1 font-caption text-[11px] text-fg-tertiary">
            <Heart size={12} />
            {member.total_likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
