"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

interface FollowUser {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
}

interface ProfileHeaderProps {
  userId: string;
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
  needsNicknameSetup?: boolean;
}

export default function ProfileHeader({
  userId,
  displayName,
  email,
  nickname,
  avatarUrl,
  bio,
  stats,
  needsNicknameSetup,
}: ProfileHeaderProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [expandedList, setExpandedList] = useState<"followers" | "following" | null>(null);
  const [followUsers, setFollowUsers] = useState<FollowUser[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const router = useRouter();

  const handleSaved = () => {
    setShowEdit(false);
    router.refresh();
  };

  const handleToggleList = (type: "followers" | "following") => {
    if (expandedList === type) {
      setExpandedList(null);
      return;
    }
    setExpandedList(type);
  };

  useEffect(() => {
    if (!expandedList) return;

    const fetchUsers = async () => {
      setListLoading(true);
      setFollowUsers([]);
      try {
        const res = await fetch(`/api/follows?userId=${userId}&type=${expandedList}`);
        const data = await res.json();
        setFollowUsers(data);
      } catch {
        // silently fail
      }
      setListLoading(false);
    };
    fetchUsers();
  }, [expandedList, userId]);

  return (
    <>
      {needsNicknameSetup && !showEdit && (
        <div className="mb-8 p-5 border border-border-light bg-surface-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-heading text-[14px] tracking-[1.5px] text-fg-primary mb-1">
              SET YOUR NICKNAME
            </h3>
            <p className="font-body text-[13px] text-fg-secondary leading-[1.6]">
              커뮤니티에서 사용할 닉네임을 설정해주세요.
            </p>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="shrink-0 px-5 py-2.5 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[2px] hover:opacity-90 transition-opacity"
          >
            SET NICKNAME
          </button>
        </div>
      )}

      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-8 md:gap-12">
        {/* Avatar */}
        <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden shrink-0 bg-surface-card ring-1 ring-border-light">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              priority
              className="object-cover"
              sizes="140px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-heading text-[42px] text-fg-tertiary">
              {displayName.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex flex-col items-center md:flex-row md:items-center gap-3">
            <h1 className="font-heading text-[32px] md:text-[40px] tracking-[3px] text-fg-primary leading-none">
              {displayName}
            </h1>
            <button
              onClick={() => setShowEdit(true)}
              className="font-caption text-[10px] font-medium tracking-[1.5px] px-4 py-1.5 border border-border-light text-fg-tertiary hover:text-accent hover:border-accent transition-colors"
            >
              EDIT PROFILE
            </button>
          </div>

          <p className="font-body text-[14px] md:text-[15px] text-fg-secondary leading-[1.7] max-w-[480px]">
            {bio || email}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start mt-2">
            <div className="flex flex-col items-center px-5 first:pl-0">
              <span className="font-body text-[18px] font-semibold text-fg-primary tracking-[-0.5px]">
                {stats.postsCount}
              </span>
              <span className="font-caption text-[10px] text-fg-tertiary tracking-[1.5px] mt-0.5">
                LOOKS
              </span>
            </div>
            <div className="w-px h-[28px] bg-border-light" />
            <button
              onClick={() => handleToggleList("followers")}
              className={`flex items-center gap-1 px-5 transition-colors ${
                expandedList === "followers" ? "opacity-100" : "hover:opacity-70"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-body text-[18px] font-semibold text-fg-primary tracking-[-0.5px]">
                  {stats.followersCount}
                </span>
                <span className={`font-caption text-[10px] tracking-[1.5px] mt-0.5 ${
                  expandedList === "followers" ? "text-accent" : "text-fg-tertiary"
                }`}>
                  FOLLOWERS
                </span>
              </div>
              <ChevronDown
                size={12}
                className={`text-fg-tertiary transition-transform ${
                  expandedList === "followers" ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
            <div className="w-px h-[28px] bg-border-light" />
            <button
              onClick={() => handleToggleList("following")}
              className={`flex items-center gap-1 px-5 transition-colors ${
                expandedList === "following" ? "opacity-100" : "hover:opacity-70"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-body text-[18px] font-semibold text-fg-primary tracking-[-0.5px]">
                  {stats.followingCount}
                </span>
                <span className={`font-caption text-[10px] tracking-[1.5px] mt-0.5 ${
                  expandedList === "following" ? "text-accent" : "text-fg-tertiary"
                }`}>
                  FOLLOWING
                </span>
              </div>
              <ChevronDown
                size={12}
                className={`text-fg-tertiary transition-transform ${
                  expandedList === "following" ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Inline Follow List */}
      {expandedList && (
        <div className="mt-8 border border-border-light">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-light">
            <span className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary">
              {expandedList === "followers" ? "FOLLOWERS" : "FOLLOWING"}
            </span>
            <button
              onClick={() => setExpandedList(null)}
              className="font-caption text-[10px] text-fg-tertiary hover:text-fg-primary tracking-[1px] transition-colors"
            >
              CLOSE
            </button>
          </div>

          {listLoading ? (
            <div className="py-10 text-center">
              <span className="font-caption text-[11px] text-fg-tertiary tracking-[1px]">
                LOADING...
              </span>
            </div>
          ) : followUsers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-body text-[13px] text-fg-tertiary">
                {expandedList === "followers" ? "아직 팔로워가 없습니다." : "아직 팔로잉이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {followUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/members/${user.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface-card transition-colors"
                >
                  <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-surface-card shrink-0 ring-1 ring-border-light">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.nickname}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-caption text-[12px] text-fg-tertiary">
                        {user.nickname.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-caption text-[12px] font-medium tracking-[0.5px] text-fg-primary">
                      {user.nickname.toUpperCase()}
                    </p>
                    {user.bio && (
                      <p className="font-body text-[11px] text-fg-tertiary truncate mt-0.5">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

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
