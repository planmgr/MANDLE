import FounderSection from "@/components/sections/FounderSection";
import EditorialSection from "@/components/sections/EditorialSection";
import FeaturedUsers from "@/components/sections/FeaturedUsers";
import GroomingSection from "@/components/sections/TrendingNow";
import CommunityBoardSection from "@/components/sections/CommunityBoardSection";
import { getFeaturedStyleArticles } from "@/lib/queries/style";
import { getGroomingArticles } from "@/lib/queries/grooming";
import { getFeaturedMembers, getBoardPosts } from "@/lib/queries/community";

export default async function Home() {
  const [featuredStyles, members, groomingArticles, talkPosts, itemPosts] =
    await Promise.all([
      getFeaturedStyleArticles(3),
      getFeaturedMembers(),
      getGroomingArticles(undefined, 6),
      getBoardPosts(1, undefined, "talk"),
      getBoardPosts(1, undefined, "item"),
    ]);

  return (
    <main>
      <FounderSection />
      <EditorialSection articles={featuredStyles} />
      <FeaturedUsers members={members} />
      <GroomingSection articles={groomingArticles} />
      <CommunityBoardSection
        talkPosts={talkPosts}
        itemPosts={itemPosts}
      />
    </main>
  );
}
