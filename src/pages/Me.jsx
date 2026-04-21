import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Calendar, Award, Settings, Bell } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, ACHIEVEMENTS, LEAGUE_TIERS } from '../data/games';
import './Me.css';

export default function Me() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const currentTier = LEAGUE_TIERS.find(t => t.id === userData.league.tier) || LEAGUE_TIERS[0];

  // Calculate EPQ (performance quotient)
  const epq = useMemo(() => {
    const catScores = {};
    CATEGORIES.forEach(c => { catScores[c.id] = 0; });
    let total = 0;
    let count = 0;
    Object.entries(userData.gameStats).forEach(([, stats]) => {
      if (stats.gamesPlayed > 0) {
        total += (stats.difficulty / 10) * 100;
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  }, [userData]);

  // Category strengths for radar-like display
  const catStrengths = useMemo(() => {
    return CATEGORIES.map(cat => {
      let strength = 0;
      let count = 0;
      Object.entries(userData.gameStats).forEach(([gameId, stats]) => {
        const game = require('../data/games').GAMES.find(g => g.id === gameId);
        if (game && game.category === cat.id && stats.gamesPlayed > 0) {
          strength += stats.difficulty * 10;
          count++;
        }
      });
      return { ...cat, strength: count > 0 ? Math.round(strength / count) : 0 };
    });
  }, [userData]);

  // Calendar data for current month
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const activity = userData.workoutCalendar[dateKey];
      days.push({ day: d, active: !!activity, xp: activity?.xp || 0, isToday: d === now.getDate() });
    }
    return { days, monthName: now.toLocaleString('default', { month: 'long', year: 'numeric' }) };
  }, [userData]);

  const unlockedAchievements = ACHIEVEMENTS.filter(a => userData.achievements.includes(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !userData.achievements.includes(a.id));

  return (
    <div className="me-page">
      <motion.div
        className="me-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Profile</h1>
        <div className="me-header-actions">
          <button className="me-icon-btn" onClick={() => navigate('/settings')}>
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="me-profile card-static"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="me-avatar">{userData.username[0]?.toUpperCase()}</div>
        <h2 className="me-username">{userData.username}</h2>
        <p className="me-joined">Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="me-stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="me-stat-card">
          <div className="me-stat-icon" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
            <Flame size={20} />
          </div>
          <div className="me-stat-val">{userData.streak.current}</div>
          <div className="me-stat-label">Day Streak</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Trophy size={20} />
          </div>
          <div className="me-stat-val">{currentTier.icon}</div>
          <div className="me-stat-label">{currentTier.name}</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-icon" style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}>
            <Zap size={20} />
          </div>
          <div className="me-stat-val">{userData.xp.total}</div>
          <div className="me-stat-label">Total XP</div>
        </div>
        <div className="me-stat-card">
          <div className="me-stat-icon" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}>
            <Award size={20} />
          </div>
          <div className="me-stat-val">{epq}%</div>
          <div className="me-stat-label">EPQ</div>
        </div>
      </motion.div>

      {/* Category Strengths */}
      <motion.div
        className="me-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="me-section-title">Category Rankings</h3>
        <div className="me-categories card-static">
          {catStrengths.map(cat => (
            <div key={cat.id} className="me-cat-row">
              <span className="me-cat-icon">{cat.icon}</span>
              <span className="me-cat-label">{cat.label}</span>
              <div className="me-cat-bar">
                <motion.div
                  className="me-cat-fill"
                  style={{ background: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.strength}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <span className="me-cat-pct">{cat.strength}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Workout Calendar */}
      <motion.div
        className="me-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="me-section-title">
          <Calendar size={18} />
          {calendarData.monthName}
        </h3>
        <div className="me-calendar card-static">
          <div className="me-cal-header">
            {['S','M','T','W','T','F','S'].map((d,i) => (
              <span key={i} className="me-cal-day-label">{d}</span>
            ))}
          </div>
          <div className="me-cal-grid">
            {calendarData.days.map((d, i) => (
              <div
                key={i}
                className={`me-cal-day ${d?.active ? 'active' : ''} ${d?.isToday ? 'today' : ''} ${!d ? 'empty' : ''}`}
                title={d?.xp ? `${d.xp} XP` : ''}
              >
                {d?.day || ''}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="me-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="me-section-title">Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</h3>
        <div className="me-achievements">
          {unlockedAchievements.map(a => (
            <div key={a.id} className="me-achievement unlocked">
              <span className="me-ach-icon">{a.icon}</span>
              <div>
                <div className="me-ach-name">{a.name}</div>
                <div className="me-ach-desc">{a.description}</div>
              </div>
            </div>
          ))}
          {lockedAchievements.map(a => (
            <div key={a.id} className="me-achievement locked">
              <span className="me-ach-icon">🔒</span>
              <div>
                <div className="me-ach-name">{a.name}</div>
                <div className="me-ach-desc">{a.description}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ height: 'var(--space-3xl)' }} />
    </div>
  );
}
