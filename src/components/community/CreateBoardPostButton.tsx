"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateBoardPostDialog from "./CreateBoardPostDialog";

export default function CreateBoardPostButton({ category }: { category?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 rounded-full bg-fg-primary text-fg-inverse flex items-center justify-center shadow-xl hover:scale-105 hover:opacity-90 transition-all"
        aria-label="글 작성"
      >
        <Plus size={20} />
      </button>
      {open && <CreateBoardPostDialog onClose={() => setOpen(false)} category={category} />}
    </>
  );
}
