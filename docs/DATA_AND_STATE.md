# Data & State Management

VibeCode is designed as a serverless, local-first application. All user data and progress are stored directly in the user's browser.

## Data Persistence (`utils/storage.js`)

The application uses a dedicated storage utility to handle all interaction with `localStorage`.

- **Key**: `vibecode_user_data`
- **Schema Versioning**: Includes a `version` field to handle future data structure updates.
- **Methods**:
  - `saveUserData(data)`: Serializes and saves the entire user object.
  - `loadUserData()`: Retrieves and parses the user object, returning `null` if not found.
  - `clearUserData()`: Resets all progress.

## Global State (`context/UserContext.jsx`)

The `UserProvider` wraps the entire application and exposes the `useUser` hook.

### State Properties
- `userData`: The full user profile and history object.
- `isLoading`: Boolean indicating if data is being loaded from storage.
- `updateUserData(newData)`: Function to merge and save partial updates.
- `addGameResult(gameId, result)`: Specialized function to record a game session, update XP, and adjust difficulty stats.

## Adaptive Difficulty (`utils/difficulty.js`)

The difficulty engine calculates the complexity of games based on the user's performance history.

- **Calculation**: Factors in recent accuracy and speed.
- **Scaling**: Each game has a `difficultyLevel` from 1 to 10.
- **Impact**: Level 1 might show "2 + 2", while Level 10 might show "(14 * 3) / 2 + 19".

## Daily Workouts (`utils/workout.js`)

The workout generator creates a personalized set of 3 games every day.

- **Seed-Based**: Uses the current date as a seed to ensure the same workout is presented throughout the day.
- **Category Balancing**: Prioritizes categories where the user has lower performance or hasn't practiced recently.
