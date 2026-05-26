"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FeedTab } from "@/lib/types/community";

const TABS: { label: string; value: FeedTab }[] = [
  { label: "MY LOOK", value: "mylook" },
  { label: "TALK", value: "talk" },
  { label: "ITEM", value: "item" },
];

interface FeedTabsProps {
  currentTab: FeedTab;
}

export default function FeedTabs({ currentTab }: FeedTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTab = (tab: FeedTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("tag");
    router.push(`/community?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-6 border-b border-border-light">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTab(tab.value)}
          className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors ${
            currentTab === tab.value
              ? "text-fg-primary border-b-2 border-fg-primary"
              : "text-fg-tertiary hover:text-fg-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
