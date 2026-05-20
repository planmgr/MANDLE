"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Settings } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  displayName: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  bio: string | null;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export default function ProfileHeader({
  displayName,
  email,
  nickname,
  avatarUrl,
  bio,
  stats,
}: ProfileHeaderProps) {
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();

  const handleSaved = () => {
    setShowEdit(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
        <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden shrink-0 bg-surface-card">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="120px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-heading text-[36px] text-fg-tertiary">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-[28px] md:text-[36px] tracking-[2px] text-fg-primary">
              {displayName}
            </h1>
            <button
              onClick={() => setShowEdit(true)}
              className="font-caption text-[10px] font-medium tracking-[1px] px-3 py-1.5 border border-border-light text-fg-secondary hover:text-fg-primary hover:border-fg-primary transition-colors flex items-center gap-1.5"
            >
              <Settings size={12} />
              EDIT
            </button>
          </div>
          <p className="font-body text-[13px] md:text-[14px] text-fg-secondary leading-[1.6] max-w-[400px]">
            {bio || email}
          </p>
          <div className="flex items-center gap-6 mt-1">
            <div className="flex flex-col items-center">
              <span className="font-body text-[15px] font-bold text-fg-primary">{stats.postsCount}</span>
              <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">LOOKS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-body text-[15px] font-bold text-fg-primary">{stats.followersCount}</span>
              <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">FOLLOWERS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-body text-[15px] font-bold text-fg-primary">{stats.followingCount}</span>
              <span className="font-caption text-[10px] text-fg-tertiary tracking-[1px]">FOLLOWING</span>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          profile={{ nickname, avatarUrl, bio }}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
