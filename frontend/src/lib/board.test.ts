import { describe, expect, it } from "vitest";

import {
  addCard,
  deleteCard,
  initialBoard,
  moveCard,
  renameColumn,
  type BoardState,
} from "./board";

function cloneBoard(): BoardState {
  return structuredClone(initialBoard);
}

describe("board state", () => {
  it("adds a card to the requested column", () => {
    const board = addCard(cloneBoard(), "ideas", {
      id: "card-new",
      title: "New work",
      details: "A small task",
    });

    expect(board.cards["card-new"]).toEqual({
      id: "card-new",
      title: "New work",
      details: "A small task",
    });
    expect(board.columns[0].cardIds.at(-1)).toBe("card-new");
  });

  it("deletes a card from the card map and every column", () => {
    const board = deleteCard(cloneBoard(), "card-ui");

    expect(board.cards["card-ui"]).toBeUndefined();
    expect(board.columns.flatMap((column) => column.cardIds)).not.toContain(
      "card-ui",
    );
  });

  it("renames a single column", () => {
    const board = renameColumn(cloneBoard(), "active", "Doing");

    expect(board.columns.find((column) => column.id === "active")?.title).toBe(
      "Doing",
    );
    expect(board.columns.find((column) => column.id === "ideas")?.title).toBe(
      "Ideas",
    );
  });

  it("moves a card into another column before a target card", () => {
    const board = moveCard(cloneBoard(), "card-ui", "ready", "card-copy");
    const readyColumn = board.columns.find((column) => column.id === "ready");
    const activeColumn = board.columns.find((column) => column.id === "active");

    expect(readyColumn?.cardIds).toEqual([
      "card-flows",
      "card-ui",
      "card-copy",
    ]);
    expect(activeColumn?.cardIds).toEqual(["card-drag"]);
  });

  it("appends a card when dropped on a column", () => {
    const board = moveCard(cloneBoard(), "card-brief", "done");
    const doneColumn = board.columns.find((column) => column.id === "done");

    expect(doneColumn?.cardIds).toEqual(["card-kickoff", "card-brief"]);
  });
});
