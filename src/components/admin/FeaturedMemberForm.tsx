"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Profile } from "@/lib/types/community";

interface FeaturedMemberFormProps {
  profiles?: Profile[];
  initialData?: {
    id: number;
    user_id: string;
    interview: string;
    cover_image_url: string | null;
    tagline: string | null;
    display_order: number;
    is_active: boolean;
    profiles: Profile;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function FeaturedMemberForm({
  profiles,
  initialData,
  onSubmit,
  onDelete,
}: FeaturedMemberFormProps) {
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
      formData.set("is_active", formData.has("is_active") ? "true" : "false");
      await onSubmit(formData);
      router.push("/admin/members");
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
      router.push("/admin/members");
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

      {/* User Select */}
      {!isEdit && profiles && (
        <div>
          <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
            USER *
          </label>
          <select
            name="user_id"
            required
            className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary bg-white"
          >
            <option value="">유저를 선택하세요</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nickname} ({p.id.slice(0, 8)}...)
              </option>
            ))}
          </select>
        </div>
      )}

      {isEdit && (
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-card">
          <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden bg-border-light shrink-0">
            {initialData.profiles.avatar_url ? (
              <Image
                src={initialData.profiles.avatar_url}
                alt={initialData.profiles.nickname}
                fill
                className="object-cover"
                sizes="32px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-caption text-[11px] text-fg-tertiary">
                {initialData.profiles.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-caption text-[13px] font-medium text-fg-primary">
            {initialData.profiles.nickname}
          </span>
        </div>
      )}

      {/* Tagline */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          TAGLINE
        </label>
        <input
          name="tagline"
          type="text"
          defaultValue={initialData?.tagline ?? ""}
          className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors"
          placeholder="한줄 소개"
        />
      </div>

      {/* Interview */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          INTERVIEW
        </label>
        <textarea
          name="interview"
          defaultValue={initialData?.interview ?? ""}
          rows={10}
          className="w-full px-4 py-3 border border-border-light font-body text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors resize-y"
          placeholder="인터뷰 내용을 입력하세요..."
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-secondary mb-1.5 block">
          COVER IMAGE
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
      </div>

      {/* Options Row */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={initialData?.is_active ?? true}
            className="w-4 h-4"
          />
          <span className="font-caption text-[11px] text-fg-primary">Active</span>
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
