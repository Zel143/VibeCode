export function getDifficultyParams(gameId, level) {
  const clampedLevel = Math.max(1, Math.min(10, level));

  const configs = {
    'speed-math': {
      timeLimit: Math.max(5, 15 - clampedLevel),
      maxNumber: 10 + clampedLevel * 10,
      operations: clampedLevel <= 3 ? ['+', '-'] : clampedLevel <= 6 ? ['+', '-', '×'] : ['+', '-', '×', '÷'],
      rounds: 8 + Math.floor(clampedLevel / 2),
    },
    'number-memory': {
      digits: 3 + Math.floor(clampedLevel * 0.8),
      displayTime: Math.max(1000, 3000 - clampedLevel * 200),
    },
    'word-scramble': {
      wordLength: Math.min(4 + Math.floor(clampedLevel / 2), 10),
      timeLimit: Math.max(10, 30 - clampedLevel * 2),
      rounds: 6 + Math.floor(clampedLevel / 3),
    },
    'grammar-fix': {
      complexity: clampedLevel <= 3 ? 'easy' : clampedLevel <= 6 ? 'medium' : 'hard',
      timeLimit: Math.max(10, 25 - clampedLevel),
      rounds: 6 + Math.floor(clampedLevel / 2),
    },
    'speed-reader': {
      wpm: 150 + clampedLevel * 30,
      questionCount: 3 + Math.floor(clampedLevel / 3),
      passageLength: clampedLevel <= 3 ? 'short' : clampedLevel <= 6 ? 'medium' : 'long',
    },
    'word-finder': {
      gridSize: 6 + Math.floor(clampedLevel / 2),
      wordCount: 4 + Math.floor(clampedLevel / 2),
      timeLimit: Math.max(30, 90 - clampedLevel * 5),
    },
    'articulate': {
      timeLimit: Math.max(15, 45 - clampedLevel * 3),
      complexity: clampedLevel <= 3 ? 'simple' : clampedLevel <= 6 ? 'moderate' : 'complex',
    },
    'sequence-memory': {
      sequenceLength: 3 + Math.floor(clampedLevel * 0.7),
      displaySpeed: Math.max(300, 800 - clampedLevel * 50),
      gridSize: clampedLevel <= 4 ? 3 : clampedLevel <= 7 ? 4 : 5,
    },
  };

  return configs[gameId] || {};
}

export function updateDifficulty(stats, wasCorrect) {
  if (!stats) return 1;

  if (wasCorrect) {
    stats.consecutiveCorrect += 1;
    stats.consecutiveWrong = 0;
    if (stats.consecutiveCorrect >= 3) {
      stats.difficulty = Math.min(10, stats.difficulty + 1);
      stats.consecutiveCorrect = 0;
    }
  } else {
    stats.consecutiveWrong += 1;
    stats.consecutiveCorrect = 0;
    if (stats.consecutiveWrong >= 2) {
      stats.difficulty = Math.max(1, stats.difficulty - 1);
      stats.consecutiveWrong = 0;
    }
  }

  return stats.difficulty;
}

export function calculateXP(score, difficulty, maxScore) {
  const accuracy = maxScore > 0 ? score / maxScore : 0;
  const baseXP = 10;
  const difficultyBonus = difficulty * 2;
  const accuracyMultiplier = 0.5 + accuracy * 1.5;
  return Math.round((baseXP + difficultyBonus) * accuracyMultiplier);
}
