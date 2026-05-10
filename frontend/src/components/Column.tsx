"use client";

import { useState, useRef, useEffect } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Card as CardType, Column as ColumnType } from "@/types";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  columnIndex: number;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
}

export default function Column({
  column,
  cards,
  columnIndex,
  onAddCard,
  onDeleteCard,
  onRenameColumn,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleTitleSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTitleSubmit();
    if (e.key === "Escape") {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="column" data-testid={`column-${column.id}`}>
      <div className="column-header">
        <div className="column-title-wrapper">
          {isEditing ? (
            <input
              ref={inputRef}
              className="column-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              data-testid={`column-title-input-${column.id}`}
            />
          ) : (
            <span
              className="column-title"
              onDoubleClick={() => setIsEditing(true)}
              data-testid={`column-title-${column.id}`}
            >
              {column.title}
            </span>
          )}
          <span className="column-count" data-testid={`column-count-${column.id}`}>
            {cards.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-cards ${snapshot.isDraggingOver ? "column--dragging-over" : ""}`}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                columnIndex={columnIndex}
                onDelete={() => onDeleteCard(card.id, column.id)}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !isAdding && (
              <div className="column-empty">No cards yet</div>
            )}
          </div>
        )}
      </Droppable>

      {isAdding ? (
        <AddCardForm
          onSave={(title, details) => {
            onAddCard(column.id, title, details);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <div className="column-footer">
          <button
            className="add-card-btn"
            onClick={() => setIsAdding(true)}
            data-testid={`add-card-btn-${column.id}`}
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
            </svg>
            Add a card
          </button>
        </div>
      )}
    </div>
  );
}
