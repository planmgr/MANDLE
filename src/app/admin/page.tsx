import Link from "next/link";
import { FileText, Scissors, Users, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [styleRes, groomingRes, membersRes, postsRes, boardPostsRes] = await Promise.all([
    supabase.from("style_articles").select("id", { count: "exact", head: true }),
    supabase.from("grooming_articles").select("id", { count: "exact", head: true }),
    supabase.from("featured_members").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("board_posts").select("id", { count: "exact", head: true }),
  ]);

  const communityTotal = (postsRes.count ?? 0) + (boardPostsRes.count ?? 0);

  const cards = [
    { label: "Style Articles", count: styleRes.count ?? 0, href: "/admin/style", icon: FileText },
    { label: "Grooming Articles", count: groomingRes.count ?? 0, href: "/admin/grooming", icon: Scissors },
    { label: "Featured Members", count: membersRes.count ?? 0, href: "/admin/members", icon: Users },
    { label: "Community Posts", count: communityTotal, href: "/admin/community", icon: MessageSquare },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-[28px] md:text-[36px] tracking-[2px] text-fg-primary mb-8">
        ADMIN
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-4 p-6 border border-border-light hover:border-fg-primary transition-colors"
          >
            <card.icon size={20} className="text-fg-secondary" />
            <div>
              <p className="font-heading text-[24px] tracking-[1px] text-fg-primary">
                {card.count}
              </p>
              <p className="font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary mt-1">
                {card.label.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
