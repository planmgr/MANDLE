"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";

export default function CreatePostButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-fg-primary text-fg-inverse flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="게시글 작성"
      >
        <Plus size={20} />
      </button>
      {open && <CreatePostDialog onClose={() => setOpen(false)} />}
    </>
  );
}
