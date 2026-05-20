import Image from "next/image";
import { getRecommendedUsers } from "@/lib/queries/community";
import FollowButton from "./FollowButton";

interface RecommendedUsersProps {
  currentUserId?: string;
}

export default async function RecommendedUsers({ currentUserId }: RecommendedUsersProps) {
  const users = await getRecommendedUsers(currentUserId, 3);

  if (users.length === 0) return null;

  return (
    <div>
      <h3 className="font-heading text-sm tracking-[2px] text-fg-primary mb-4">
        RECOMMENDED
      </h3>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-surface-card">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.nickname}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-caption text-[10px] text-fg-tertiary">
                  {user.nickname.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-caption text-[11px] font-semibold tracking-[0.5px] text-fg-primary">
                {user.nickname.toUpperCase()}
              </p>
              {user.bio && (
                <p className="font-caption text-[10px] text-fg-tertiary truncate">{user.bio}</p>
              )}
            </div>
            {currentUserId && currentUserId !== user.id && (
              <FollowButton targetUserId={user.id} initialFollowing={false} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
