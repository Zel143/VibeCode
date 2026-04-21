import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight, BookOpen, Zap, Play } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { generateDailyWorkout, generateDailyPuzzle, getWordOfTheDay } from '../utils/workout';
import { GAMES } from '../data/games';
import GameCard from '../components/GameCard';
import { useNavigate } from 'react-router-dom';
import './Today.css';

export default function Today() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [puzzleResult, setPuzzleResult] = useState(null);

  const workout = useMemo(() => generateDailyWorkout(userData), [userData]);
  const puzzle = useMemo(() => generateDailyPuzzle(), []);
  const wordOfDay = useMemo(() => getWordOfTheDay(), []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const favGames = GAMES.filter(g => userData.favorites.includes(g.id));
  const recentGameIds = Object.entries(userData.gameStats)
    .filter(([, s]) => s.lastPlayed)
    .sort((a, b) => new Date(b[1].lastPlayed) - new Date(a[1].lastPlayed))
    .slice(0, 4)
    .map(([id]) => id);
  const recentGames = GAMES.filter(g => recentGameIds.includes(g.id));
  const displayGames = favGames.length > 0 ? favGames : recentGames;

  const handlePuzzle = () => {
    if (puzzle.type === 'math') {
      setPuzzleResult(puzzleAnswer.trim() === puzzle.answer.toString() ? 'correct' : 'wrong');
    } else {
      setPuzzleResult(
        puzzleAnswer.trim().toLowerCase() === puzzle.answer.toLowerCase() ? 'correct' : 'wrong'
      );
    }
  };

  const todayXP = userData.workoutCalendar[new Date().toISOString().split('T')[0]]?.xp || 0;
  const todayGamesPlayed = userData.workoutCalendar[new Date().toISOString().split('T')[0]]?.games?.length || 0;

  return (
    <div className="today-page">
      {/* Header */}
      <motion.div
        className="today-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="today-greeting">{getGreeting()},</p>
          <h1 className="today-name">{userData.username} ✨</h1>
        </div>
        <div className="today-streak">
          <div className="today-streak-flame">
            <Flame size={20} />
          </div>
          <span className="today-streak-count">{userData.streak.current}</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="today-quick-stats"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="today-stat">
          <Zap size={16} color="var(--accent-cyan)" />
          <span>{todayXP} XP today</span>
        </div>
        <div className="today-stat">
          <Play size={16} color="var(--accent-emerald)" />
          <span>{todayGamesPlayed} games played</span>
        </div>
      </motion.div>

      {/* Featured Workout */}
      <motion.div
        className="today-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="today-section-header">
          <h2>Today's Workout</h2>
          {userData.todayWorkoutComplete && <span className="today-badge-done">✓ Done</span>}
        </div>
        <div className="today-workout-card" onClick={() => navigate(`/play/${workout[0]?.id}`)}>
          <div className="today-workout-bg" />
          <div className="today-workout-content">
            <div className="today-workout-games">
              {workout.map((game, i) => (
                <div key={game.id} className="today-workout-game">
                  <span className="today-workout-emoji">{game.emoji}</span>
                  <span className="today-workout-gname">{game.name}</span>
                  {userData.gameStats[game.id] && (
                    <span className="today-workout-check">✓</span>
                  )}
                </div>
              ))}
            </div>
            <button className="btn-primary today-workout-btn">
              Start Workout <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Daily Puzzle */}
      <motion.div
        className="today-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="today-section-header">
          <h2>Daily Puzzle</h2>
          <span className="today-badge-cat">{puzzle.type === 'math' ? '🔢' : '✍️'}</span>
        </div>
        <div className="today-puzzle-card card-static">
          <p className="today-puzzle-q">{puzzle.question}</p>
          {puzzleResult ? (
            <div className={`today-puzzle-result ${puzzleResult}`}>
              {puzzleResult === 'correct' ? '✅ Correct!' : `❌ The answer was: ${puzzle.answer}`}
            </div>
          ) : (
            <div className="today-puzzle-input-wrap">
              <input
                type="text"
                value={puzzleAnswer}
                onChange={e => setPuzzleAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePuzzle()}
                placeholder="Your answer..."
                className="today-puzzle-input"
              />
              <button className="btn-primary today-puzzle-btn" onClick={handlePuzzle}>
                Check
              </button>
            </div>
          )}
          {!puzzleResult && <p className="today-puzzle-hint">💡 {puzzle.hint}</p>}
        </div>
      </motion.div>

      {/* Word of the Day */}
      <motion.div
        className="today-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="today-section-header">
          <h2>Word of the Day</h2>
          <BookOpen size={18} color="var(--text-tertiary)" />
        </div>
        <div className="today-word-card card-static">
          <h3 className="today-word">{wordOfDay.word}</h3>
          <p className="today-word-def">{wordOfDay.definition}</p>
          <p className="today-word-usage">"{wordOfDay.usage}"</p>
        </div>
      </motion.div>

      {/* Recent / Favorites */}
      {displayGames.length > 0 && (
        <motion.div
          className="today-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="today-section-header">
            <h2>{favGames.length > 0 ? 'Favorites' : 'Recent Games'}</h2>
          </div>
          <div className="today-games-row">
            {displayGames.map(game => (
              <GameCard key={game.id} game={game} compact />
            ))}
          </div>
        </motion.div>
      )}

      <div className="today-spacer" />
    </div>
  );
}
