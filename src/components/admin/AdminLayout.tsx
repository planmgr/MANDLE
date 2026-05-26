import Link from "next/link";
import { FileText, Users, LayoutDashboard, Scissors, MessageSquare, UserCog } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Style", href: "/admin/style", icon: FileText },
  { label: "Grooming", href: "/admin/grooming", icon: Scissors },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Community", href: "/admin/community", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-61px)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] bg-surface-dark shrink-0 py-6 px-4">
        <p className="font-caption text-[10px] font-medium tracking-[2px] text-fg-muted mb-6">
          ADMIN
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 font-caption text-[12px] text-fg-muted hover:text-fg-inverse hover:bg-white/5 transition-colors"
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-border-dark">
          <Link
            href="/"
            className="font-caption text-[11px] text-fg-muted hover:text-fg-inverse transition-colors"
          >
            &larr; 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-4 px-5 py-3 bg-surface-dark w-full fixed bottom-0 z-50">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1 text-fg-muted hover:text-fg-inverse"
          >
            <item.icon size={16} />
            <span className="font-caption text-[9px]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
