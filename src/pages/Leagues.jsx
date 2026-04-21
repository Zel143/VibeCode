import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { LEAGUE_TIERS } from '../data/games';
import './Leagues.css';

export default function Leagues() {
  const { userData } = useUser();
  const currentTier = LEAGUE_TIERS.find(t => t.id === userData.league.tier) || LEAGUE_TIERS[0];
  const nextTier = LEAGUE_TIERS[LEAGUE_TIERS.indexOf(currentTier) + 1];

  const leaderboard = useMemo(() => {
    const players = [
      { name: userData.username, xp: userData.xp.weekly, isUser: true, avatar: userData.username[0]?.toUpperCase() },
      ...userData.league.opponents.map(o => ({ ...o, isUser: false })),
    ].sort((a, b) => b.xp - a.xp)
     .map((p, i) => ({ ...p, rank: i + 1 }));
    return players;
  }, [userData]);

  const userRank = leaderboard.find(p => p.isUser)?.rank || 10;
  const promotionZone = 3;
  const demotionZone = 8;

  const getZone = (rank) => {
    if (rank <= promotionZone) return 'promotion';
    if (rank >= demotionZone) return 'demotion';
    return 'safe';
  };

  const daysLeft = () => {
    const now = new Date();
    const day = now.getDay();
    return day === 0 ? 1 : 7 - day + 1;
  };

  return (
    <div className="leagues-page">
      <motion.div
        className="leagues-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Leagues</h1>
        <span className="leagues-timer">{daysLeft()} days left</span>
      </motion.div>

      {/* Current League */}
      <motion.div
        className="leagues-current"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="leagues-tier-icon">{currentTier.icon}</div>
        <div className="leagues-tier-info">
          <h2>{currentTier.name} League</h2>
          <p className="leagues-tier-sub">
            {userRank <= promotionZone && nextTier
              ? `Promotion zone! Keep it up to reach ${nextTier.name}!`
              : userRank >= demotionZone
              ? 'Danger zone! Play more to avoid demotion.'
              : 'Keep playing to climb the leaderboard!'}
          </p>
        </div>
        <div className="leagues-rank">
          <span className="leagues-rank-num">#{userRank}</span>
        </div>
      </motion.div>

      {/* Weekly XP */}
      <motion.div
        className="leagues-xp-card card-static"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="leagues-xp-header">
          <span>Weekly XP</span>
          <span className="leagues-xp-val">{userData.xp.weekly} XP</span>
        </div>
        <div className="leagues-xp-bar">
          <motion.div
            className="leagues-xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (userData.xp.weekly / (nextTier?.minXP || 1000)) * 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        {nextTier && (
          <p className="leagues-xp-next">{nextTier.minXP - userData.xp.weekly} XP to {nextTier.name}</p>
        )}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        className="leagues-board"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="leagues-board-title">Leaderboard</h3>
        <div className="leagues-board-list">
          {leaderboard.map((player, i) => (
            <motion.div
              key={player.name}
              className={`leagues-player ${player.isUser ? 'is-user' : ''} zone-${getZone(player.rank)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.04 }}
            >
              <span className="leagues-player-rank">
                {player.rank <= 3 ? ['🥇','🥈','🥉'][player.rank - 1] : `#${player.rank}`}
              </span>
              <div className="leagues-player-avatar">{player.avatar || player.name[0]}</div>
              <span className="leagues-player-name">
                {player.name} {player.isUser && <span className="leagues-you-badge">You</span>}
              </span>
              <span className="leagues-player-xp">{player.xp} XP</span>
              <span className="leagues-player-zone">
                {getZone(player.rank) === 'promotion' && <TrendingUp size={14} color="var(--accent-emerald)" />}
                {getZone(player.rank) === 'demotion' && <TrendingDown size={14} color="var(--accent-rose)" />}
                {getZone(player.rank) === 'safe' && <Minus size={14} color="var(--text-tertiary)" />}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="leagues-legend">
        <div className="leagues-legend-item">
          <TrendingUp size={12} color="var(--accent-emerald)" />
          <span>Promotion Zone (Top 3)</span>
        </div>
        <div className="leagues-legend-item">
          <TrendingDown size={12} color="var(--accent-rose)" />
          <span>Demotion Zone (Bottom 3)</span>
        </div>
      </div>
    </div>
  );
}
