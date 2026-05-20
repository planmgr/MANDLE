"use client";

import Link from "next/link";

const CATEGORIES = ["BEARD", "SHAVING", "SKINCARE", "FITNESS", "BARBERSHOP"] as const;

interface GroomingCategoryTabsProps {
  activeCategory?: string;
}

export default function GroomingCategoryTabs({
  activeCategory,
}: GroomingCategoryTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border-light">
      <Link
        href="/grooming"
        className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors ${
          !activeCategory
            ? "text-fg-primary border-b-2 border-fg-primary"
            : "text-fg-secondary hover:text-fg-primary"
        }`}
      >
        ALL
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={`/grooming?category=${cat}`}
          className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors ${
            activeCategory === cat
              ? "text-fg-primary border-b-2 border-fg-primary"
              : "text-fg-secondary hover:text-fg-primary"
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
