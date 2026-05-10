import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

// Mock @hello-pangea/dnd
vi.mock("@hello-pangea/dnd", () => ({
  Draggable: ({ children }: { children: (provided: unknown, snapshot: unknown) => React.ReactNode }) =>
    children(
      {
        innerRef: vi.fn(),
        draggableProps: { "data-rfd-draggable-context-id": "0", "data-rfd-draggable-id": "test" },
        dragHandleProps: { "data-rfd-drag-handle-draggable-id": "test" },
      },
      { isDragging: false }
    ),
}));

const mockCard = { id: "card-1", title: "Test card", details: "Test details" };

describe("Card", () => {
  it("renders card title and details", () => {
    render(<Card card={mockCard} index={0} columnIndex={0} onDelete={vi.fn()} />);
    expect(screen.getByText("Test card")).toBeInTheDocument();
    expect(screen.getByText("Test details")).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", () => {
    const onDelete = vi.fn();
    render(<Card card={mockCard} index={0} columnIndex={0} onDelete={onDelete} />);
    screen.getByTestId("delete-card-1").click();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("renders without details when details is empty", () => {
    const card = { id: "card-2", title: "No details", details: "" };
    render(<Card card={card} index={0} columnIndex={0} onDelete={vi.fn()} />);
    expect(screen.getByText("No details")).toBeInTheDocument();
    expect(screen.queryByText("card-details")).not.toBeInTheDocument();
  });
});
