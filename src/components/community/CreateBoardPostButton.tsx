"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateBoardPostDialog from "./CreateBoardPostDialog";

export default function CreateBoardPostButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 w-12 h-12 bg-fg-primary text-fg-inverse flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="글 작성"
      >
        <Plus size={20} />
      </button>
      {open && <CreateBoardPostDialog onClose={() => setOpen(false)} />}
    </>
  );
}
