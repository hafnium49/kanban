"use client";

import { useState } from "react";
import { Column as ColumnType } from "@/types";
import { useBoardStore } from "@/store/boardStore";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card } from "./Card";
import { Plus, Edit2, Check, X } from "lucide-react";

interface ColumnProps {
  column: ColumnType;
  cards: Record<string, any>;
}

export function Column({ column, cards }: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDetails, setCardDetails] = useState("");

  const addCard = useBoardStore((state) => state.addCard);
  const renameColumn = useBoardStore((state) => state.renameColumn);
  const { setNodeRef } = useDroppable({ id: `column-${column.id}` });

  const handleSaveTitle = () => {
    if (newTitle.trim()) {
      renameColumn(column.id, newTitle.trim());
      setIsEditingTitle(false);
    }
  };

  const handleAddCard = () => {
    if (cardTitle.trim()) {
      addCard(column.id, cardTitle.trim(), cardDetails.trim());
      setCardTitle("");
      setCardDetails("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-screen flex flex-col gap-3 w-80 flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {isEditingTitle ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-2 py-1 border border-primary-blue rounded text-dark-navy font-semibold"
              autoFocus
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-primary-blue hover:bg-blue-50 rounded"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setNewTitle(column.title);
                setIsEditingTitle(false);
              }}
              className="p-1 text-text-gray hover:bg-gray-200 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-bold text-dark-navy text-lg">{column.title}</h2>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="p-1 text-text-gray hover:text-primary-blue opacity-0 hover:opacity-100 transition-opacity"
            >
              <Edit2 size={16} />
            </button>
          </>
        )}
      </div>

      {/* Card Count */}
      <div className="text-xs text-text-gray mb-2">
        {column.cardIds.length} card{column.cardIds.length !== 1 ? "s" : ""}
      </div>

      {/* Cards List */}
      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-2 flex-1 min-h-12">
          {column.cardIds.map((cardId) => (
            <Card key={cardId} card={cards[cardId]} columnId={column.id} />
          ))}
        </div>
      </SortableContext>

      {/* Add Card Form */}
      {isAddingCard ? (
        <div className="bg-white border border-primary-blue rounded p-3 space-y-2">
          <input
            type="text"
            placeholder="Card title..."
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            autoFocus
          />
          <textarea
            placeholder="Details (optional)..."
            value={cardDetails}
            onChange={(e) => setCardDetails(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="flex-1 px-3 py-1 bg-secondary-purple text-white text-sm rounded hover:bg-opacity-90 font-medium"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setCardTitle("");
                setCardDetails("");
              }}
              className="flex-1 px-3 py-1 bg-gray-300 text-dark-navy text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full px-3 py-2 border-2 border-dashed border-accent-yellow text-accent-yellow rounded hover:bg-yellow-50 flex items-center justify-center gap-2 font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Add Card
        </button>
      )}
    </div>
  );
}
