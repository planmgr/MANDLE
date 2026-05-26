import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUserList from "@/components/admin/AdminUserList";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users, count } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url, bio, status, suspended_until, admin_memo, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] md:text-[28px] tracking-[2px] text-fg-primary mb-2">
        USERS
      </h1>
      <p className="font-caption text-[11px] text-fg-tertiary tracking-[1px] mb-6">
        총 {count ?? 0}명
      </p>
      <AdminUserList users={users ?? []} />
    </AdminLayout>
  );
}
