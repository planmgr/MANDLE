import SectionHeader from "@/components/ui/SectionHeader";
import EditorialCard from "@/components/ui/EditorialCard";
import type { StyleArticle } from "@/lib/types/style";

interface EditorialSectionProps {
  articles: StyleArticle[];
}

export default function EditorialSection({ articles }: EditorialSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="section-px py-9 md:py-12 lg:py-16">
      <SectionHeader title="STYLE" href="/style" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5 lg:gap-6 mt-8 md:mt-10">
        {articles.map((article) => (
          <EditorialCard
            key={article.id}
            image={article.cover_image_url}
            category={article.category}
            title={article.title}
            description={article.summary ?? ""}
            href={`/style/${article.id}`}
          />
        ))}
      </div>
    </section>
  );
}
