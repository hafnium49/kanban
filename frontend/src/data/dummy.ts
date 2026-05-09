import { Board } from "@/types";

export const createDummyBoard = (): Board => {
  const cards = {
    "card-1": {
      id: "card-1",
      title: "Setup project structure",
      details: "Initialize Next.js app with TypeScript and Tailwind CSS",
    },
    "card-2": {
      id: "card-2",
      title: "Design database schema",
      details: "Define types for Board, Column, and Card entities",
    },
    "card-3": {
      id: "card-3",
      title: "Create API endpoints",
      details: "Build REST endpoints for CRUD operations",
    },
    "card-4": {
      id: "card-4",
      title: "Build Board component",
      details: "Implement main board layout with 5 columns",
    },
    "card-5": {
      id: "card-5",
      title: "Build Column component",
      details: "Create reusable column with cards and actions",
    },
    "card-6": {
      id: "card-6",
      title: "Implement drag and drop",
      details: "Add drag-and-drop functionality using dnd-kit",
    },
    "card-7": {
      id: "card-7",
      title: "Style with Tailwind",
      details: "Apply color scheme and responsive design",
    },
    "card-8": {
      id: "card-8",
      title: "Add card creation form",
      details: "Create inline form to add new cards",
    },
    "card-9": {
      id: "card-9",
      title: "Add delete functionality",
      details: "Implement card deletion with confirmation",
    },
    "card-10": {
      id: "card-10",
      title: "Edit column titles",
      details: "Allow inline editing of column names",
    },
    "card-11": {
      id: "card-11",
      title: "Write unit tests",
      details: "Test state management and components",
    },
    "card-12": {
      id: "card-12",
      title: "Write integration tests",
      details: "Test drag-drop and user workflows with Playwright",
    },
    "card-13": {
      id: "card-13",
      title: "Performance optimization",
      details: "Optimize rendering and state updates",
    },
    "card-14": {
      id: "card-14",
      title: "Browser testing",
      details: "Test on desktop, tablet, and mobile devices",
    },
    "card-15": {
      id: "card-15",
      title: "Documentation",
      details: "Write README and inline code comments",
    },
  };

  const board: Board = {
    id: "board-1",
    columns: [
      {
        id: "col-1",
        title: "Backlog",
        cardIds: ["card-1", "card-2", "card-3"],
      },
      {
        id: "col-2",
        title: "In Progress",
        cardIds: ["card-4", "card-5", "card-6"],
      },
      {
        id: "col-3",
        title: "Review",
        cardIds: ["card-7", "card-8", "card-9"],
      },
      {
        id: "col-4",
        title: "Testing",
        cardIds: ["card-10", "card-11", "card-12"],
      },
      {
        id: "col-5",
        title: "Done",
        cardIds: ["card-13", "card-14", "card-15"],
      },
    ],
    cards,
  };

  return board;
};
