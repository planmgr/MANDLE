import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  dark?: boolean;
}

export default function SectionHeader({
  title,
  href,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h2
        className={`font-heading text-2xl md:text-[32px] tracking-[2px] ${
          dark ? "text-fg-inverse" : "text-fg-primary"
        }`}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className={`font-caption text-[11px] font-medium tracking-[1.5px] ${
            dark ? "text-fg-tertiary" : "text-fg-secondary"
          } hover:opacity-70 transition-opacity`}
        >
          VIEW ALL →
        </Link>
      )}
    </div>
  );
}
