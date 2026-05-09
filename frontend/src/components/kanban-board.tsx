"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, type HTMLAttributes, useMemo, useState } from "react";

import {
  addCard,
  deleteCard,
  getCardColumnId,
  initialBoard,
  moveCard,
  renameColumn,
  type BoardState,
  type CardId,
  type ColumnId,
  type KanbanCard,
  type KanbanColumn,
} from "@/lib/board";

type DragData =
  | {
      type: "card";
      cardId: CardId;
      columnId: ColumnId;
    }
  | {
      type: "column";
      columnId: ColumnId;
    };

type CardForm = {
  title: string;
  details: string;
};

const emptyForm: CardForm = {
  title: "",
  details: "",
};

function createCardId() {
  return `card-${crypto.randomUUID()}`;
}

export function KanbanBoard() {
  const [board, setBoard] = useState<BoardState>(initialBoard);
  const [activeCardId, setActiveCardId] = useState<CardId | null>(null);
  const [openFormColumnId, setOpenFormColumnId] = useState<ColumnId | null>(null);
  const [forms, setForms] = useState<Record<ColumnId, CardForm>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeCard = activeCardId ? board.cards[activeCardId] : null;

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DragData | undefined;
    if (data?.type === "card") {
      setActiveCardId(data.cardId);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeData = event.active.data.current as DragData | undefined;
    const overData = event.over?.data.current as DragData | undefined;

    setActiveCardId(null);

    if (!event.over || activeData?.type !== "card" || !overData) {
      return;
    }

    const overCardId = overData.type === "card" ? overData.cardId : undefined;

    setBoard((currentBoard) =>
      moveCard(currentBoard, activeData.cardId, overData.columnId, overCardId),
    );
  }

  function handleColumnTitleChange(columnId: ColumnId, title: string) {
    setBoard((currentBoard) => renameColumn(currentBoard, columnId, title));
  }

  function handleFormChange(
    columnId: ColumnId,
    field: keyof CardForm,
    value: string,
  ) {
    setForms((currentForms) => ({
      ...currentForms,
      [columnId]: {
        ...emptyForm,
        ...currentForms[columnId],
        [field]: value,
      },
    }));
  }

  function handleAddCard(columnId: ColumnId, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = forms[columnId] ?? emptyForm;
    const title = form.title.trim();
    const details = form.details.trim();

    if (!title || !details) {
      return;
    }

    setBoard((currentBoard) =>
      addCard(currentBoard, columnId, {
        id: createCardId(),
        title,
        details,
      }),
    );
    setForms((currentForms) => ({
      ...currentForms,
      [columnId]: emptyForm,
    }));
    setOpenFormColumnId(null);
  }

  function handleDeleteCard(cardId: CardId) {
    setBoard((currentBoard) => deleteCard(currentBoard, cardId));
  }

  const cardCount = useMemo(() => Object.keys(board.cards).length, [board.cards]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-blue-primary">
                Single board
              </p>
              <h1 className="text-3xl font-semibold tracking-normal text-dark-navy sm:text-4xl">
                Kanban Project Manager
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <Metric label="Columns" value={board.columns.length.toString()} />
              <Metric label="Cards" value={cardCount.toString()} />
            </div>
          </div>
        </div>
      </header>

      <DndContext
        id="kanban-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section
          aria-label="Kanban board"
          className="flex-1 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid w-max min-w-full max-w-[1600px] grid-cols-[repeat(5,minmax(17.5rem,1fr))] gap-4">
            {board.columns.map((column) => (
              <KanbanColumnView
                key={column.id}
                board={board}
                column={column}
                form={forms[column.id] ?? emptyForm}
                isFormOpen={openFormColumnId === column.id}
                onAddCard={handleAddCard}
                onCloseForm={() => setOpenFormColumnId(null)}
                onDeleteCard={handleDeleteCard}
                onFormChange={handleFormChange}
                onOpenForm={() => setOpenFormColumnId(column.id)}
                onTitleChange={handleColumnTitleChange}
              />
            ))}
          </div>
        </section>

        <DragOverlay>
          {activeCard ? (
            <CardShell card={activeCard} dragOverlay onDeleteCard={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-[#f9fbfd] px-4 py-3">
      <p className="text-xs font-medium text-gray-text">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-dark-navy">{value}</p>
    </div>
  );
}

function KanbanColumnView({
  board,
  column,
  form,
  isFormOpen,
  onAddCard,
  onCloseForm,
  onDeleteCard,
  onFormChange,
  onOpenForm,
  onTitleChange,
}: {
  board: BoardState;
  column: KanbanColumn;
  form: CardForm;
  isFormOpen: boolean;
  onAddCard: (columnId: ColumnId, event: FormEvent<HTMLFormElement>) => void;
  onCloseForm: () => void;
  onDeleteCard: (cardId: CardId) => void;
  onFormChange: (
    columnId: ColumnId,
    field: keyof CardForm,
    value: string,
  ) => void;
  onOpenForm: () => void;
  onTitleChange: (columnId: ColumnId, title: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    } satisfies DragData,
  });

  return (
    <article
      ref={setNodeRef}
      aria-label={`${column.title} column`}
      className="flex min-h-[calc(100vh-13.5rem)] flex-col rounded-lg border border-line bg-[#eef3f8] shadow-[0_18px_50px_rgba(3,33,71,0.08)]"
      data-column-id={column.id}
      data-testid={`column-${column.id}`}
    >
      <div
        className="h-1.5 rounded-t-lg"
        style={{
          background:
            column.id === "done"
              ? "var(--blue-primary)"
              : column.id === "active"
                ? "var(--purple-secondary)"
                : "var(--accent-yellow)",
        }}
      />
      <div className="border-b border-line bg-white px-3 py-3">
        <label className="sr-only" htmlFor={`${column.id}-input`}>
          Rename {column.title} column
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${column.id}-input`}
            aria-describedby={`${column.id}-count`}
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-base font-semibold text-dark-navy outline-none transition focus:border-blue-primary focus:bg-white"
            value={column.title}
            onChange={(event) => onTitleChange(column.id, event.target.value)}
          />
          <span
            id={`${column.id}-count`}
            className="rounded-md bg-[#f4f7fb] px-2 py-1 text-xs font-semibold text-gray-text"
          >
            {column.cardIds.length}
          </span>
        </div>
      </div>

      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={[
            "flex flex-1 flex-col gap-3 p-3 transition-colors",
            isOver ? "bg-[#e5f4fb]" : "",
          ].join(" ")}
        >
          {column.cardIds.map((cardId) => (
            <SortableKanbanCard
              key={cardId}
              card={board.cards[cardId]}
              columnId={getCardColumnId(board, cardId) ?? column.id}
              onDeleteCard={onDeleteCard}
            />
          ))}

          {isFormOpen ? (
            <form
              className="rounded-lg border border-dashed border-blue-primary bg-white p-3 shadow-sm"
              onSubmit={(event) => onAddCard(column.id, event)}
            >
              <label className="sr-only" htmlFor={`${column.id}-card-title`}>
                Card title
              </label>
              <input
                id={`${column.id}-card-title`}
                className="mb-2 w-full rounded-md border border-line px-3 py-2 text-sm text-dark-navy outline-none transition placeholder:text-gray-text focus:border-blue-primary"
                placeholder="Card title"
                value={form.title}
                onChange={(event) =>
                  onFormChange(column.id, "title", event.target.value)
                }
              />
              <label className="sr-only" htmlFor={`${column.id}-card-details`}>
                Card details
              </label>
              <textarea
                id={`${column.id}-card-details`}
                className="min-h-24 w-full resize-none rounded-md border border-line px-3 py-2 text-sm text-dark-navy outline-none transition placeholder:text-gray-text focus:border-blue-primary"
                placeholder="Details"
                value={form.details}
                onChange={(event) =>
                  onFormChange(column.id, "details", event.target.value)
                }
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-purple-secondary px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#65317d]"
                  type="submit"
                >
                  <Plus aria-hidden="true" size={16} />
                  Add
                </button>
                <button
                  aria-label={`Cancel card for ${column.title}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-gray-text transition hover:border-gray-text hover:text-dark-navy"
                  type="button"
                  onClick={onCloseForm}
                >
                  <X aria-hidden="true" size={16} />
                </button>
              </div>
            </form>
          ) : (
            <button
              aria-label={`Add card to ${column.title}`}
              className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-[#b8c7d6] bg-white/75 px-3 text-sm font-semibold text-dark-navy transition hover:border-blue-primary hover:bg-white hover:text-blue-primary"
              type="button"
              onClick={onOpenForm}
            >
              <Plus aria-hidden="true" size={16} />
              Add card
            </button>
          )}
        </div>
      </SortableContext>
    </article>
  );
}

function SortableKanbanCard({
  card,
  columnId,
  onDeleteCard,
}: {
  card: KanbanCard;
  columnId: ColumnId;
  onDeleteCard: (cardId: CardId) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      cardId: card.id,
      columnId,
    } satisfies DragData,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-45" : ""}
      data-card-id={card.id}
    >
      <CardShell
        card={card}
        dragHandleProps={{ ...attributes, ...listeners }}
        onDeleteCard={() => onDeleteCard(card.id)}
      />
    </div>
  );
}

function CardShell({
  card,
  dragHandleProps,
  dragOverlay = false,
  onDeleteCard,
}: {
  card: KanbanCard;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  dragOverlay?: boolean;
  onDeleteCard: () => void;
}) {
  return (
    <div
      className={[
        "rounded-lg border border-line bg-white p-3 shadow-sm",
        dragOverlay ? "w-72 shadow-2xl" : "transition hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <button
          aria-label={`Drag ${card.title}`}
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-text transition hover:bg-[#eef3f8] hover:text-dark-navy"
          data-drag-handle
          type="button"
          {...dragHandleProps}
        >
          <GripVertical aria-hidden="true" size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-5 text-dark-navy">
            {card.title}
          </h3>
          <p className="mt-2 break-words text-sm leading-5 text-gray-text">
            {card.details}
          </p>
        </div>
        <button
          aria-label={`Delete ${card.title}`}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-text transition hover:bg-[#fff6dd] hover:text-[#9b7000]"
          type="button"
          onClick={onDeleteCard}
        >
          <Trash2 aria-hidden="true" size={15} />
        </button>
      </div>
    </div>
  );
}
