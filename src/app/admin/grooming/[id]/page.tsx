import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { getGroomingArticleById } from "@/lib/queries/grooming";
import { updateGroomingArticle, deleteGroomingArticle } from "@/lib/actions/admin";

const CATEGORIES = ["BEARD", "SHAVING", "SKINCARE", "FITNESS", "BARBERSHOP"];

interface AdminGroomingEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminGroomingEditPage({ params }: AdminGroomingEditPageProps) {
  const { id } = await params;
  const articleId = Number(id);
  if (isNaN(articleId)) notFound();

  const article = await getGroomingArticleById(articleId);
  if (!article) notFound();

  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        EDIT GROOMING ARTICLE
      </h1>
      <ArticleForm
        type="grooming"
        categories={CATEGORIES}
        initialData={article}
        onSubmit={async (formData) => {
          "use server";
          await updateGroomingArticle(articleId, formData);
        }}
        onDelete={async () => {
          "use server";
          await deleteGroomingArticle(articleId);
        }}
      />
    </AdminLayout>
  );
}
