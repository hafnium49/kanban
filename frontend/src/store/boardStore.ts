import { create } from "zustand";
import { Board, Card, Column } from "@/types";
import { createDummyBoard } from "@/data/dummy";

interface BoardStore {
  board: Board;
  addCard: (columnId: string, title: string, details: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  renameColumn: (columnId: string, newTitle: string) => void;
  reset: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: createDummyBoard(),

  addCard: (columnId: string, title: string, details: string) => {
    set((state) => {
      const newCardId = `card-${Date.now()}`;
      const newCard: Card = { id: newCardId, title, details };
      const newBoard = { ...state.board };
      newBoard.cards[newCardId] = newCard;
      const column = newBoard.columns.find((col) => col.id === columnId);
      if (column) {
        column.cardIds.push(newCardId);
      }
      return { board: newBoard };
    });
  },

  deleteCard: (cardId: string) => {
    set((state) => {
      const newBoard = { ...state.board };
      delete newBoard.cards[cardId];
      newBoard.columns.forEach((col) => {
        col.cardIds = col.cardIds.filter((id) => id !== cardId);
      });
      return { board: newBoard };
    });
  },

  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    set((state) => {
      const newBoard = { ...state.board };
      const fromColumn = newBoard.columns.find((col) => col.id === fromColumnId);
      const toColumn = newBoard.columns.find((col) => col.id === toColumnId);

      if (fromColumn && toColumn) {
        fromColumn.cardIds = fromColumn.cardIds.filter((id) => id !== cardId);
        toColumn.cardIds.splice(toIndex, 0, cardId);
      }
      return { board: newBoard };
    });
  },

  renameColumn: (columnId: string, newTitle: string) => {
    set((state) => {
      const newBoard = { ...state.board };
      const column = newBoard.columns.find((col) => col.id === columnId);
      if (column) {
        column.title = newTitle;
      }
      return { board: newBoard };
    });
  },

  reset: () => {
    set(() => ({ board: createDummyBoard() }));
  },
}));
