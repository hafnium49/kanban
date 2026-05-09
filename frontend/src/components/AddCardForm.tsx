"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "@/lib/store";

type Props = {
  columnId: string;
  onClose: () => void;
};

export function AddCardForm({ columnId, onClose }: Props) {
  const addCard = useBoardStore((s) => s.addCard);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCard(columnId, title, details);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      className="rounded-xl bg-white border border-[var(--color-border)] shadow-sm p-3 space-y-2"
      data-testid="add-card-form"
    >
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        aria-label="Card title"
        className="w-full text-sm font-semibold text-brand-navy placeholder:text-brand-gray bg-transparent outline-none"
      />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Add details (optional)"
        aria-label="Card details"
        rows={2}
        className="w-full text-sm text-brand-navy placeholder:text-brand-gray bg-transparent outline-none resize-none"
      />
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          className="rounded-md bg-brand-purple px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          disabled={!title.trim()}
        >
          Add card
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
