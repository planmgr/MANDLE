import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";
import FeaturedMemberForm from "@/components/admin/FeaturedMemberForm";
import { createFeaturedMember } from "@/lib/actions/admin";
import type { Profile } from "@/lib/types/community";

export default async function AdminMembersNewPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("nickname", { ascending: true });

  const profiles = (data as Profile[]) ?? [];

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        NEW FEATURED MEMBER
      </h1>
      <FeaturedMemberForm
        profiles={profiles}
        onSubmit={async (formData) => {
          "use server";
          await createFeaturedMember(formData);
        }}
      />
    </AdminLayout>
  );
}
