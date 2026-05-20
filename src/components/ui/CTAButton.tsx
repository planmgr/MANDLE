import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  text: string;
  href?: string;
  variant?: "light" | "dark";
}

export default function CTAButton({
  text,
  href = "#",
  variant = "light",
}: CTAButtonProps) {
  const styles =
    variant === "light"
      ? "bg-fg-inverse text-fg-primary"
      : "bg-surface-dark text-fg-inverse";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-7 py-3.5 font-caption text-xs font-semibold tracking-[1.5px] ${styles} hover:opacity-90 transition-opacity`}
    >
      {text}
      <ArrowRight size={16} />
    </Link>
  );
}
