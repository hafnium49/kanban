"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Card as CardType } from "@/lib/types";
import { useBoardStore } from "@/lib/store";

type Props = {
  card: CardType;
  columnId: string;
};

export function Card({ card, columnId }: Props) {
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      data: { type: "card", columnId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-testid="card"
      data-card-id={card.id}
      className={`group relative rounded-xl bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag card ${card.title}`}
        className="block w-full text-left p-4 cursor-grab active:cursor-grabbing"
      >
        <p className="font-semibold text-brand-navy leading-snug pr-6">{card.title}</p>
        {card.details && (
          <p className="mt-1.5 text-sm text-brand-gray leading-relaxed whitespace-pre-wrap">
            {card.details}
          </p>
        )}
      </button>
      <button
        type="button"
        onClick={() => deleteCard(card.id)}
        aria-label={`Delete card ${card.title}`}
        className="absolute top-2.5 right-2.5 rounded-md p-1.5 text-brand-gray opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
