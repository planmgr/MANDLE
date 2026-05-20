import Link from "next/link";
import Image from "next/image";
import type { GroomingArticle } from "@/lib/types/grooming";

interface GroomingArticleCardProps {
  article: GroomingArticle;
  priority?: boolean;
}

export default function GroomingArticleCard({
  article,
  priority = false,
}: GroomingArticleCardProps) {
  return (
    <Link
      href={`/grooming/${article.id}`}
      className="flex flex-col gap-3 group"
    >
      <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden bg-surface-card">
        <Image
          src={article.cover_image_url}
          alt={article.title}
          fill
          priority={priority}
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="font-caption text-[10px] font-medium tracking-[2px] text-accent">
          {article.category}
        </span>
        {article.read_time && (
          <span className="font-caption text-[10px] text-fg-tertiary">
            {article.read_time}
          </span>
        )}
      </div>
      <h3 className="font-body text-[15px] md:text-base font-bold text-fg-primary leading-[1.4]">
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
