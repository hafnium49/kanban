"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/boardStore";
import { Column } from "./Column";

export function Board() {
  const board = useBoardStore((state) => state.board);
  const moveCard = useBoardStore((state) => state.moveCard);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    console.log("Drag ended:", { activeId, overId });

    if (activeId === overId) return;

    // Parse the active card ID (format: "column-col-1-card-card-1")
    const activeMatch = activeId.match(/^column-(.+)-card-(.+)$/);
    if (!activeMatch) {
      console.log("Active match failed");
      return;
    }

    const fromColId = activeMatch[1];
    const cardId = activeMatch[2];

    console.log("From:", { fromColId, cardId });

    // Parse the over ID (could be a card or column droppable area)
    // format: "column-col-1" or "column-col-1-card-card-1"
    const overCardMatch = overId.match(/^column-(.+)-card-(.+)$/);
    const overColMatch = overId.match(/^column-([a-z]+-\d+)$/);

    let toColId: string | undefined;
    let toIndex: number;

    if (overCardMatch) {
      // Dropping onto another card
      toColId = overCardMatch[1];
      const overCardId = overCardMatch[2];
      const toColumn = board.columns.find((col) => col.id === toColId);
      if (!toColumn) return;
      toIndex = toColumn.cardIds.indexOf(`card-${overCardId}`) ?? 0;
      console.log("Dropped on card:", { toColId, overCardId, toIndex });
    } else if (overColMatch) {
      // Dropping onto column droppable area
      toColId = overColMatch[1];
      const toColumn = board.columns.find((col) => col.id === toColId);
      if (!toColumn) {
        console.log("Column not found:", toColId);
        return;
      }
      toIndex = toColumn.cardIds.length;
      console.log("Dropped on column:", { toColId, toIndex });
    } else {
      console.log("Over match failed");
      return;
    }

    if (fromColId && cardId && toColId) {
      console.log("Moving card:", { cardId, fromColId, toColId, toIndex });
      moveCard(`card-${cardId}`, fromColId, toColId, toIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-navy mb-2">My Kanban Board</h1>
          <p className="text-text-gray">Organize and track your project tasks</p>
        </div>

        {/* Columns Container */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={board.cards}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
