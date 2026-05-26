"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, ImagePlus } from "lucide-react";
import { createBoardPost } from "@/lib/actions/community";

interface CreateBoardPostDialogProps {
  onClose: () => void;
  category?: string;
}

export default function CreateBoardPostDialog({ onClose, category }: CreateBoardPostDialogProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("body", body.trim());
      if (category) formData.append("category", category);
      const file = fileRef.current?.files?.[0];
      if (file) formData.append("image", file);

      await createBoardPost(formData);
      onClose();
    } catch {
      alert("글 작성에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-full max-w-[520px] mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-heading text-sm tracking-[2px] text-fg-primary">NEW POST</h2>
          <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            maxLength={100}
            className="w-full font-body text-[15px] font-semibold text-fg-primary placeholder:text-fg-tertiary bg-transparent border border-border-light px-3 py-2.5 outline-none focus:border-fg-tertiary transition-colors"
          />

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용을 입력하세요..."
            rows={6}
            maxLength={5000}
            className="w-full font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary bg-transparent border border-border-light px-3 py-2.5 outline-none resize-none focus:border-fg-tertiary transition-colors"
          />

          {/* Image (optional) */}
          {preview ? (
            <div className="relative w-full h-[200px] bg-surface-card overflow-hidden">
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="520px" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 border border-border-light border-dashed text-fg-tertiary hover:text-fg-secondary hover:border-fg-tertiary transition-colors"
            >
              <ImagePlus size={16} />
              <span className="font-caption text-[11px] tracking-[0.5px]">이미지 첨부 (선택)</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-light">
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !body.trim()}
            className="w-full py-3 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[2px] disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {loading ? "POSTING..." : "POST"}
          </button>
        </div>
      </div>
    </div>
  );
}
