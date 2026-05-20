import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { createGroomingArticle } from "@/lib/actions/admin";

const CATEGORIES = ["BEARD", "SHAVING", "SKINCARE", "FITNESS", "BARBERSHOP"];

export default function AdminGroomingNewPage() {
  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        NEW GROOMING ARTICLE
      </h1>
      <ArticleForm
        type="grooming"
        categories={CATEGORIES}
        onSubmit={async (formData) => {
          "use server";
          await createGroomingArticle(formData);
        }}
      />
    </AdminLayout>
  );
}
