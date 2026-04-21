import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Moon, Sun, RotateCcw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CATEGORIES } from '../data/games';
import './Settings.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { userData, updateUser } = useUser();
  const [showReset, setShowReset] = useState(false);

  const toggleSetting = (key) => {
    updateUser(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: !prev.settings[key] }
    }));
  };

  const setWorkoutLength = (len) => {
    updateUser(prev => ({
      ...prev,
      settings: { ...prev.settings, workoutLength: len }
    }));
  };

  const toggleGoal = (catId) => {
    updateUser(prev => {
      const goals = prev.settings.trainingGoals.includes(catId)
        ? prev.settings.trainingGoals.filter(g => g !== catId)
        : [...prev.settings.trainingGoals, catId];
      return { ...prev, settings: { ...prev.settings, trainingGoals: goals.length > 0 ? goals : prev.settings.trainingGoals } };
    });
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="settings-page">
      <motion.div
        className="settings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="me-icon-btn" onClick={() => navigate('/me')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
        <div style={{ width: 40 }} />
      </motion.div>

      {/* Workout Length */}
      <motion.div className="settings-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="settings-section-title">Workout Length</h3>
        <div className="settings-workout-options">
          {[3, 5, 7].map(n => (
            <button
              key={n}
              className={`settings-workout-btn ${userData.settings.workoutLength === n ? 'active' : ''}`}
              onClick={() => setWorkoutLength(n)}
            >
              {n} games
            </button>
          ))}
        </div>
      </motion.div>

      {/* Training Goals */}
      <motion.div className="settings-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="settings-section-title">Training Goals</h3>
        <p className="settings-section-sub">Select the skills you want to focus on</p>
        <div className="settings-goals">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`settings-goal-btn ${userData.settings.trainingGoals.includes(cat.id) ? 'active' : ''}`}
              onClick={() => toggleGoal(cat.id)}
              style={{ '--goal-color': cat.color }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div className="settings-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="settings-toggle-row" onClick={() => toggleSetting('soundEffects')}>
          <div className="settings-toggle-info">
            {userData.settings.soundEffects ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>Sound Effects</span>
          </div>
          <div className={`settings-toggle ${userData.settings.soundEffects ? 'on' : ''}`}>
            <div className="settings-toggle-knob" />
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div className="settings-section settings-danger" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="settings-section-title">Danger Zone</h3>
        {!showReset ? (
          <button className="settings-reset-btn" onClick={() => setShowReset(true)}>
            <Trash2 size={16} />
            Reset All Progress
          </button>
        ) : (
          <div className="settings-confirm">
            <p>Are you sure? This cannot be undone!</p>
            <div className="settings-confirm-btns">
              <button className="btn-secondary" onClick={() => setShowReset(false)}>Cancel</button>
              <button className="settings-delete-btn" onClick={handleReset}>Delete Everything</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
