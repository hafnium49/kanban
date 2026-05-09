"use client";

import { Board } from "@/components/Board";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-sm">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-brand-navy">
              Kanban Board
            </h1>
            <span className="h-1.5 w-12 rounded-full bg-brand-yellow" />
          </div>
          <p className="mt-1 text-sm text-brand-gray">
            Drag cards between columns. Click a column title to rename.
          </p>
        </div>
      </header>
      <Board />
    </div>
  );
}
