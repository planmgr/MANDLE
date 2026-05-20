"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

interface ArticleFormProps {
  type: "style" | "grooming";
  categories: string[];
  initialData?: {
    id: number;
    title: string;
    summary: string | null;
    body: string;
    cover_image_url: string;
    category: string;
    is_featured: boolean;
    display_order: number;
    read_time?: string | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ArticleForm({
  type,
  categories,
  initialData,
  onSubmit,
  onDelete,
}: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.cover_image_url ?? null);

  const isEdit = !!initialData;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("is_featured", formData.has("is_featured") ? "true" : "false");
      await onSubmit(formData);
      router.push(`/admin/${type}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await onDelete?.();
      router.push(`/admin/${type}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[720px] flex flex-col gap-5">
      {error && (
        <p className="font-body text-[13px] text-red-500 bg-red-50 px-4 py-3">
          {error}
        </p>
      )}

      {/* Title */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          TITLE *
        </label>
        <input
          name="title"
          type="text"
          defaultValue={initialData?.title}
          required
          className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          CATEGORY *
        </label>
        <select
          name="category"
          defaultValue={initialData?.category}
          required
          className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary bg-white"
        >
          <option value="">선택하세요</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          SUMMARY
        </label>
        <input
          name="summary"
          type="text"
          defaultValue={initialData?.summary ?? ""}
          className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors"
          placeholder="한 줄 요약"
        />
      </div>

      {/* Body (Markdown) */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          BODY (MARKDOWN)
        </label>
        <MarkdownEditor name="body" defaultValue={initialData?.body ?? ""} />
      </div>

      {/* Cover Image */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          COVER IMAGE {!isEdit && "*"}
        </label>
        {preview && (
          <div className="relative w-full h-[200px] mb-3 bg-surface-card overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" sizes="720px" />
          </div>
        )}
        <input
          name="cover_image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full font-body text-[13px] text-fg-secondary"
        />
        {isEdit && (
          <input type="hidden" name="cover_image_url" value={initialData?.cover_image_url ?? ""} />
        )}
      </div>

      {/* Read Time (grooming only) */}
      {type === "grooming" && (
        <div>
          <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
            READ TIME
          </label>
          <input
            name="read_time"
            type="text"
            defaultValue={initialData?.read_time ?? ""}
            className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors"
            placeholder="예: 5 min read"
          />
        </div>
      )}

      {/* Options Row */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={initialData?.is_featured ?? false}
            className="w-4 h-4"
          />
          <span className="font-caption text-[11px] text-fg-primary">Featured</span>
        </label>
        <div className="flex items-center gap-2">
          <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary">
            ORDER
          </label>
          <input
            name="display_order"
            type="number"
            defaultValue={initialData?.display_order ?? 0}
            className="w-16 px-2 py-1.5 border border-border-light font-body text-[13px] text-fg-primary text-center focus:outline-none focus:border-fg-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-light">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[1.5px] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "저장 중..." : isEdit ? "UPDATE" : "CREATE"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-border-light font-caption text-[11px] font-medium tracking-[1.5px] text-fg-secondary hover:text-fg-primary transition-colors"
        >
          CANCEL
        </button>
        {isEdit && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto px-4 py-2.5 font-caption text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            DELETE
          </button>
        )}
      </div>
    </form>
  );
}
