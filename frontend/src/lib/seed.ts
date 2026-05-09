import type { BoardSnapshot } from "./types";

export function createSeed(): BoardSnapshot {
  const columns = [
    { id: "col-backlog", title: "Backlog", cardIds: ["c1", "c2"] },
    { id: "col-todo", title: "To Do", cardIds: ["c3", "c4"] },
    { id: "col-progress", title: "In Progress", cardIds: ["c5"] },
    { id: "col-review", title: "Review", cardIds: ["c6"] },
    { id: "col-done", title: "Done", cardIds: ["c7", "c8"] },
  ];

  const cards: Record<string, { id: string; title: string; details: string }> = {
    c1: {
      id: "c1",
      title: "Define Q3 roadmap",
      details: "Align with stakeholders on top three initiatives for the quarter.",
    },
    c2: {
      id: "c2",
      title: "Customer interview synthesis",
      details: "Pull themes from last week's five user calls into a shared doc.",
    },
    c3: {
      id: "c3",
      title: "Wire up auth provider",
      details: "Replace placeholder login with the real OAuth flow.",
    },
    c4: {
      id: "c4",
      title: "Design empty board state",
      details: "Sketch what new users see when no cards exist yet.",
    },
    c5: {
      id: "c5",
      title: "Build drag-and-drop interactions",
      details: "Smooth column-to-column moves with keyboard support.",
    },
    c6: {
      id: "c6",
      title: "Review pricing page copy",
      details: "Marketing has a draft ready for one final pass.",
    },
    c7: {
      id: "c7",
      title: "Set up project repo",
      details: "Branch protection, CI, and contributor guide are live.",
    },
    c8: {
      id: "c8",
      title: "Pick brand colors",
      details: "Locked navy, blue, purple, yellow, gray palette.",
    },
  };

  return { columns, cards };
}
