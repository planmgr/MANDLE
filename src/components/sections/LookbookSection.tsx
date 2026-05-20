import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import type { StyleArticle } from "@/lib/types/style";

interface LookbookSectionProps {
  articles: StyleArticle[];
}

export default function LookbookSection({ articles }: LookbookSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-surface-card section-px py-9 md:py-12 lg:py-16">
      <SectionHeader title="LATEST STYLE" href="/style" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/style/${article.id}`}
            className="group relative w-full h-[280px] md:h-[360px] lg:h-[400px] overflow-hidden"
          >
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1440px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 p-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-caption text-[10px] font-medium tracking-[2px] text-fg-muted">
                {article.category}
              </span>
              <h3 className="font-body text-[13px] font-semibold text-fg-inverse mt-1 line-clamp-2">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
