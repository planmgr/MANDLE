import Image from "next/image";
import Link from "next/link";

interface TrendingItemProps {
  number: string;
  image: string;
  title: string;
  label: string;
  href: string;
}

export default function TrendingItem({
  number,
  image,
  title,
  label,
  href,
}: TrendingItemProps) {
  return (
    <Link href={href} className="group flex flex-col gap-3 w-full">
      <div className="relative w-full h-[160px] md:h-[200px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1440px) 33vw, 16vw"
        />
      </div>
      <span className="font-heading text-[22px] md:text-[28px] tracking-[1px] text-fg-primary">
        {number}
      </span>
      <h3 className="font-body text-[13px] md:text-sm font-semibold text-fg-primary line-clamp-1">
        {title}
      </h3>
      <span className="font-caption text-[11px] text-fg-tertiary">{label}</span>
    </Link>
  );
}
