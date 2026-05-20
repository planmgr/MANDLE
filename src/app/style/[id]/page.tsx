import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStyleArticleById, getStyleArticles } from "@/lib/queries/style";
import StyleArticleCard from "@/components/style/StyleArticleCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface StyleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StyleDetailPage({ params }: StyleDetailPageProps) {
  const { id } = await params;
  const articleId = Number(id);

  if (isNaN(articleId)) notFound();

  const article = await getStyleArticleById(articleId);
  if (!article) notFound();

  // Related articles from same category
  const relatedArticles = (await getStyleArticles(article.category, 4)).filter(
    (a) => a.id !== article.id
  );

  const date = new Date(article.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main>
      {/* Cover Image */}
      <div className="relative w-full h-[300px] md:h-[480px] overflow-hidden bg-surface-card">
        <Image
          src={article.cover_image_url}
          alt={article.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 section-px pb-8 md:pb-12">
          <span className="font-caption text-[10px] font-medium tracking-[2px] text-accent">
            {article.category}
          </span>
          <h1 className="font-heading text-[28px] md:text-[44px] tracking-[2px] text-fg-inverse mt-2">
            {article.title}
          </h1>
          <p className="font-caption text-[11px] text-fg-muted mt-2">
            {date}
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="section-px py-8 md:py-12">
        <article className="max-w-[720px] mx-auto">
          {article.summary && (
            <p className="font-body text-[16px] md:text-[18px] text-fg-secondary leading-[1.8] italic mb-8 pb-8 border-b border-border-light">
              {article.summary}
            </p>
          )}
          <MarkdownRenderer content={article.body} />
        </article>

        {/* Back */}
        <div className="mt-10 pt-8 border-t border-border-light max-w-[720px] mx-auto">
          <Link
            href={`/style?category=${article.category}`}
            className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary hover:text-fg-primary transition-colors"
          >
            &larr; {article.category} 더보기
          </Link>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section-px py-9 md:py-12 bg-surface-card">
          <h2 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mb-6">
            RELATED STYLES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {relatedArticles.slice(0, 3).map((a) => (
              <StyleArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
