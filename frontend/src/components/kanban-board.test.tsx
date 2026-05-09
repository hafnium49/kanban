import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { KanbanBoard } from "./kanban-board";

describe("KanbanBoard", () => {
  it("renders the five-column board with dummy data", () => {
    render(<KanbanBoard />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Kanban Project Manager",
    );
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByText("Shape project brief")).toBeInTheDocument();
  });

  it("renames a column", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const ideasColumn = screen.getByTestId("column-ideas");
    const input = within(ideasColumn).getByDisplayValue("Ideas");

    await user.clear(input);
    await user.type(input, "Backlog");

    expect(input).toHaveValue("Backlog");
  });

  it("adds and deletes a card", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const ideasColumn = screen.getByTestId("column-ideas");
    await user.click(
      within(ideasColumn).getByRole("button", { name: "Add card to Ideas" }),
    );
    await user.type(within(ideasColumn).getByLabelText("Card title"), "Ship UI");
    await user.type(
      within(ideasColumn).getByLabelText("Card details"),
      "Prepare the board for review.",
    );
    await user.click(within(ideasColumn).getByRole("button", { name: "Add" }));

    expect(screen.getByText("Ship UI")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Ship UI" }));

    expect(screen.queryByText("Ship UI")).not.toBeInTheDocument();
  });
});
