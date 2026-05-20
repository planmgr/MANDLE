import SectionHeader from "@/components/ui/SectionHeader";
import UserProfileCard from "@/components/ui/UserProfileCard";
import type { FeaturedMember } from "@/lib/types/community";

interface FeaturedUsersProps {
  members: FeaturedMember[];
}

export default function FeaturedUsers({ members }: FeaturedUsersProps) {
  if (members.length === 0) return null;

  return (
    <section className="bg-surface-dark section-px py-9 md:py-12 lg:py-16">
      <SectionHeader title="FEATURED MEMBERS" href="/members" dark />
      <div className="mt-8 md:mt-10">
        {/* Mobile scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-4 -mx-5 px-5 snap-x">
          {members.map((member) => (
            <div key={member.id} className="snap-start shrink-0 w-[160px]">
              <UserProfileCard
                image={member.cover_image_url ?? member.profiles?.avatar_url ?? "/images/user-1.jpg"}
                name={member.profiles?.nickname ?? "MEMBER"}
                role={member.tagline ?? ""}
                href={`/members/${member.user_id}`}
              />
            </div>
          ))}
        </div>
        {/* Tablet: 3 columns */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
          {members.slice(0, 3).map((member) => (
            <UserProfileCard
              key={member.id}
              image={member.cover_image_url ?? member.profiles?.avatar_url ?? "/images/user-1.jpg"}
              name={member.profiles?.nickname ?? "MEMBER"}
              role={member.tagline ?? ""}
              href={`/members/${member.user_id}`}
            />
          ))}
        </div>
        {/* Desktop: up to 5 columns */}
        <div className={`hidden lg:grid gap-5 ${members.length >= 5 ? "grid-cols-5" : `grid-cols-${members.length}`}`}>
          {members.slice(0, 5).map((member) => (
            <UserProfileCard
              key={member.id}
              image={member.cover_image_url ?? member.profiles?.avatar_url ?? "/images/user-1.jpg"}
              name={member.profiles?.nickname ?? "MEMBER"}
              role={member.tagline ?? ""}
              href={`/members/${member.user_id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
