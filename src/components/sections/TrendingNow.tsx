import SectionHeader from "@/components/ui/SectionHeader";
import TrendingItem from "@/components/ui/TrendingItem";
import type { GroomingArticle } from "@/lib/types/grooming";

interface GroomingSectionProps {
  articles: GroomingArticle[];
}

export default function GroomingSection({ articles }: GroomingSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="section-px py-9 md:py-12 lg:py-16">
      <SectionHeader title="GROOMING" href="/grooming" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6 mt-8 md:mt-10">
        {articles.map((article, i) => (
          <TrendingItem
            key={article.id}
            number={String(i + 1).padStart(2, "0")}
            image={article.cover_image_url}
            title={article.title}
            label={article.category}
            href={`/grooming/${article.id}`}
          />
        ))}
      </div>
    </section>
  );
}
