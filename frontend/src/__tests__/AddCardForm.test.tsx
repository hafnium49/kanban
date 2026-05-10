import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddCardForm from "@/components/AddCardForm";

describe("AddCardForm", () => {
  it("renders title input and details textarea", () => {
    render(<AddCardForm onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByTestId("add-card-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-card-details-input")).toBeInTheDocument();
  });

  it("calls onSave with title and details on submit", () => {
    const onSave = vi.fn();
    render(<AddCardForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByTestId("add-card-title-input"), {
      target: { value: "New task" },
    });
    fireEvent.change(screen.getByTestId("add-card-details-input"), {
      target: { value: "Some details" },
    });
    fireEvent.click(screen.getByTestId("add-card-save"));

    expect(onSave).toHaveBeenCalledWith("New task", "Some details");
  });

  it("does not call onSave with empty title", () => {
    const onSave = vi.fn();
    render(<AddCardForm onSave={onSave} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId("add-card-save"));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();
    render(<AddCardForm onSave={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByTestId("add-card-cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("auto-focuses the title input", () => {
    render(<AddCardForm onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByTestId("add-card-title-input")).toHaveFocus();
  });
});
