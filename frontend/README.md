# Kanban Board MVP

A modern, elegant Kanban project management application built with Next.js 15+, TypeScript, Tailwind CSS, and Zustand.

## Features

- **Single Board with 5 Columns**: Renameable columns for organizing work
- **Card Management**: Add cards with title/details, delete with confirmation
- **Column Renaming**: Inline edit column titles
- **Professional UI**: Custom color scheme, responsive layout
- **Client-Rendered**: Fast, no backend required for MVP
- **Dummy Data**: Pre-populated on load

## Installation

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3001
```

## Tech Stack

- Next.js 15+ with App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- Zustand state management
- @dnd-kit for drag-and-drop

## Usage

1. **Add Card**: Click "Add Card" button, fill form, click "Add"
2. **Delete Card**: Hover card, click trash icon, confirm
3. **Rename Column**: Click edit icon on column title, type new name

## Project Structure

- `app/` – Next.js pages
- `components/` – React components (Board, Column, Card)
- `store/` – Zustand state management
- `types/` – TypeScript interfaces
- `data/` – Dummy data

## Build

```bash
npm run build
npm start
```

## Notes

- No data persistence (as per MVP spec)
- Optimized for desktop
- All interactions update state immediately
