"use client";

import Link from "next/link";

const CATEGORIES = [
  "MINIMAL",
  "STREET",
  "GENTLEMAN",
  "BUSINESS",
  "FITNESS",
  "BEARD",
  "GLASSES",
  "FRAGRANCE",
] as const;

interface StyleCategoryTabsProps {
  activeCategory?: string;
}

export default function StyleCategoryTabs({
  activeCategory,
}: StyleCategoryTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border-light overflow-x-auto">
      <Link
        href="/style"
        className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors whitespace-nowrap ${
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
          href={`/style?category=${cat}`}
          className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors whitespace-nowrap ${
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
