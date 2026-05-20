import Image from "next/image";
import Link from "next/link";

interface EditorialCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  href: string;
}

export default function EditorialCard({
  image,
  category,
  title,
  description,
  href,
}: EditorialCardProps) {
  return (
    <Link href={href} className="group flex flex-col gap-4 w-full">
      <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
        />
      </div>
      <span className="font-caption text-[10px] font-medium tracking-[2px] text-fg-tertiary">
        {category}
      </span>
      <h3 className="font-heading text-lg md:text-[22px] leading-[1.15] tracking-[0.5px] text-fg-primary whitespace-pre-line">
        {title}
      </h3>
      <p className="font-body text-[13px] text-fg-secondary leading-[1.6] line-clamp-2">
        {description}
      </p>
      <span className="font-caption text-[11px] font-semibold tracking-[1px] text-fg-primary group-hover:opacity-70 transition-opacity">
        READ STORY →
      </span>
    </Link>
  );
}
