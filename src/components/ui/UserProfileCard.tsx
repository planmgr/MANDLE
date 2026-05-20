import Image from "next/image";
import Link from "next/link";

interface UserProfileCardProps {
  image: string;
  name: string;
  role: string;
  city?: string;
  href: string;
}

export default function UserProfileCard({
  image,
  name,
  role,
  city,
  href,
}: UserProfileCardProps) {
  return (
    <Link href={href} className="group flex flex-col gap-3 w-full min-w-[160px]">
      <div className="relative w-full h-[200px] md:h-[280px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 160px, (max-width: 1440px) 33vw, 20vw"
        />
      </div>
      <h3 className="font-heading text-sm md:text-base tracking-[1px] text-fg-inverse">
        {name}
      </h3>
      <p className="font-body text-[11px] md:text-xs text-fg-tertiary leading-[1.5]">
        {role}
        {city && (
          <>
            <br />
            {city}
          </>
        )}
      </p>
    </Link>
  );
}
