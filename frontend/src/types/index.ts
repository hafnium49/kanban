export interface Card {
  id: string;
  title: string;
  details: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  cards: Record<string, Card>;
  columns: Column[];
  columnOrder: string[];
}
