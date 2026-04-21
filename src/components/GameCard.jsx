import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Play } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './GameCard.css';

export default function GameCard({ game, showStats = false, compact = false }) {
  const navigate = useNavigate();
  const { userData, toggleFavorite } = useUser();
  const stats = userData?.gameStats[game.id];
  const isFavorite = userData?.favorites.includes(game.id);

  const handlePlay = () => {
    navigate(`/play/${game.id}`);
  };

  return (
    <motion.div
      className={`game-card ${compact ? 'game-card-compact' : ''}`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePlay}
      style={{ '--game-color': game.color }}
    >
      <div className="game-card-glow" style={{ background: game.color }} />
      <div className="game-card-content">
        <div className="game-card-header">
          <div className="game-card-emoji">{game.emoji}</div>
          {!compact && (
            <button
              className={`game-card-fav ${isFavorite ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }}
            >
              <Heart size={16} fill={isFavorite ? 'var(--accent-rose)' : 'none'} />
            </button>
          )}
        </div>
        <h3 className="game-card-name">{game.name}</h3>
        {!compact && <p className="game-card-desc">{game.description}</p>}

        {showStats && stats && (
          <div className="game-card-stats">
            <div className="game-card-stat">
              <Star size={12} />
              <span>{stats.highScore}</span>
            </div>
            <div className="game-card-stat">
              <span className="game-card-diff">Lv.{stats.difficulty}</span>
            </div>
          </div>
        )}

        {!compact && (
          <div className="game-card-play">
            <Play size={14} />
            <span>Play</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
