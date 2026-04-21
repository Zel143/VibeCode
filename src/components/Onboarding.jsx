import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Onboarding.css';

export default function Onboarding() {
  const { initUser } = useUser();
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const handleStart = () => {
    if (name.trim()) {
      initUser(name.trim());
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding-bg">
        <div className="onboarding-orb onboarding-orb-1" />
        <div className="onboarding-orb onboarding-orb-2" />
        <div className="onboarding-orb onboarding-orb-3" />
      </div>

      <motion.div
        className="onboarding-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {step === 0 && (
          <motion.div
            className="onboarding-hero"
            key="hero"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="onboarding-logo-wrap">
              <div className="onboarding-logo">
                <Brain size={48} />
              </div>
              <div className="onboarding-logo-glow" />
            </div>
            <h1 className="onboarding-title">
              <span className="gradient-text">VibeCode</span>
            </h1>
            <p className="onboarding-subtitle">
              Train your brain. Elevate your mind.
            </p>
            <div className="onboarding-features">
              {[
                { icon: '🧠', text: 'Memory & Focus' },
                { icon: '📚', text: 'Reading Speed' },
                { icon: '✍️', text: 'Writing Skills' },
                { icon: '🔢', text: 'Mental Math' },
              ].map((feat, i) => (
                <motion.div
                  key={feat.text}
                  className="onboarding-feature"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="onboarding-feature-icon">{feat.icon}</span>
                  <span>{feat.text}</span>
                </motion.div>
              ))}
            </div>
            <button className="btn-primary onboarding-btn" onClick={() => setStep(1)}>
              Get Started <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            className="onboarding-name"
            key="name"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="onboarding-name-icon">
              <Zap size={36} />
            </div>
            <h2>What's your name?</h2>
            <p className="onboarding-name-sub">We'll personalize your training experience</p>
            <input
              type="text"
              className="onboarding-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              maxLength={20}
              autoFocus
            />
            <button
              className="btn-primary onboarding-btn"
              onClick={handleStart}
              disabled={!name.trim()}
              style={{ opacity: name.trim() ? 1 : 0.5 }}
            >
              Start Training <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
