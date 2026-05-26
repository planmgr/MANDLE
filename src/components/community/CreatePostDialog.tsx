"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, ImagePlus } from "lucide-react";
import { createPost } from "@/lib/actions/community";

interface CreatePostDialogProps {
  onClose: () => void;
}

export default function CreatePostDialog({ onClose }: CreatePostDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      await createPost(formData);
      onClose();
    } catch {
      alert("게시글 작성에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-full max-w-[480px] mx-4 flex flex-col max-h-[90vh]"
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
          {/* Image Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-full h-[300px] bg-surface-card flex items-center justify-center cursor-pointer overflow-hidden border border-border-light border-dashed hover:border-fg-tertiary transition-colors"
          >
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="480px" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-fg-tertiary">
                <ImagePlus size={32} />
                <span className="font-caption text-[11px] tracking-[1px]">SELECT IMAGE</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="캡션을 입력하세요... #태그를 추가할 수 있습니다"
            rows={3}
            maxLength={2000}
            className="w-full font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary bg-transparent border border-border-light px-3 py-2.5 outline-none resize-none focus:border-fg-tertiary transition-colors"
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-light">
          <button
            onClick={handleSubmit}
            disabled={loading || !preview}
            className="w-full py-3 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[2px] disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {loading ? "POSTING..." : "POST"}
          </button>
        </div>
      </div>
    </div>
  );
}
