"use client";

import { useBoardStore } from "@/store/boardStore";
import { Column } from "./Column";

export function Board() {
  const board = useBoardStore((state) => state.board);

  return (
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
  );
}
