import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "COMMUNITY — MANDLE",
  description: "스타일을 공유하고, 영감을 나누는 공간. MANDLE 커뮤니티에서 멤버들과 소통하세요.",
  openGraph: {
    title: "COMMUNITY — MANDLE",
    description: "스타일을 공유하고, 영감을 나누는 공간.",
  },
};
import {
  getFeedPosts,
  getBoardPosts,
} from "@/lib/queries/community";
import PageHeader from "@/components/ui/PageHeader";
import FeedTabs from "@/components/community/FeedTabs";
import PostGrid from "@/components/community/PostGrid";
import BoardPostList from "@/components/community/BoardPostList";
import PopularTags from "@/components/community/PopularTags";
import RecommendedUsers from "@/components/community/RecommendedUsers";
import WritePrompt from "@/components/community/WritePrompt";
import type { FeedTab } from "@/lib/types/community";

interface CommunityPageProps {
  searchParams: Promise<{ tab?: string; tag?: string }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const params = await searchParams;
  const tab = (params.tab ?? "mylook") as FeedTab;
  const tag = params.tag;

  let userId: string | undefined;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id;
  }

  const isBoard = tab === "talk" || tab === "item";

  return (
    <main>
      <section className="section-px py-8 md:py-12">
        <PageHeader
          title="COMMUNITY"
          description="스타일을 공유하고, 영감을 나누는 공간."
        />

        <div className="mt-6">
          <FeedTabs currentTab={tab} />
        </div>

        {userId && (
          <div className="mt-6">
            <WritePrompt tab={tab} />
          </div>
        )}

        <div className="flex gap-8 mt-8 md:mt-10">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {isBoard ? (
              <BoardContent userId={userId} category={tab} />
            ) : (
              <FeedContent tab={tab} tag={tag} userId={userId} />
            )}
          </div>

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:flex flex-col gap-8 w-[260px] shrink-0">
            <Suspense fallback={null}>
              <PopularTags activeTag={tag} />
            </Suspense>
            <Suspense fallback={null}>
              <RecommendedUsers currentUserId={userId} />
            </Suspense>
          </aside>
        </div>
      </section>

    </main>
  );
}

async function FeedContent({ tab, tag, userId }: { tab: FeedTab; tag?: string; userId?: string }) {
  const posts = await getFeedPosts(1, userId, tag);

  return (
    <PostGrid
      initialPosts={posts}
      currentUserId={userId}
      tab={tab}
      tag={tag}
    />
  );
}

async function BoardContent({ userId, category }: { userId?: string; category: string }) {
  const boardPosts = await getBoardPosts(1, userId, category);

  return (
    <BoardPostList
      initialPosts={boardPosts}
      currentUserId={userId}
      category={category}
    />
  );
}
