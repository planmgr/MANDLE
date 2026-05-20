import Link from "next/link";
import { Plus } from "lucide-react";
import { getGroomingArticles } from "@/lib/queries/grooming";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function AdminGroomingPage() {
  const articles = await getGroomingArticles(undefined, 100);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-[24px] md:text-[28px] tracking-[2px] text-fg-primary">
          GROOMING ARTICLES
        </h1>
        <Link
          href="/admin/grooming/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[1.5px] hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          NEW
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="border border-border-light overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light bg-surface-card">
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">TITLE</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">CATEGORY</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">READ TIME</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">ORDER</th>
                <th className="px-4 py-3 font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">DATE</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border-light last:border-0 hover:bg-surface-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/grooming/${article.id}`} className="font-body text-[13px] text-fg-primary hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-caption text-[10px] tracking-[1.5px] text-fg-secondary">{article.category}</td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">{article.read_time ?? "—"}</td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">{article.display_order}</td>
                  <td className="px-4 py-3 font-caption text-[11px] text-fg-tertiary">
                    {new Date(article.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-body text-[14px] text-fg-tertiary text-center py-16">
          등록된 글이 없습니다.
        </p>
      )}
    </AdminLayout>
  );
}
