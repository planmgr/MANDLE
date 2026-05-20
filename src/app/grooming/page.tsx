import PageHeader from "@/components/ui/PageHeader";
import GroomingArticleCard from "@/components/grooming/GroomingArticleCard";
import GroomingCategoryTabs from "@/components/grooming/GroomingCategoryTabs";
import { getGroomingArticles } from "@/lib/queries/grooming";

interface GroomingPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function GroomingPage({ searchParams }: GroomingPageProps) {
  const params = await searchParams;
  const activeCategory = params.category;

  const articles = await getGroomingArticles(activeCategory);

  return (
    <main>
      <section className="section-px py-8 md:py-12">
        <PageHeader
          title="GROOMING"
          description="두피 케어, 수염 관리, 피트니스 — 자기관리의 모든 것."
        />

        <div className="mt-6">
          <GroomingCategoryTabs activeCategory={activeCategory} />
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mt-8 md:mt-10">
            {articles.map((article, i) => (
              <GroomingArticleCard
                key={article.id}
                article={article}
                priority={i < 3}
              />
            ))}
          </div>
        ) : (
          <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
            아직 등록된 글이 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
