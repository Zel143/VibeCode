const STORAGE_KEY = 'vibecode_data';
const STORAGE_VERSION = 1;

const defaultUserData = () => ({
  version: STORAGE_VERSION,
  username: '',
  joinDate: new Date().toISOString(),
  xp: { total: 0, weekly: 0, weekStart: getWeekStart() },
  streak: { current: 0, best: 0, lastActiveDate: null },
  workoutCalendar: {},
  todayWorkoutComplete: false,
  todayPuzzleComplete: false,
  gameStats: {},
  achievements: [],
  favorites: [],
  settings: {
    workoutLength: 3,
    soundEffects: true,
    darkMode: true,
    trainingGoals: ['math', 'reading', 'writing', 'speaking', 'memory'],
  },
  league: {
    tier: 'bronze',
    rank: 10,
    opponents: [],
    weekStart: getWeekStart(),
  },
});

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export function loadUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== STORAGE_VERSION) {
      return migrateData(data);
    }
    // Check if week has rolled over
    const currentWeekStart = getWeekStart();
    if (data.xp.weekStart !== currentWeekStart) {
      data.xp.weekly = 0;
      data.xp.weekStart = currentWeekStart;
    }
    if (data.league.weekStart !== currentWeekStart) {
      data.league.weekStart = currentWeekStart;
      data.league.opponents = generateOpponents();
    }
    // Check streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.streak.lastActiveDate) {
      const lastDate = new Date(data.streak.lastActiveDate).toDateString();
      if (lastDate !== today && lastDate !== yesterday) {
        data.streak.current = 0;
      }
    }
    // Reset daily flags
    const lastDate = data.streak.lastActiveDate
      ? new Date(data.streak.lastActiveDate).toDateString()
      : null;
    if (lastDate !== today) {
      data.todayWorkoutComplete = false;
      data.todayPuzzleComplete = false;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
}

export function createNewUser(username) {
  const data = defaultUserData();
  data.username = username;
  data.league.opponents = generateOpponents();
  saveUserData(data);
  return data;
}

function migrateData(data) {
  // Future migration logic
  const fresh = defaultUserData();
  return { ...fresh, ...data, version: STORAGE_VERSION };
}

export function generateOpponents() {
  const names = [
    'Alex', 'Jordan', 'Sam', 'Taylor', 'Casey',
    'Morgan', 'Riley', 'Quinn', 'Avery', 'Sage',
    'Luna', 'Kai', 'Nova', 'Phoenix', 'River'
  ];
  const shuffled = names.sort(() => Math.random() - 0.5).slice(0, 9);
  return shuffled.map(name => ({
    name,
    xp: Math.floor(Math.random() * 800) + 100,
    avatar: name[0],
  }));
}

export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

export function recordActivity(userData, gameId, score, xpEarned) {
  const dateKey = getDateKey();
  const today = new Date().toDateString();

  // Update XP
  userData.xp.total += xpEarned;
  userData.xp.weekly += xpEarned;

  // Update streak
  const lastDate = userData.streak.lastActiveDate
    ? new Date(userData.streak.lastActiveDate).toDateString()
    : null;
  if (lastDate !== today) {
    userData.streak.current += 1;
  }
  if (userData.streak.current > userData.streak.best) {
    userData.streak.best = userData.streak.current;
  }
  userData.streak.lastActiveDate = new Date().toISOString();

  // Update game stats
  if (!userData.gameStats[gameId]) {
    userData.gameStats[gameId] = {
      highScore: 0,
      gamesPlayed: 0,
      totalScore: 0,
      difficulty: 1,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      lastPlayed: null,
    };
  }
  const stats = userData.gameStats[gameId];
  stats.gamesPlayed += 1;
  stats.totalScore += score;
  if (score > stats.highScore) stats.highScore = score;
  stats.lastPlayed = new Date().toISOString();

  // Update calendar
  if (!userData.workoutCalendar[dateKey]) {
    userData.workoutCalendar[dateKey] = { games: [], xp: 0 };
  }
  userData.workoutCalendar[dateKey].games.push(gameId);
  userData.workoutCalendar[dateKey].xp += xpEarned;

  saveUserData(userData);
  return userData;
}
