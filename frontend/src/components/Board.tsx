"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardState } from "@/types";
import Column from "./Column";

interface BoardProps {
  boardState: BoardState;
  onDragEnd: (result: DropResult) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
}

export default function Board({
  boardState,
  onDragEnd,
  onAddCard,
  onDeleteCard,
  onRenameColumn,
}: BoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board" data-testid="board">
        {boardState.columnOrder.map((columnId, columnIndex) => {
          const column = boardState.columns.find((c) => c.id === columnId)!;
          const cards = column.cardIds.map((cardId) => boardState.cards[cardId]);
          return (
            <Column
              key={column.id}
              column={column}
              cards={cards}
              columnIndex={columnIndex}
              onAddCard={onAddCard}
              onDeleteCard={onDeleteCard}
              onRenameColumn={onRenameColumn}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}
