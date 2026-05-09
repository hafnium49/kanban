"use client";

import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Column as ColumnType } from "@/lib/types";
import { useBoardStore } from "@/lib/store";
import { Card } from "./Card";
import { AddCardForm } from "./AddCardForm";

type Props = {
  column: ColumnType;
  accentClass: string;
};

export function Column({ column, accentClass }: Props) {
  const cardsMap = useBoardStore((s) => s.cards);
  const cards = column.cardIds.map((id) => cardsMap[id]).filter(Boolean);
  const renameColumn = useBoardStore((s) => s.renameColumn);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(column.title);
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraftTitle(column.title);
    setEditing(true);
  };

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  const commitRename = () => {
    renameColumn(column.id, draftTitle);
    setEditing(false);
  };

  return (
    <section
      data-testid="column"
      data-column-id={column.id}
      className="flex h-full min-h-0 w-full min-w-[260px] flex-col rounded-2xl bg-white/70 border border-[var(--color-border)] shadow-sm backdrop-blur-sm"
    >
      <header className="flex items-center gap-2 px-4 pt-4 pb-2">
        <span className={`h-6 w-1.5 rounded-full ${accentClass}`} />
        {editing ? (
          <input
            ref={inputRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setDraftTitle(column.title);
                setEditing(false);
              }
            }}
            aria-label={`Rename column ${column.title}`}
            className="flex-1 bg-transparent text-sm font-semibold uppercase tracking-wider text-brand-navy outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            aria-label={`Rename column ${column.title}`}
            data-testid="column-title"
            className="flex-1 text-left text-sm font-semibold uppercase tracking-wider text-brand-navy hover:text-brand-blue transition"
          >
            {column.title}
          </button>
        )}
        <span className="text-xs font-medium text-brand-gray tabular-nums">
          {cards.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[80px] overflow-y-auto px-3 pb-3 transition-colors ${
          isOver ? "bg-brand-yellow/5" : ""
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {cards.map((card) => (
              <Card key={card.id} card={card} columnId={column.id} />
            ))}
          </ul>
        </SortableContext>

        <div className="mt-2">
          {adding ? (
            <AddCardForm columnId={column.id} onClose={() => setAdding(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              data-testid="add-card-button"
              className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-brand-gray hover:text-brand-purple hover:bg-brand-purple/5 transition"
            >
              <Plus className="size-4" /> Add card
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
