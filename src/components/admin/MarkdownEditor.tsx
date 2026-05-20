"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ImagePlus,
  Link as LinkIcon,
  Quote,
  Minus,
} from "lucide-react";
import { uploadContentImage } from "@/lib/actions/admin";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
}

export default function MarkdownEditor({
  name,
  defaultValue = "",
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${before}${selected}${after}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const insertAtCursor = (text: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const newValue = value.substring(0, start) + text + value.substring(start);
    setValue(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + text.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const url = await uploadContentImage(formData);
      insertAtCursor(`\n![${file.name}](${url})\n`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "업로드 실패");
    }
    setUploading(false);
    e.target.value = "";
  };

  const tools: Array<{
    icon: typeof Bold;
    label: string;
    before: string;
    after?: string;
  }> = [
    { icon: Bold, label: "Bold", before: "**", after: "**" },
    { icon: Italic, label: "Italic", before: "*", after: "*" },
    { icon: Heading2, label: "H2", before: "\n## " },
    { icon: Heading3, label: "H3", before: "\n### " },
    { icon: List, label: "List", before: "\n- " },
    { icon: ListOrdered, label: "Numbered", before: "\n1. " },
    { icon: Quote, label: "Quote", before: "\n> " },
    { icon: Minus, label: "Divider", before: "\n---\n" },
    { icon: LinkIcon, label: "Link", before: "[", after: "](url)" },
  ];

  return (
    <div>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Toolbar */}
      <div className="flex items-center gap-1 border border-border-light border-b-0 px-2 py-1.5 bg-surface-card">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => insertText(tool.before, tool.after)}
            title={tool.label}
            className="p-1.5 text-fg-secondary hover:text-fg-primary hover:bg-white transition-colors"
          >
            <tool.icon size={15} />
          </button>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Image"
          className="p-1.5 text-fg-secondary hover:text-fg-primary hover:bg-white transition-colors disabled:opacity-50"
        >
          <ImagePlus size={15} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {uploading && (
          <span className="font-caption text-[10px] text-fg-tertiary ml-2">
            업로드 중...
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`px-2 py-1 font-caption text-[10px] font-medium tracking-[1px] transition-colors ${
              !showPreview
                ? "text-fg-primary bg-white"
                : "text-fg-tertiary hover:text-fg-primary"
            }`}
          >
            EDIT
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`px-2 py-1 font-caption text-[10px] font-medium tracking-[1px] transition-colors ${
              showPreview
                ? "text-fg-primary bg-white"
                : "text-fg-tertiary hover:text-fg-primary"
            }`}
          >
            PREVIEW
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div className="border border-border-light p-4 min-h-[400px] bg-white overflow-y-auto">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="font-body text-[13px] text-fg-tertiary">
              미리보기할 내용이 없습니다.
            </p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={16}
          className="w-full px-4 py-3 border border-border-light font-mono text-[13px] text-fg-primary focus:outline-none focus:border-fg-primary transition-colors resize-y min-h-[400px]"
          placeholder="마크다운으로 작성하세요...&#10;&#10;## 제목&#10;본문 텍스트&#10;&#10;**굵게** *이탤릭*&#10;&#10;![이미지 설명](이미지 URL)&#10;&#10;- 리스트 아이템"
        />
      )}
    </div>
  );
}
