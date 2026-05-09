import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "./Board";
import { useBoardStore } from "@/lib/store";
import { createSeed } from "@/lib/seed";

describe("<Board />", () => {
  beforeEach(() => {
    useBoardStore.getState().reset(createSeed());
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the five seeded columns with cards", () => {
    render(<Board />);
    const columns = screen.getAllByTestId("column");
    expect(columns).toHaveLength(5);
    expect(within(columns[0]).getByText("Define Q3 roadmap")).toBeInTheDocument();
    expect(within(columns[2]).getByText("Build drag-and-drop interactions")).toBeInTheDocument();
  });

  it("renames a column inline", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const titleButtons = screen.getAllByTestId("column-title");
    await user.click(titleButtons[1]);
    const input = screen.getByLabelText("Rename column To Do") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "Now{Enter}");
    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(useBoardStore.getState().columns[1].title).toBe("Now");
  });

  it("adds a new card to a column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const addButtons = screen.getAllByTestId("add-card-button");
    await user.click(addButtons[0]);
    await user.type(screen.getByLabelText("Card title"), "Plan offsite");
    await user.type(screen.getByLabelText("Card details"), "Pick venue and date.");
    await user.click(screen.getByRole("button", { name: "Add card" }));
    expect(screen.getByText("Plan offsite")).toBeInTheDocument();
    expect(useBoardStore.getState().columns[0].cardIds).toHaveLength(3);
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const before = Object.keys(useBoardStore.getState().cards).length;
    await user.click(screen.getByLabelText("Delete card Define Q3 roadmap"));
    expect(screen.queryByText("Define Q3 roadmap")).not.toBeInTheDocument();
    expect(Object.keys(useBoardStore.getState().cards)).toHaveLength(before - 1);
  });
});
