"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Camera } from "lucide-react";
import { updateProfile } from "@/lib/actions/community";

interface EditProfileModalProps {
  profile: {
    nickname: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProfileModal({ profile, onClose, onSaved }: EditProfileModalProps) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [preview, setPreview] = useState<string | null>(profile.avatarUrl);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nickname", nickname.trim());
      formData.append("bio", bio);
      const file = fileRef.current?.files?.[0];
      if (file) formData.append("avatar", file);

      await updateProfile(formData);
      onSaved();
    } catch {
      alert("프로필 업데이트에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface-primary w-full max-w-[420px] mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="font-heading text-sm tracking-[2px] text-fg-primary">EDIT PROFILE</h2>
          <button onClick={onClose} className="text-fg-tertiary hover:text-fg-primary">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-[80px] h-[80px] rounded-full overflow-hidden bg-surface-card cursor-pointer group"
            >
              {preview ? (
                <Image src={preview} alt="Avatar" fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-heading text-[24px] text-fg-tertiary">
                  {nickname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Nickname */}
          <div className="flex flex-col gap-1.5">
            <label className="font-caption text-[10px] font-medium tracking-[1px] text-fg-tertiary">
              NICKNAME
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full font-body text-[13px] text-fg-primary bg-transparent border border-border-light px-3 py-2.5 outline-none focus:border-fg-tertiary transition-colors"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="font-caption text-[10px] font-medium tracking-[1px] text-fg-tertiary">
              BIO
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요..."
              rows={3}
              maxLength={150}
              className="w-full font-body text-[13px] text-fg-primary placeholder:text-fg-tertiary bg-transparent border border-border-light px-3 py-2.5 outline-none resize-none focus:border-fg-tertiary transition-colors"
            />
            <span className="font-caption text-[10px] text-fg-tertiary text-right">
              {bio.length}/150
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-light">
          <button
            onClick={handleSubmit}
            disabled={loading || !nickname.trim()}
            className="w-full py-3 bg-fg-primary text-fg-inverse font-caption text-[11px] font-medium tracking-[2px] disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {loading ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </div>
    </div>
  );
}
