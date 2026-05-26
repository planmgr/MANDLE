import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getUserStats, getUserPosts, getBookmarkedPosts } from "@/lib/queries/community";
import PostGrid from "@/components/community/PostGrid";
import ProfileHeader from "@/components/community/ProfileHeader";

export const metadata: Metadata = {
  title: "MY PAGE — MANDLE",
  robots: { index: false, follow: false },
};

interface MyPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyPage({ searchParams }: MyPageProps) {
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const tab = params.tab ?? "looks";

  // Fetch profile from profiles table (includes bio)
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_url, bio, nickname_set_by_user")
    .eq("id", user.id)
    .single();

  const nickname = profile?.nickname ?? user.user_metadata?.nickname ?? user.email?.split("@")[0] ?? "USER";
  const avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null;
  const bio = profile?.bio ?? null;
  const displayName = nickname.toUpperCase();
  const needsNicknameSetup = profile?.nickname_set_by_user === false;

  const stats = await getUserStats(user.id);

  let posts;
  if (tab === "saved") {
    posts = await getBookmarkedPosts(user.id, 1);
  } else {
    posts = await getUserPosts(user.id, 1);
  }

  const TABS = [
    { label: "MY LOOKS", value: "looks" },
    { label: "SAVED", value: "saved" },
  ];

  return (
    <main>
      {/* Profile Header */}
      <section className="section-px py-10 md:py-14">
        <ProfileHeader
          displayName={displayName}
          email={user.email ?? ""}
          nickname={nickname}
          avatarUrl={avatarUrl}
          bio={bio}
          stats={stats}
          needsNicknameSetup={needsNicknameSetup}
        />
      </section>

      {/* Tabs */}
      <section className="section-px">
        <div className="flex items-center gap-6 border-b border-border-light">
          {TABS.map((t) => (
            <a
              key={t.value}
              href={t.value === "looks" ? "/my" : `/my?tab=${t.value}`}
              className={`pb-3 font-caption text-[11px] md:text-[12px] font-medium tracking-[1.5px] transition-colors ${
                tab === t.value
                  ? "text-fg-primary border-b-2 border-fg-primary"
                  : "text-fg-tertiary hover:text-fg-primary"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="section-px py-8 md:py-10">
        <PostGrid
          initialPosts={posts}
          currentUserId={user.id}
          tab="mylook"
        />
      </section>
    </main>
  );
}
