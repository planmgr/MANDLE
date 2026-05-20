import PageHeader from "@/components/ui/PageHeader";
import StyleArticleCard from "@/components/style/StyleArticleCard";
import StyleCategoryTabs from "@/components/style/StyleCategoryFilter";
import { getStyleArticles } from "@/lib/queries/style";

interface StylePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function StylePage({ searchParams }: StylePageProps) {
  const params = await searchParams;
  const activeCategory = params.category;

  const articles = await getStyleArticles(activeCategory);

  return (
    <main>
      <section className="section-px py-8 md:py-12">
        <PageHeader
          title="STYLE"
          description="카테고리별 스타일을 탐색하고, 나만의 무드를 찾아보세요."
        />

        <div className="mt-6">
          <StyleCategoryTabs activeCategory={activeCategory} />
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mt-8 md:mt-10">
            {articles.map((article, i) => (
              <StyleArticleCard
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
