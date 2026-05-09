"use client";

import { Card as CardType } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { Trash2 } from "lucide-react";

interface CardProps {
  card: CardType;
  isDragging?: boolean;
}

export function Card({ card, isDragging }: CardProps) {
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const handleDelete = () => {
    if (confirm(`Delete "${card.title}"?`)) {
      deleteCard(card.id);
    }
  };

  return (
    <div
      className={`bg-white border-l-4 border-accent-yellow p-4 rounded shadow-sm hover:shadow-md transition-shadow cursor-move group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-dark-navy text-sm mb-1">
            {card.title}
          </h4>
          <p className="text-text-gray text-xs">{card.details}</p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-text-gray hover:text-secondary-purple p-1"
          aria-label="Delete card"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
