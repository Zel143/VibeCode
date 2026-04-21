import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, RotateCcw, ArrowLeft, TrendingUp } from 'lucide-react';
import { playSound } from '../utils/sounds';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import './GameResults.css';

export default function GameResults({ gameId, gameName, score, maxScore, accuracy, timeSpent, onPlayAgain }) {
  const navigate = useNavigate();
  const { userData } = useUser();
  const stats = userData?.gameStats[gameId];
  const isHighScore = stats && score >= stats.highScore;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const xpEarned = stats ? Math.round((10 + stats.difficulty * 2) * (0.5 + (score / Math.max(1, maxScore)) * 1.5)) : 10;

  useEffect(() => {
    if (percentage >= 80) {
      playSound('complete');
    }
  }, []);

  const getGrade = () => {
    if (percentage >= 95) return { label: 'Perfect!', color: '#fbbf24', emoji: '🌟' };
    if (percentage >= 80) return { label: 'Great!', color: '#34d399', emoji: '🎉' };
    if (percentage >= 60) return { label: 'Good', color: '#22d3ee', emoji: '👍' };
    if (percentage >= 40) return { label: 'Keep Trying', color: '#fb923c', emoji: '💪' };
    return { label: 'Practice More', color: '#f87171', emoji: '📚' };
  };

  const grade = getGrade();

  return (
    <div className="game-results-overlay">
      <motion.div
        className="game-results"
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {isHighScore && (
          <motion.div
            className="game-results-highscore"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Trophy size={16} />
            New High Score!
          </motion.div>
        )}

        <div className="game-results-emoji">{grade.emoji}</div>
        <h2 className="game-results-grade" style={{ color: grade.color }}>{grade.label}</h2>
        <p className="game-results-game">{gameName}</p>

        <div className="game-results-score-ring">
          <svg viewBox="0 0 120 120" className="game-results-ring-svg">
            <circle cx="60" cy="60" r="52" className="game-results-ring-bg" />
            <motion.circle
              cx="60" cy="60" r="52"
              className="game-results-ring-fill"
              style={{ stroke: grade.color }}
              strokeDasharray={`${percentage * 3.267} 326.7`}
              initial={{ strokeDasharray: '0 326.7' }}
              animate={{ strokeDasharray: `${percentage * 3.267} 326.7` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
          <div className="game-results-score-text">
            <motion.span
              className="game-results-score-num"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {percentage}%
            </motion.span>
          </div>
        </div>

        <div className="game-results-stats">
          <div className="game-results-stat">
            <Star size={18} color="var(--accent-amber)" />
            <div>
              <div className="game-results-stat-val">{score}</div>
              <div className="game-results-stat-label">Score</div>
            </div>
          </div>
          <div className="game-results-stat">
            <Zap size={18} color="var(--accent-cyan)" />
            <div>
              <div className="game-results-stat-val">+{xpEarned}</div>
              <div className="game-results-stat-label">XP</div>
            </div>
          </div>
          <div className="game-results-stat">
            <TrendingUp size={18} color="var(--accent-emerald)" />
            <div>
              <div className="game-results-stat-val">Lv.{stats?.difficulty || 1}</div>
              <div className="game-results-stat-label">Level</div>
            </div>
          </div>
        </div>

        <div className="game-results-actions">
          <button className="btn-primary" onClick={onPlayAgain}>
            <RotateCcw size={16} /> Play Again
          </button>
          <button className="btn-secondary" onClick={() => navigate('/games')}>
            <ArrowLeft size={16} /> All Games
          </button>
        </div>
      </motion.div>
    </div>
  );
}
