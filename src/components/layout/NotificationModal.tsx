"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Heart, MessageCircle, UserPlus } from "lucide-react";
import { markNotificationsRead } from "@/lib/actions/community";

interface NotificationItem {
  id: number;
  type: string;
  target_type: string | null;
  target_id: number | null;
  read: boolean;
  created_at: string;
  actor: { id: string; nickname: string; avatar_url: string | null } | null;
}

interface NotificationModalProps {
  onClose: () => void;
  onRead: () => void;
}

const TYPE_CONFIG: Record<string, { icon: typeof Heart; label: string }> = {
  like: { icon: Heart, label: "님이 게시글을 좋아합니다" },
  comment: { icon: MessageCircle, label: "님이 댓글을 남겼습니다" },
  follow: { icon: UserPlus, label: "님이 팔로우했습니다" },
  board_like: { icon: Heart, label: "님이 글을 좋아합니다" },
  board_comment: { icon: MessageCircle, label: "님이 댓글을 남겼습니다" },
};

function timeAgoShort(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일`;
  return `${Math.floor(days / 30)}달`;
}

export default function NotificationModal({ onClose, onRead }: NotificationModalProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications ?? []);

      // Mark all as read
      if (data.unreadCount > 0) {
        await markNotificationsRead();
        onRead();
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [onRead]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClick = (n: NotificationItem) => {
    if (n.target_type === "board_post") {
      router.push("/community?tab=talk");
    } else if (n.target_type === "post") {
      router.push("/community");
    } else if (n.type === "follow" && n.actor?.id) {
      router.push(`/members/${n.actor.id}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[52px] md:pt-[60px]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-surface-primary w-full max-w-[400px] mx-4 mt-2 border border-border-light shadow-lg max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light shrink-0">
          <h3 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-primary">
            NOTIFICATIONS
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
          ) : notifications.length === 0 ? (
            <p className="font-body text-[13px] text-fg-tertiary text-center py-12">
              알림이 없습니다.
            </p>
          ) : (
            notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] ?? { icon: Heart, label: "" };
              const Icon = config.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-surface-card transition-colors border-b border-border-light last:border-0 ${
                    !n.read ? "bg-surface-card/50" : ""
                  }`}
                >
                  {/* Actor avatar */}
                  <div className="relative w-[28px] h-[28px] rounded-full overflow-hidden bg-surface-card shrink-0 mt-0.5">
                    {n.actor?.avatar_url ? (
                      <Image
                        src={n.actor.avatar_url}
                        alt={n.actor.nickname}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-caption text-[10px] text-fg-tertiary">
                        {n.actor?.nickname?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[13px] text-fg-primary leading-[1.5]">
                      <span className="font-medium">{n.actor?.nickname ?? "알 수 없음"}</span>
                      {config.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Icon size={11} className="text-fg-tertiary shrink-0" />
                      <span className="font-caption text-[10px] text-fg-tertiary">
                        {timeAgoShort(n.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
