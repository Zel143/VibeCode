# Architectural Overview

VibeCode is a modern, dark-themed brain training web application built with **React 19** and **Vite 8**. It is designed as a client-side only Single Page Application (SPA) with local persistence.

## Core Technologies

- **Frontend Framework**: React 19 (using Hooks and Context for state management).
- **Build Tool**: Vite 8 for fast development and optimized production builds.
- **Routing**: React Router 7 for tab-based navigation and game routing.
- **Animations**: Framer Motion for smooth transitions, layout animations, and interactive feedback.
- **Icons**: Lucide React for a consistent, modern icon set.
- **Styling**: Vanilla CSS with custom properties (CSS Variables) for theme consistency and glassmorphism effects.

## Project Structure

```text
src/
├── components/       # Reusable UI components (Cards, TabBar, Onboarding, etc.)
├── context/          # React Context (UserContext for global state)
├── data/             # Static game definitions and content
├── games/            # Game-specific logic and UI (categorized by type)
├── pages/            # Main tab views (Today, Games, Leagues, Me, Settings)
├── utils/            # Shared logic (Difficulty engine, Storage, Workout generation)
├── App.jsx           # Main router and shell layout
└── main.jsx          # Application entry point
```

## Design Principles

1. **Dark-First UI**: High-contrast, vibrant colors on deep indigo/violet backgrounds.
2. **Glassmorphism**: Use of `backdrop-filter` and semi-transparent borders for a premium, layered feel.
3. **Micro-interactions**: Subtle hover states, animated score counters, and smooth page transitions.
4. **Adaptive Difficulty**: The app automatically scales game complexity based on user performance.

## State Management

The application uses `UserContext` to manage:
- User profile (name, goals, joined date).
- Performance stats (XP, level, streaks).
- Historical results and progress in specific games.
- Daily workout status.

Data is persisted to `localStorage` via the `utils/storage.js` helper.
