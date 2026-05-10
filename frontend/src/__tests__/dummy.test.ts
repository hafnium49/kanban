import { describe, it, expect } from "vitest";
import { initialBoardState } from "@/data/dummy";

describe("dummy data", () => {
  it("has 5 columns", () => {
    expect(initialBoardState.columns).toHaveLength(5);
    expect(initialBoardState.columnOrder).toHaveLength(5);
  });

  it("has matching column IDs in columnOrder", () => {
    const columnIds = initialBoardState.columns.map((c) => c.id);
    expect(initialBoardState.columnOrder).toEqual(columnIds);
  });

  it("has cards referenced by columns that exist", () => {
    for (const col of initialBoardState.columns) {
      for (const cardId of col.cardIds) {
        expect(initialBoardState.cards).toHaveProperty(cardId);
      }
    }
  });

  it("has expected column titles", () => {
    const titles = initialBoardState.columns.map((c) => c.title);
    expect(titles).toEqual(["Backlog", "To Do", "In Progress", "Review", "Done"]);
  });

  it("has cards with non-empty titles", () => {
    for (const card of Object.values(initialBoardState.cards)) {
      expect(card.title.length).toBeGreaterThan(0);
    }
  });
});
