import Link from "next/link";
import Image from "next/image";
import type { StyleArticle } from "@/lib/types/style";

interface StyleArticleCardProps {
  article: StyleArticle;
  priority?: boolean;
}

export default function StyleArticleCard({ article, priority }: StyleArticleCardProps) {
  return (
    <Link href={`/style/${article.id}`} className="group flex flex-col gap-3">
      <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden bg-surface-card">
        <Image
          src={article.cover_image_url}
          alt={article.title}
          fill
          {...(priority && { priority: true })}
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <span className="font-caption text-[10px] font-medium tracking-[2px] text-fg-tertiary">
        {article.category}
      </span>
      <h3 className="font-body text-[15px] font-bold text-fg-primary leading-[1.4] line-clamp-2">
        {article.title}
      </h3>
      {article.summary && (
        <p className="font-body text-[13px] text-fg-secondary leading-[1.6] line-clamp-2">
          {article.summary}
        </p>
      )}
    </Link>
  );
}
