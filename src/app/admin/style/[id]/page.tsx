import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { getStyleArticleById } from "@/lib/queries/style";
import { updateStyleArticle, deleteStyleArticle } from "@/lib/actions/admin";

const CATEGORIES = ["MINIMAL", "STREET", "GENTLEMAN", "BUSINESS", "FITNESS", "BEARD", "GLASSES", "FRAGRANCE"];

interface AdminStyleEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminStyleEditPage({ params }: AdminStyleEditPageProps) {
  const { id } = await params;
  const articleId = Number(id);
  if (isNaN(articleId)) notFound();

  const article = await getStyleArticleById(articleId);
  if (!article) notFound();

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        EDIT STYLE ARTICLE
      </h1>
      <ArticleForm
        type="style"
        categories={CATEGORIES}
        initialData={article}
        onSubmit={async (formData) => {
          "use server";
          await updateStyleArticle(articleId, formData);
        }}
        onDelete={async () => {
          "use server";
          await deleteStyleArticle(articleId);
        }}
      />
    </AdminLayout>
  );
}
