import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("featured_members")
    .select("*, profiles!featured_members_user_id_fkey(*)")
    .order("display_order", { ascending: true });

  const list = members ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] md:text-[28px] tracking-[2px] text-fg-primary">
          FEATURED MEMBERS
        </h1>
        <Link
          href="/admin/members/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[1.5px] hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          NEW
        </Link>
      </div>

      {list.length > 0 ? (
        <div className="border border-border-light overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light bg-surface-card">
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">NICKNAME</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">TAGLINE</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">ORDER</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">ACTIVE</th>
              </tr>
            </thead>
            <tbody>
              {list.map((member) => (
                <tr key={member.id} className="border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/members/${member.id}`} className="font-body text-[13px] text-fg-primary hover:underline">
                      {member.profiles?.nickname ?? "Unknown"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-[12px] text-fg-secondary truncate max-w-[200px]">
                    {member.tagline ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">{member.display_order}</td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-secondary">
                    {member.is_active ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
          등록된 멤버가 없습니다.
        </p>
      )}
    </AdminLayout>
  );
}
