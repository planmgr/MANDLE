import Link from "next/link";
import Image from "next/image";
import type { FeaturedMember } from "@/lib/types/community";

interface FeaturedMemberCardProps {
  member: FeaturedMember;
}

export default function FeaturedMemberCard({ member }: FeaturedMemberCardProps) {
  const profile = member.profiles;

  return (
    <Link
      href={`/members/${member.user_id}`}
      className="group flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-card">
        {member.cover_image_url ? (
          <Image
            src={member.cover_image_url}
            alt={profile.nickname}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 768px) 70vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-card">
            <div className="w-16 h-16 rounded-full bg-border-light flex items-center justify-center">
              <span className="font-heading text-[24px] text-fg-tertiary">
                {profile.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 mt-3">
        <div className="flex items-center gap-2">
          <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden bg-surface-card shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.nickname}
                fill
                className="object-cover"
                sizes="22px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-caption text-[9px] text-fg-tertiary">
                {profile.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-caption text-[11px] font-medium tracking-[1px] text-fg-primary">
            {profile.nickname.toUpperCase()}
          </span>
        </div>
        {member.tagline && (
          <p className="font-body text-[12px] text-fg-secondary leading-[1.5] line-clamp-2">
            {member.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
