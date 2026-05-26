"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { reportPost } from "@/lib/actions/community";

const REASONS = [
  { value: "spam", label: "SPAM", description: "스팸 또는 광고성 콘텐츠" },
  { value: "inappropriate", label: "INAPPROPRIATE", description: "부적절한 콘텐츠" },
  { value: "harassment", label: "HARASSMENT", description: "괴롭힘 또는 혐오 발언" },
  { value: "other", label: "OTHER", description: "기타 사유" },
] as const;

interface ReportModalProps {
  targetType: "post" | "board_post";
  targetId: number;
  onClose: () => void;
}

export default function ReportModal({ targetType, targetId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!reason) {
      setError("신고 사유를 선택해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await reportPost(targetType, targetId, reason, description || undefined);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "신고 접수에 실패했습니다.");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-[90vw] max-w-[400px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h3 className="font-caption text-[12px] font-medium tracking-[1.5px] text-fg-primary">
            REPORT
          </h3>
          <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-10 text-center">
            <p className="font-body text-[14px] text-fg-primary mb-2">
              신고가 접수되었습니다.
            </p>
            <p className="font-body text-[12px] text-fg-tertiary">
              관리자가 검토 후 조치하겠습니다.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-fg-primary text-surface-primary font-caption text-[11px] font-medium tracking-[1.5px] hover:opacity-80 transition-opacity"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 flex flex-col gap-4">
            {/* Reason Selection */}
            <div className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setReason(r.value); setError(""); }}
                  className={`flex flex-col gap-0.5 px-4 py-3 border text-left transition-colors ${
                    reason === r.value
                      ? "border-fg-primary bg-surface-card"
                      : "border-border-light hover:border-fg-tertiary"
                  }`}
                >
                  <span className="font-caption text-[10px] font-medium tracking-[1.5px] text-fg-primary">
                    {r.label}
                  </span>
                  <span className="font-body text-[12px] text-fg-tertiary">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Description (optional, shown when "other" selected) */}
            {reason === "other" && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상세 내용을 입력해주세요..."
                maxLength={500}
                className="w-full px-4 py-3 border border-border-light bg-surface-primary font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary resize-none h-[80px] focus:outline-none focus:border-fg-secondary"
              />
            )}

            {/* Error */}
            {error && (
              <p className="font-body text-[12px] text-red-500">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !reason}
              className="w-full py-3 bg-fg-primary text-surface-primary font-caption text-[11px] font-medium tracking-[1.5px] hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT REPORT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
