import FounderSection from "@/components/sections/FounderSection";
import EditorialSection from "@/components/sections/EditorialSection";
import FeaturedUsers from "@/components/sections/FeaturedUsers";
import GroomingSection from "@/components/sections/TrendingNow";
import LookbookSection from "@/components/sections/LookbookSection";
import { getFeaturedStyleArticles, getStyleArticles } from "@/lib/queries/style";
import { getGroomingArticles } from "@/lib/queries/grooming";
import { getFeaturedMembers } from "@/lib/queries/community";

export default async function Home() {
  const [featuredStyles, members, groomingArticles, latestStyles] =
    await Promise.all([
      getFeaturedStyleArticles(3),
      getFeaturedMembers(),
      getGroomingArticles(undefined, 6),
      getStyleArticles(undefined, 4),
    ]);

  return (
    <main>
      <FounderSection />
      <EditorialSection articles={featuredStyles} />
      <FeaturedUsers members={members} />
      <GroomingSection articles={groomingArticles} />
      <LookbookSection articles={latestStyles} />
    </main>
  );
}
