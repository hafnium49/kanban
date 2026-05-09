"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoardStore } from "@/lib/store";
import { Column } from "./Column";

const ACCENTS = [
  "bg-brand-blue",
  "bg-brand-purple",
  "bg-brand-yellow",
  "bg-brand-blue",
  "bg-brand-purple",
];

export function Board() {
  const columns = useBoardStore((s) => s.columns);
  const cards = useBoardStore((s) => s.cards);
  const moveCard = useBoardStore((s) => s.moveCard);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const overData = over.data.current as
      | { type?: "card" | "column"; columnId?: string }
      | undefined;

    let toColumnId: string | undefined;
    let toIndex = 0;

    if (overData?.type === "column") {
      toColumnId = overData.columnId ?? overId;
      const col = columns.find((c) => c.id === toColumnId);
      toIndex = col ? col.cardIds.length : 0;
    } else {
      const col = columns.find((c) => c.cardIds.includes(overId));
      if (!col) return;
      toColumnId = col.id;
      toIndex = col.cardIds.indexOf(overId);
    }

    if (!toColumnId) return;
    moveCard(activeId, toColumnId, toIndex);
  };

  const activeCard = activeCardId ? cards[activeCardId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCardId(null)}
    >
      <div className="flex-1 overflow-x-auto">
        <div className="grid h-full min-h-[60vh] grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 p-4 md:p-6">
          {columns.map((column, i) => (
            <Column key={column.id} column={column} accentClass={ACCENTS[i % ACCENTS.length]} />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <div className="rounded-xl bg-white border border-[var(--color-border)] shadow-lg p-4 cursor-grabbing">
            <p className="font-semibold text-brand-navy">{activeCard.title}</p>
            {activeCard.details && (
              <p className="mt-1.5 text-sm text-brand-gray">{activeCard.details}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
