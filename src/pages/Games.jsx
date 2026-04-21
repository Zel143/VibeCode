import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { GAMES, CATEGORIES } from '../data/games';
import { useUser } from '../context/UserContext';
import GameCard from '../components/GameCard';
import './Games.css';

export default function Games() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const { userData } = useUser();

  const filteredGames = activeCategory === 'all'
    ? GAMES
    : GAMES.filter(g => g.category === activeCategory);

  return (
    <div className="games-page">
      <motion.div
        className="games-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Games</h1>
        <button
          className={`games-stats-toggle ${showStats ? 'active' : ''}`}
          onClick={() => setShowStats(!showStats)}
        >
          <BarChart3 size={16} />
          Stats
        </button>
      </motion.div>

      {/* Category filters */}
      <motion.div
        className="games-categories"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          className={`games-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`games-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ '--cat-color': cat.color }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Games grid */}
      <motion.div className="games-grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredGames.map((game, i) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
            >
              <GameCard game={game} showStats={showStats} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
