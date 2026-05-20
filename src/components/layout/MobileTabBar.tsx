"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shirt, MessageSquare, Users, User } from "lucide-react";

const TABS = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Shirt, label: "스타일", href: "/style" },
  { icon: MessageSquare, label: "커뮤니티", href: "/community" },
  { icon: Users, label: "멤버스", href: "/members" },
  { icon: User, label: "MY", href: "/my" },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface-primary border-t border-border-light md:hidden">
      <div className="flex items-center justify-around h-14">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive ? "text-fg-primary" : "text-fg-tertiary"
              }`}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="font-caption text-[9px] tracking-[0.5px]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
