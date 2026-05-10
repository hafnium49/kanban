import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Column from "@/components/Column";

// Mock @hello-pangea/dnd
vi.mock("@hello-pangea/dnd", () => ({
  Droppable: ({ children }: { children: (provided: unknown, snapshot: unknown) => React.ReactNode }) =>
    children(
      { innerRef: vi.fn(), droppableProps: {}, placeholder: null },
      { isDraggingOver: false }
    ),
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

const mockColumn = { id: "col-1", title: "Backlog", cardIds: ["card-1"] };
const mockCards = [{ id: "card-1", title: "Test card", details: "Details" }];

describe("Column", () => {
  it("renders column title and card count", () => {
    render(
      <Column
        column={mockColumn}
        cards={mockCards}
        columnIndex={0}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
        onRenameColumn={vi.fn()}
      />
    );
    expect(screen.getByTestId("column-title-col-1")).toHaveTextContent("Backlog");
    expect(screen.getByTestId("column-count-col-1")).toHaveTextContent("1");
  });

  it("shows add card form when button clicked", () => {
    render(
      <Column
        column={mockColumn}
        cards={mockCards}
        columnIndex={0}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
        onRenameColumn={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTestId("add-card-btn-col-1"));
    expect(screen.getByTestId("add-card-title-input")).toBeInTheDocument();
  });

  it("enters edit mode on double-click of title", () => {
    render(
      <Column
        column={mockColumn}
        cards={mockCards}
        columnIndex={0}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
        onRenameColumn={vi.fn()}
      />
    );
    fireEvent.doubleClick(screen.getByTestId("column-title-col-1"));
    expect(screen.getByTestId("column-title-input-col-1")).toBeInTheDocument();
  });

  it("calls onRenameColumn when title is edited and blurred", () => {
    const onRename = vi.fn();
    render(
      <Column
        column={mockColumn}
        cards={mockCards}
        columnIndex={0}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
        onRenameColumn={onRename}
      />
    );
    fireEvent.doubleClick(screen.getByTestId("column-title-col-1"));
    const input = screen.getByTestId("column-title-input-col-1");
    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.blur(input);
    expect(onRename).toHaveBeenCalledWith("col-1", "New Name");
  });

  it("shows empty state when no cards", () => {
    render(
      <Column
        column={{ ...mockColumn, cardIds: [] }}
        cards={[]}
        columnIndex={0}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
        onRenameColumn={vi.fn()}
      />
    );
    expect(screen.getByText("No cards yet")).toBeInTheDocument();
  });
});
