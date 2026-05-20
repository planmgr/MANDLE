import Link from "next/link";
import { getPopularTags } from "@/lib/queries/community";

interface PopularTagsProps {
  activeTag?: string;
}

export default async function PopularTags({ activeTag }: PopularTagsProps) {
  const tags = await getPopularTags(8);

  if (tags.length === 0) return null;

  return (
    <div>
      <h3 className="font-heading text-sm tracking-[2px] text-fg-primary mb-4">
        POPULAR TAGS
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={activeTag === tag.name ? "/community" : `/community?tag=${tag.name}`}
            className={`px-3 py-1.5 font-caption text-[11px] border transition-colors ${
              activeTag === tag.name
                ? "border-fg-primary text-fg-primary"
                : "border-border-light text-fg-secondary hover:border-fg-primary hover:text-fg-primary"
            }`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
