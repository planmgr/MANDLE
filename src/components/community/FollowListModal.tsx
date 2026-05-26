"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface FollowUser {
  id: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
}

interface FollowListModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export default function FollowListModal({ userId, type, onClose }: FollowListModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/follows?userId=${userId}&type=${type}`);
        const data = await res.json();
        setUsers(data);
      } catch {
        // silently fail
      }
      setLoading(false);
    };
    fetchUsers();
  }, [userId, type]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-[90vw] max-w-[400px] mx-4 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light shrink-0">
          <h3 className="font-caption text-[12px] font-medium tracking-[1.5px] text-fg-primary">
            {type === "followers" ? "FOLLOWERS" : "FOLLOWING"}
          </h3>
          <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="font-caption text-[11px] text-fg-tertiary text-center py-8 tracking-[1px]">
              LOADING...
            </p>
          ) : users.length === 0 ? (
            <p className="font-body text-[13px] text-fg-tertiary text-center py-12">
              {type === "followers" ? "아직 팔로워가 없습니다." : "아직 팔로잉이 없습니다."}
            </p>
          ) : (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/members/${user.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-surface-card transition-colors border-b border-border-light last:border-0"
              >
                <div className="relative w-[36px] h-[36px] rounded-full overflow-hidden bg-surface-card shrink-0">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
