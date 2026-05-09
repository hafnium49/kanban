import { create } from "zustand";
import type { BoardSnapshot, Card, Column } from "./types";
import { createSeed } from "./seed";

let cardCounter = 0;

function nextCardId(): string {
  cardCounter += 1;
  return `card-${Date.now()}-${cardCounter}`;
}

export type BoardState = {
  columns: Column[];
  cards: Record<string, Card>;
  renameColumn: (columnId: string, title: string) => void;
  addCard: (columnId: string, title: string, details: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, toColumnId: string, toIndex: number) => void;
  reset: (snapshot?: BoardSnapshot) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  ...createSeed(),

  renameColumn: (columnId, title) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return state;
      return {
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, title: trimmed } : col,
        ),
      };
    }),

  addCard: (columnId, title, details) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return state;
      const id = nextCardId();
      const card: Card = { id, title: trimmed, details: details.trim() };
      return {
        cards: { ...state.cards, [id]: card },
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col,
        ),
      };
    }),

  deleteCard: (cardId) =>
    set((state) => {
      if (!state.cards[cardId]) return state;
      const nextCards = { ...state.cards };
      delete nextCards[cardId];
      return {
        cards: nextCards,
        columns: state.columns.map((col) =>
          col.cardIds.includes(cardId)
            ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
            : col,
        ),
      };
    }),

  moveCard: (cardId, toColumnId, toIndex) =>
    set((state) => {
      const fromColumn = state.columns.find((col) => col.cardIds.includes(cardId));
      const toColumn = state.columns.find((col) => col.id === toColumnId);
      if (!fromColumn || !toColumn) return state;

      const sameColumn = fromColumn.id === toColumn.id;
      const fromIndex = fromColumn.cardIds.indexOf(cardId);

      const columns = state.columns.map((col) => {
        if (sameColumn && col.id === fromColumn.id) {
          const next = col.cardIds.filter((id) => id !== cardId);
          const clamped = Math.max(0, Math.min(toIndex, next.length));
          next.splice(clamped, 0, cardId);
          return { ...col, cardIds: next };
        }
        if (col.id === fromColumn.id) {
          return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        }
        if (col.id === toColumn.id) {
          const next = [...col.cardIds];
          const clamped = Math.max(0, Math.min(toIndex, next.length));
          next.splice(clamped, 0, cardId);
          return { ...col, cardIds: next };
        }
        return col;
      });

      if (sameColumn && fromIndex === Math.max(0, Math.min(toIndex, fromColumn.cardIds.length - 1))) {
        return state;
      }

      return { columns };
    }),

  reset: (snapshot) => set(() => snapshot ?? createSeed()),
}));
