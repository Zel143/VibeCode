# Games Guide

VibeCode features 8 initial games across 5 cognitive categories. Each game uses an adaptive difficulty engine that scales complexity based on the player's accuracy and speed.

## Categories & Games

### 🧮 Math
- **Speed Math**: Solve basic arithmetic (addition, subtraction, multiplication, division) against a ticking clock. Complexity increases with larger numbers and mixed operations.
- **Number Memory**: A sequence of digits appears briefly. Recall them in order. Sequences get longer as you succeed.

### ✍️ Writing
- **Word Scramble**: Unscramble a set of letters to form a valid word. Hints and word length scale with difficulty.
- **Grammar Fix**: Identify and correct grammatical errors in provided sentences.

### 📖 Reading
- **Speed Reader**: Passages are displayed at increasing speeds. Answer comprehension questions to prove understanding.
- **Word Finder**: Find specific target words within a dense grid of text.

### 🗣️ Speaking
- **Articulate**: Form concise explanations for given topics. This is a timed, self-rated exercise designed to improve verbal fluency.

### 🧠 Memory
- **Sequence Memory**: Watch a grid of tiles light up in a specific pattern and reproduce the sequence perfectly.

## Game Lifecycle

1. **Start**: Brief instructions and a "Get Ready" countdown.
2. **Play**: The core game loop (usually timed). Adaptive difficulty adjusts `difficultyLevel` (1-10) in real-time or between rounds.
3. **Results**: Summary of performance including:
   - Final Score
   - Accuracy Percentage
   - XP Earned
   - Performance vs. Personal Best

## XP & Scoring

- **Accuracy**: The primary driver for high scores.
- **Speed**: Bonus points awarded for fast responses.
- **Difficulty Bonus**: Higher difficulty levels provide a multiplier to XP earned.
