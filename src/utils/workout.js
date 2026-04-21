import { GAMES } from '../data/games';

export function generateDailyWorkout(userData) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const workoutLength = userData.settings.workoutLength || 3;

  // Get category performance
  const categoryScores = {};
  const categories = ['math', 'reading', 'writing', 'speaking', 'memory'];
  categories.forEach(cat => { categoryScores[cat] = 0; });

  Object.entries(userData.gameStats).forEach(([gameId, stats]) => {
    const game = GAMES.find(g => g.id === gameId);
    if (game) {
      categoryScores[game.category] += stats.totalScore / Math.max(1, stats.gamesPlayed);
    }
  });

  // Prioritize weak categories
  const sortedCategories = categories
    .filter(c => userData.settings.trainingGoals.includes(c))
    .sort((a, b) => categoryScores[a] - categoryScores[b]);

  // Deterministic shuffle using seed
  const seededRandom = (s) => {
    let x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  // Pick games from weak categories first
  const selectedGames = [];
  let seedCounter = seed;

  for (let i = 0; i < workoutLength && sortedCategories.length > 0; i++) {
    const catIndex = i % sortedCategories.length;
    const category = sortedCategories[catIndex];
    const categoryGames = GAMES.filter(
      g => g.category === category && !selectedGames.find(s => s.id === g.id)
    );
    if (categoryGames.length > 0) {
      const idx = Math.floor(seededRandom(seedCounter++) * categoryGames.length);
      selectedGames.push(categoryGames[idx]);
    }
  }

  // Fill remaining slots if needed
  while (selectedGames.length < workoutLength) {
    const remaining = GAMES.filter(g => !selectedGames.find(s => s.id === g.id));
    if (remaining.length === 0) break;
    const idx = Math.floor(seededRandom(seedCounter++) * remaining.length);
    selectedGames.push(remaining[idx]);
  }

  return selectedGames;
}

export function generateDailyPuzzle() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const puzzleTypes = ['math', 'word'];
  const type = puzzleTypes[seed % 2];

  if (type === 'math') {
    const a = (seed % 47) + 12;
    const b = ((seed * 7) % 31) + 5;
    const ops = ['+', '-', '×'];
    const op = ops[seed % 3];
    let answer;
    switch (op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '×': answer = a * b; break;
      default: answer = a + b;
    }
    return {
      type: 'math',
      question: `What is ${a} ${op} ${b}?`,
      answer: answer.toString(),
      hint: `Think step by step: ${a} ${op} ${b}`,
    };
  } else {
    const words = [
      { scrambled: 'CTVIAE', answer: 'ACTIVE', hint: 'Not passive' },
      { scrambled: 'RANELG', answer: 'LANGER', hint: 'A feeling of anger' },
      { scrambled: 'SIFNUH', answer: 'FINISH', hint: 'To complete' },
      { scrambled: 'THECAK', answer: 'THWACK', hint: 'A sharp blow' },
      { scrambled: 'PLSIME', answer: 'SIMPLE', hint: 'Not complex' },
      { scrambled: 'RBGITH', answer: 'BRIGHT', hint: 'Full of light' },
      { scrambled: 'CNOEAL', answer: 'CANOEL', hint: 'A light boat' },
      { scrambled: 'DNEARG', answer: 'GARDEN', hint: 'Where flowers grow' },
      { scrambled: 'PNAYOM', answer: 'WEAPON', hint: 'Used in combat' },
      { scrambled: 'CHNLAU', answer: 'LAUNCH', hint: 'To start or send off' },
    ];
    const puzzle = words[seed % words.length];
    return { type: 'word', question: `Unscramble: ${puzzle.scrambled}`, ...puzzle };
  }
}

export function getWordOfTheDay() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const words = [
    { word: 'Ephemeral', definition: 'Lasting for a very short time.', usage: 'The ephemeral beauty of cherry blossoms makes them all the more precious.' },
    { word: 'Eloquent', definition: 'Fluent or persuasive in speaking or writing.', usage: 'Her eloquent speech moved the entire audience to tears.' },
    { word: 'Resilient', definition: 'Able to recover quickly from difficulties.', usage: 'The resilient community rebuilt their town after the storm.' },
    { word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically.', usage: 'A pragmatic approach to problem-solving often yields the best results.' },
    { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', usage: 'Smartphones have become ubiquitous in modern society.' },
    { word: 'Serendipity', definition: 'The occurrence of events by chance in a happy way.', usage: 'It was pure serendipity that they met at the bookstore.' },
    { word: 'Tenacious', definition: 'Holding firmly to something; persistent.', usage: 'Her tenacious pursuit of excellence earned her the top position.' },
    { word: 'Lucid', definition: 'Expressed clearly; easy to understand.', usage: 'The professor gave a lucid explanation of quantum mechanics.' },
    { word: 'Ambivalent', definition: 'Having mixed feelings about something.', usage: 'She felt ambivalent about moving to a new city.' },
    { word: 'Catalyst', definition: 'A person or thing that precipitates an event or change.', usage: 'The discovery was a catalyst for a new era of scientific research.' },
    { word: 'Paradigm', definition: 'A typical example or pattern of something.', usage: 'The internet created a paradigm shift in communication.' },
    { word: 'Cogent', definition: 'Clear, logical, and convincing.', usage: 'She presented a cogent argument that swayed the jury.' },
    { word: 'Meticulous', definition: 'Showing great attention to detail; very careful.', usage: 'His meticulous planning ensured the event ran smoothly.' },
    { word: 'Altruistic', definition: 'Selflessly concerned for the well-being of others.', usage: 'Her altruistic nature made her volunteer every weekend.' },
    { word: 'Confluence', definition: 'A coming together of people or things.', usage: 'The confluence of ideas from diverse backgrounds fueled innovation.' },
  ];
  return words[seed % words.length];
}
