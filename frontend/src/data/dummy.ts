import { BoardState } from "@/types";

export const initialBoardState: BoardState = {
  cards: {
    "card-1": {
      id: "card-1",
      title: "Define project scope",
      details: "Outline the key deliverables, milestones, and success criteria for Q3.",
    },
    "card-2": {
      id: "card-2",
      title: "Stakeholder interviews",
      details: "Schedule and conduct interviews with department leads to gather requirements.",
    },
    "card-3": {
      id: "card-3",
      title: "Design system audit",
      details: "Review existing component library for consistency and accessibility gaps.",
    },
    "card-4": {
      id: "card-4",
      title: "API schema design",
      details: "Draft OpenAPI spec for the new endpoints. Coordinate with backend team.",
    },
    "card-5": {
      id: "card-5",
      title: "Set up CI pipeline",
      details: "Configure GitHub Actions for automated testing and deployment.",
    },
    "card-6": {
      id: "card-6",
      title: "User flow wireframes",
      details: "Create low-fidelity wireframes for the onboarding and dashboard flows.",
    },
    "card-7": {
      id: "card-7",
      title: "Performance benchmarks",
      details: "Run Lighthouse audits and establish baseline metrics for load time.",
    },
    "card-8": {
      id: "card-8",
      title: "Security review",
      details: "Audit authentication flow and data handling for OWASP compliance.",
    },
    "card-9": {
      id: "card-9",
      title: "Write onboarding docs",
      details: "Prepare developer onboarding guide covering local setup and conventions.",
    },
    "card-10": {
      id: "card-10",
      title: "Sprint retrospective",
      details: "Facilitate retro for Sprint 4. Collect feedback on velocity and blockers.",
    },
  },
  columns: [
    { id: "col-1", title: "Backlog", cardIds: ["card-1", "card-2"] },
    { id: "col-2", title: "To Do", cardIds: ["card-3", "card-4"] },
    { id: "col-3", title: "In Progress", cardIds: ["card-5", "card-6"] },
    { id: "col-4", title: "Review", cardIds: ["card-7", "card-8"] },
    { id: "col-5", title: "Done", cardIds: ["card-9", "card-10"] },
  ],
  columnOrder: ["col-1", "col-2", "col-3", "col-4", "col-5"],
};
