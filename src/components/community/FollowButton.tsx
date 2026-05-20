"use client";

import { useState } from "react";
import { toggleFollow } from "@/lib/actions/community";

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
}

export default function FollowButton({ targetUserId, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setFollowing(!following);
    try {
      const result = await toggleFollow(targetUserId);
      setFollowing(result.following);
    } catch {
      setFollowing(following);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`font-caption text-[10px] font-medium tracking-[1px] px-3 py-1 transition-colors ${
        following
          ? "text-fg-tertiary border border-border-light hover:text-fg-primary"
          : "text-fg-inverse bg-fg-primary hover:opacity-90"
      }`}
    >
      {following ? "FOLLOWING" : "FOLLOW"}
    </button>
  );
}
