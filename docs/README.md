# VibeCode Documentation

Welcome to the VibeCode documentation. This directory contains detailed information about the technical implementation, game mechanics, and data structures of the VibeCode brain training application.

## Table of Contents

1.  [**Architectural Overview**](./ARCHITECTURAL_OVERVIEW.md)
    *   Tech stack (React 19, Vite 8).
    *   Project structure and folder organization.
    *   Design system and UI principles.

2.  [**Games Guide**](./GAMES_GUIDE.md)
    *   Detailed breakdown of the 8 playable games.
    *   Categorization (Math, Writing, Reading, Speaking, Memory).
    *   Scoring and adaptive difficulty mechanics.

3.  [**Data & State Management**](./DATA_AND_STATE.md)
    *   Local-first persistence using `localStorage`.
    *   Global state management with React Context.
    *   Adaptive difficulty engine and workout generation logic.

## Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack Highlights

*   **React 19** for modern UI components.
*   **Framer Motion** for premium animations.
*   **Lucide React** for consistent iconography.
*   **React Router 7** for smooth navigation.
