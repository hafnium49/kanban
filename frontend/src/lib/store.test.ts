import { beforeEach, describe, expect, it } from "vitest";
import { useBoardStore } from "./store";
import { createSeed } from "./seed";

const get = () => useBoardStore.getState();

describe("board store", () => {
  beforeEach(() => {
    get().reset(createSeed());
  });

  it("seeds five columns and eight cards", () => {
    expect(get().columns).toHaveLength(5);
    expect(Object.keys(get().cards)).toHaveLength(8);
  });

  describe("renameColumn", () => {
    it("renames a column by id", () => {
      get().renameColumn("col-todo", "Now");
      expect(get().columns.find((c) => c.id === "col-todo")?.title).toBe("Now");
    });

    it("trims whitespace", () => {
      get().renameColumn("col-todo", "  Sprinting  ");
      expect(get().columns.find((c) => c.id === "col-todo")?.title).toBe("Sprinting");
    });

    it("ignores empty titles", () => {
      get().renameColumn("col-todo", "   ");
      expect(get().columns.find((c) => c.id === "col-todo")?.title).toBe("To Do");
    });
  });

  describe("addCard", () => {
    it("appends a new card to the column", () => {
      get().addCard("col-backlog", "Refactor cache", "Replace LRU with TTL.");
      const column = get().columns.find((c) => c.id === "col-backlog");
      expect(column?.cardIds).toHaveLength(3);
      const newId = column!.cardIds[2];
      expect(get().cards[newId]).toMatchObject({
        title: "Refactor cache",
        details: "Replace LRU with TTL.",
      });
    });

    it("ignores blank titles", () => {
      const before = Object.keys(get().cards).length;
      get().addCard("col-backlog", "   ", "");
      expect(Object.keys(get().cards)).toHaveLength(before);
    });
  });

  describe("deleteCard", () => {
    it("removes the card from cards and its column", () => {
      get().deleteCard("c3");
      expect(get().cards.c3).toBeUndefined();
      expect(
        get().columns.find((c) => c.id === "col-todo")?.cardIds,
      ).not.toContain("c3");
    });

    it("is a no-op for unknown ids", () => {
      const snapshot = JSON.stringify({
        columns: get().columns,
        cards: get().cards,
      });
      get().deleteCard("does-not-exist");
      expect(JSON.stringify({ columns: get().columns, cards: get().cards })).toBe(snapshot);
    });
  });

  describe("moveCard", () => {
    it("reorders within the same column", () => {
      get().moveCard("c1", "col-backlog", 1);
      expect(get().columns.find((c) => c.id === "col-backlog")?.cardIds).toEqual([
        "c2",
        "c1",
      ]);
    });

    it("moves across columns at given index", () => {
      get().moveCard("c1", "col-progress", 0);
      const backlog = get().columns.find((c) => c.id === "col-backlog");
      const progress = get().columns.find((c) => c.id === "col-progress");
      expect(backlog?.cardIds).toEqual(["c2"]);
      expect(progress?.cardIds).toEqual(["c1", "c5"]);
    });

    it("clamps oversize indices to the end", () => {
      get().moveCard("c1", "col-done", 99);
      const done = get().columns.find((c) => c.id === "col-done");
      expect(done?.cardIds).toEqual(["c7", "c8", "c1"]);
    });

    it("is a no-op when moving to the same position", () => {
      const before = JSON.stringify(get().columns);
      get().moveCard("c1", "col-backlog", 0);
      expect(JSON.stringify(get().columns)).toBe(before);
    });

    it("ignores unknown columns", () => {
      const before = JSON.stringify(get().columns);
      get().moveCard("c1", "col-nope", 0);
      expect(JSON.stringify(get().columns)).toBe(before);
    });
  });
});
