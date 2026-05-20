import { getFeaturedMembers, getTopMembers } from "@/lib/queries/community";
import PageHeader from "@/components/ui/PageHeader";
import FeaturedMemberCard from "@/components/members/FeaturedMemberCard";
import TopMemberItem from "@/components/members/TopMemberItem";

export default async function MembersPage() {
  const [featuredMembers, topMembers] = await Promise.all([
    getFeaturedMembers(),
    getTopMembers(10),
  ]);

  return (
    <main>
      <section className="section-px py-8 md:py-12">
        <PageHeader
          title="MEMBERS"
          description="MANDLE을 빛내는 멤버들을 만나보세요."
        />

        {/* Featured Members */}
        {featuredMembers.length > 0 && (
          <div className="mt-8 md:mt-10">
            <h2 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mb-5">
              FEATURED
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredMembers.map((member) => (
                <FeaturedMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Top Members */}
        {topMembers.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mb-4">
              TOP MEMBERS
            </h2>
            <div className="max-w-[640px]">
              <div className="divide-y divide-border-light">
                {topMembers.map((member, i) => (
                  <TopMemberItem key={member.user_id} member={member} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>
        )}

        {featuredMembers.length === 0 && topMembers.length === 0 && (
          <p className="font-body text-[14px] text-fg-tertiary text-center py-16 mt-8">
            아직 등록된 멤버가 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
