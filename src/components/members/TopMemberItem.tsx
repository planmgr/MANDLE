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
      className="flex items-center gap-4 py-4 hover:bg-surface-card/50 transition-colors -mx-2 px-2"
    >
      {/* Rank */}
      <span className="font-caption text-[13px] font-medium text-fg-tertiary w-6 text-center shrink-0">
        {rank}
      </span>

      {/* Avatar */}
      <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden bg-surface-card shrink-0">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.nickname}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-caption text-[20px] text-fg-tertiary">
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-caption text-[13px] font-medium tracking-[1px] text-fg-primary truncate">
          {profile.nickname.toUpperCase()}
        </p>
        {profile.bio && (
          <p className="font-body text-[12px] text-fg-tertiary truncate mt-1">
            {profile.bio}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 font-caption text-[11px] text-fg-tertiary">
            <FileText size={13} />
            {member.posts_count}
          </span>
          <span className="flex items-center gap-1 font-caption text-[11px] text-fg-tertiary">
            <Heart size={13} />
            {member.total_likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
