"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  index: number;
  columnIndex: number;
  onDelete: () => void;
}

export default function Card({ card, index, columnIndex, onDelete }: CardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card ${snapshot.isDragging ? "card--dragging" : ""}`}
          data-testid={`card-${card.id}`}
        >
          <div className={`card-accent card-accent--${columnIndex % 5}`} />
          <div className="card-content">
            <p className="card-title">{card.title}</p>
            {card.details && <p className="card-details">{card.details}</p>}
          </div>
          <button
            className="card-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete ${card.title}`}
            data-testid={`delete-${card.id}`}
          >
            &times;
          </button>
        </div>
      )}
    </Draggable>
  );
}
