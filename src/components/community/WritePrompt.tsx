"use client";

import { useState } from "react";
import { Camera, PenLine, Package } from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";
import CreateBoardPostDialog from "./CreateBoardPostDialog";
import type { FeedTab } from "@/lib/types/community";

const TAB_CONFIG: Record<FeedTab, { icon: typeof Camera; placeholder: string; category?: string }> = {
  mylook: {
    icon: Camera,
    placeholder: "오늘의 스타일을 공유해보세요",
  },
  talk: {
    icon: PenLine,
    placeholder: "자유롭게 이야기를 나눠보세요",
    category: "talk",
  },
  item: {
    icon: Package,
    placeholder: "추천 아이템을 공유해보세요",
    category: "item",
  },
};

export default function WritePrompt({ tab }: { tab: FeedTab }) {
  const [open, setOpen] = useState(false);
  const config = TAB_CONFIG[tab];
  const Icon = config.icon;
  const isBoard = tab === "talk" || tab === "item";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-5 py-4 bg-fg-primary text-fg-inverse hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} className="shrink-0" />
          <span className="font-body text-[13px]">
            {config.placeholder}
          </span>
        </span>
        <span className="font-caption text-[11px] tracking-[1.5px] font-medium">
          WRITE
        </span>
      </button>

      {open && (
        isBoard ? (
          <CreateBoardPostDialog onClose={() => setOpen(false)} category={config.category} />
        ) : (
          <CreatePostDialog onClose={() => setOpen(false)} />
        )
      )}
    </>
  );
}
