import AdminLayout from "@/components/admin/AdminLayout";
import ArticleForm from "@/components/admin/ArticleForm";
import { createStyleArticle } from "@/lib/actions/admin";

const CATEGORIES = ["MINIMAL", "STREET", "GENTLEMAN", "BUSINESS", "FITNESS", "BEARD", "GLASSES", "FRAGRANCE"];

export default function AdminStyleNewPage() {
  return (
    <AdminLayout>
      <h1 className="font-heading text-[24px] tracking-[2px] text-fg-primary mb-6">
        NEW STYLE ARTICLE
      </h1>
      <ArticleForm
        type="style"
        categories={CATEGORIES}
        onSubmit={async (formData) => {
          "use server";
          await createStyleArticle(formData);
        }}
      />
    </AdminLayout>
  );
}
