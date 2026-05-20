import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";
import FeaturedMemberForm from "@/components/admin/FeaturedMemberForm";
import { updateFeaturedMember, deleteFeaturedMember } from "@/lib/actions/admin";

interface AdminMembersEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminMembersEditPage({ params }: AdminMembersEditPageProps) {
  const { id } = await params;
  const memberId = Number(id);
  if (isNaN(memberId)) notFound();

  const supabase = await createClient();

  const { data: member } = await supabase
    .from("featured_members")
    .select("*, profiles!featured_members_user_id_fkey(*)")
    .eq("id", memberId)
    .single();

  if (!member) notFound();

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        EDIT FEATURED MEMBER
      </h1>
      <FeaturedMemberForm
        initialData={member}
        onSubmit={async (formData) => {
          "use server";
          await updateFeaturedMember(memberId, formData);
        }}
        onDelete={async () => {
          "use server";
          await deleteFeaturedMember(memberId);
        }}
      />
    </AdminLayout>
  );
}
