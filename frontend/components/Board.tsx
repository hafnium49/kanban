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
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    // Parse the active card ID (format: "column-col-1-card-card-1")
    const activeMatch = activeId.match(/^column-([^-]+)-card-(.+)$/);
    if (!activeMatch) return;

    const fromColId = activeMatch[1];
    const cardId = activeMatch[2];

    // Parse the over ID (could be a card or column droppable area)
    const overCardMatch = overId.match(/^column-([^-]+)-card-(.+)$/);
    const overColMatch = overId.match(/^column-(.+)$/);

    let toColId: string | undefined;
    let toIndex: number;

    if (overCardMatch) {
      // Dropping onto another card
      toColId = overCardMatch[1];
      const overCardId = overCardMatch[2];
      const toColumn = board.columns.find((col) => col.id === `col-${toColId}`);
      if (!toColumn) return;
      toIndex = toColumn.cardIds.indexOf(`card-${overCardId}`) ?? 0;
    } else if (overColMatch) {
      // Dropping onto column droppable area
      toColId = overColMatch[1];
      const toColumn = board.columns.find((col) => col.id === `col-${toColId}`);
      if (!toColumn) return;
      toIndex = toColumn.cardIds.length;
    } else {
      return;
    }

    if (fromColId && cardId && toColId) {
      moveCard(`card-${cardId}`, `col-${fromColId}`, `col-${toColId}`, toIndex);
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
