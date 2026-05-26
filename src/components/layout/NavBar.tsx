"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, User, Menu, X, LogOut, Bell } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";

const NAV_LINKS = [
  { label: "COMMUNITY", href: "/community" },
  { label: "MEMBERS", href: "/members" },
  { label: "STYLE", href: "/style" },
  { label: "GROOMING", href: "/grooming" },
  { label: "SHOP", href: "/shop" },
];

export default function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications?countOnly=true");
        const data = await res.json();
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        // silently fail
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000); // poll every 60s
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName = user?.user_metadata?.nickname ?? "MY";

  return (
    <header className="sticky top-0 z-50 bg-surface-primary">
      <nav className="flex items-center justify-between section-px h-[52px] md:h-[60px]">
        <div className="flex items-center gap-12">
          <Link href="/" className="relative block h-[20px] md:h-[24px] w-[100px] md:w-[120px]">
            <Image
              src="/images/logo-black.png"
              alt="MANDLE"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary hover:text-fg-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={18} className="md:w-5 md:h-5 text-fg-primary" />
          </button>
          {user && (
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen(true)}
              className="relative"
            >
              <Bell size={18} className="md:w-5 md:h-5 text-fg-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[8px] h-[8px] bg-red-500 rounded-full" />
              )}
            </button>
          )}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/my"
                className="flex items-center gap-1.5 font-caption text-[11px] font-medium tracking-[1.5px] text-fg-primary"
              >
                <User size={16} />
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-fg-secondary hover:text-fg-primary transition-colors"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 font-caption text-[11px] font-medium tracking-[1.5px] text-fg-primary"
            >
              <User size={16} />
              LOGIN
            </Link>
          )}
          <button
            className="hidden md:block lg:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <div className="h-px bg-border-light" />

      {menuOpen && (
        <div className="lg:hidden absolute top-[53px] md:top-[61px] inset-x-0 bg-surface-primary border-b border-border-light z-50">
          <div className="flex flex-col py-4 px-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 font-caption text-[13px] font-medium tracking-[1.5px] text-fg-secondary hover:text-fg-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/my"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 font-caption text-[13px] font-medium tracking-[1.5px] text-fg-primary"
                >
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3 text-left font-caption text-[13px] font-medium tracking-[1.5px] text-fg-secondary hover:text-fg-primary transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="py-3 font-caption text-[13px] font-medium tracking-[1.5px] text-fg-primary"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {notifOpen && (
        <NotificationModal
          onClose={() => setNotifOpen(false)}
          onRead={() => setUnreadCount(0)}
        />
      )}
    </header>
  );
}
