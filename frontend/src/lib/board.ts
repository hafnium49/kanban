export type CardId = string;
export type ColumnId = string;

export type KanbanCard = {
  id: CardId;
  title: string;
  details: string;
};

export type KanbanColumn = {
  id: ColumnId;
  title: string;
  cardIds: CardId[];
};

export type BoardState = {
  columns: KanbanColumn[];
  cards: Record<CardId, KanbanCard>;
};

export const initialBoard: BoardState = {
  columns: [
    {
      id: "ideas",
      title: "Ideas",
      cardIds: ["card-brief", "card-risk"],
    },
    {
      id: "ready",
      title: "Ready",
      cardIds: ["card-flows", "card-copy"],
    },
    {
      id: "active",
      title: "Active",
      cardIds: ["card-ui", "card-drag"],
    },
    {
      id: "review",
      title: "Review",
      cardIds: ["card-tests"],
    },
    {
      id: "done",
      title: "Done",
      cardIds: ["card-kickoff"],
    },
  ],
  cards: {
    "card-brief": {
      id: "card-brief",
      title: "Shape project brief",
      details: "Confirm scope, business goals, and success criteria for the MVP.",
    },
    "card-risk": {
      id: "card-risk",
      title: "List launch risks",
      details: "Capture the few issues that could block a smooth first release.",
    },
    "card-flows": {
      id: "card-flows",
      title: "Map board flow",
      details: "Define how cards move from early ideas through final completion.",
    },
    "card-copy": {
      id: "card-copy",
      title: "Tighten card copy",
      details: "Keep titles short and details useful for quick daily scanning.",
    },
    "card-ui": {
      id: "card-ui",
      title: "Polish board surface",
      details: "Tune spacing, contrast, and controls for a professional first view.",
    },
    "card-drag": {
      id: "card-drag",
      title: "Validate drag behavior",
      details: "Move cards across all columns and check the drop targets feel clear.",
    },
    "card-tests": {
      id: "card-tests",
      title: "Run MVP test pass",
      details: "Cover add, delete, rename, and cross-column movement.",
    },
    "card-kickoff": {
      id: "card-kickoff",
      title: "Create starter board",
      details: "Open the app with realistic sample data already in place.",
    },
  },
};

export function addCard(
  board: BoardState,
  columnId: ColumnId,
  card: KanbanCard,
): BoardState {
  return {
    cards: {
      ...board.cards,
      [card.id]: card,
    },
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cardIds: [...column.cardIds, card.id] }
        : column,
    ),
  };
}

export function deleteCard(board: BoardState, cardId: CardId): BoardState {
  const cards = { ...board.cards };
  delete cards[cardId];

  return {
    cards,
    columns: board.columns.map((column) => ({
      ...column,
      cardIds: column.cardIds.filter((id) => id !== cardId),
    })),
  };
}

export function renameColumn(
  board: BoardState,
  columnId: ColumnId,
  title: string,
): BoardState {
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column,
    ),
  };
}

export function moveCard(
  board: BoardState,
  cardId: CardId,
  targetColumnId: ColumnId,
  overCardId?: CardId,
): BoardState {
  const sourceColumn = board.columns.find((column) =>
    column.cardIds.includes(cardId),
  );
  const targetColumn = board.columns.find((column) => column.id === targetColumnId);

  if (!sourceColumn || !targetColumn) {
    return board;
  }

  const withoutMovedCard = board.columns.map((column) => ({
    ...column,
    cardIds: column.cardIds.filter((id) => id !== cardId),
  }));

  return {
    ...board,
    columns: withoutMovedCard.map((column) => {
      if (column.id !== targetColumnId) {
        return column;
      }

      const insertAt = overCardId
        ? column.cardIds.findIndex((id) => id === overCardId)
        : -1;
      const nextCardIds = [...column.cardIds];

      if (insertAt >= 0) {
        nextCardIds.splice(insertAt, 0, cardId);
      } else {
        nextCardIds.push(cardId);
      }

      return { ...column, cardIds: nextCardIds };
    }),
  };
}

export function getCardColumnId(
  board: BoardState,
  cardId: CardId,
): ColumnId | undefined {
  return board.columns.find((column) => column.cardIds.includes(cardId))?.id;
}
