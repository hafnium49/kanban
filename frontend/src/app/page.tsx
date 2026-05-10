"use client";

import { useState } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { BoardState } from "@/types";
import { initialBoardState } from "@/data/dummy";
import Board from "@/components/Board";

export default function Home() {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setBoardState((prev) => {
      const newColumns = prev.columns.map((col) => ({ ...col, cardIds: [...col.cardIds] }));
      const sourceCol = newColumns.find((c) => c.id === source.droppableId)!;
      const destCol = newColumns.find((c) => c.id === destination.droppableId)!;

      sourceCol.cardIds.splice(source.index, 1);
      destCol.cardIds.splice(destination.index, 0, draggableId);

      return { ...prev, columns: newColumns };
    });
  };

  const addCard = (columnId: string, title: string, details: string) => {
    const id = uuidv4();
    setBoardState((prev) => ({
      ...prev,
      cards: { ...prev.cards, [id]: { id, title, details } },
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      ),
    }));
  };

  const deleteCard = (cardId: string, columnId: string) => {
    setBoardState((prev) => {
      const { [cardId]: _, ...remainingCards } = prev.cards;
      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) } : col
        ),
      };
    });
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    setBoardState((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    }));
  };

  return (
    <>
      <header className="board-header">
        <div className="board-header-dot" />
        <h1>Project Board</h1>
      </header>
      <Board
        boardState={boardState}
        onDragEnd={onDragEnd}
        onAddCard={addCard}
        onDeleteCard={deleteCard}
        onRenameColumn={renameColumn}
      />
    </>
  );
}
