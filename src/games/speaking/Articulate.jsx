import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import { ARTICULATE_TOPICS } from '../../data/games';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function Articulate() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['articulate'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('articulate', difficulty);

  const [phase, setPhase] = useState('start');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [topic, setTopic] = useState('');
  const [timerDone, setTimerDone] = useState(false);
  const totalRounds = 5;

  const topicPool = useMemo(() => {
    return ARTICULATE_TOPICS[params.complexity] || ARTICULATE_TOPICS.simple;
  }, [params]);

  const [usedTopics, setUsedTopics] = useState([]);

  const nextTopic = () => {
    const available = topicPool.filter(t => !usedTopics.includes(t));
    const pool = available.length > 0 ? available : topicPool;
    const t = pool[Math.floor(Math.random() * pool.length)];
    setUsedTopics(prev => [...prev, t]);
    setTopic(t);
    setTimeLeft(params.timeLimit);
    setTimerDone(false);
  };

  const startGame = () => {
    setPhase('playing');
    setRound(1);
    setScore(0);
    setUsedTopics([]);
    nextTopic();
  };

  useEffect(() => {
    if (phase !== 'playing' || timerDone) return;
    if (timeLeft <= 0) {
      setTimerDone(true);
      playSound('complete');
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, timerDone]);

  const handleRating = (rating) => {
    // rating: 0, 1, 2 (poor, ok, great)
    const points = rating;
    setScore(prev => prev + points);
    playSound(rating >= 1 ? 'correct' : 'wrong');

    if (round >= totalRounds) {
      const finalScore = score + points;
      recordGameResult('articulate', finalScore, totalRounds * 2, finalScore >= totalRounds);
      setScore(finalScore);
      setPhase('result');
    } else {
      setRound(prev => prev + 1);
      nextTopic();
    }
  };

  if (phase === 'result') {
    return <GameResults gameId="articulate" gameName="Articulate" score={score} maxScore={totalRounds * 2} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Articulate</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">Score: {score}</span>
            <span className="game-round">{round}/{totalRounds}</span>
          </div>
        )}
      </div>
      {phase === 'playing' && <div className="game-progress-bar"><div className="game-progress-fill" style={{ width: `${(round / totalRounds) * 100}%` }} /></div>}

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">💬</div>
            <h2 className="game-start-title">Articulate</h2>
            <p className="game-start-desc">Explain the topic clearly and concisely. Rate your own performance!</p>
            <p className="game-start-level">Complexity: {params.complexity} • {params.timeLimit}s per topic • Level {difficulty}</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key={round} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500 }}>

            <div className="articulate-topic">{topic}</div>

            <div className={`game-timer ${timeLeft <= 5 && !timerDone ? 'warning' : ''}`} style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
              <Clock size={24} />
              {timerDone ? "Time's up!" : `${timeLeft}s`}
            </div>

            {!timerDone ? (
              <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>
                Speak your explanation out loud. When the timer ends, rate yourself.
              </p>
            ) : (
              <>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                  How well did you explain it?
                </p>
                <div className="articulate-rating">
                  <button className="articulate-rating-btn" onClick={() => handleRating(0)}
                    style={{ borderColor: 'var(--accent-rose)' }}>
                    😕 Poor
                  </button>
                  <button className="articulate-rating-btn" onClick={() => handleRating(1)}
                    style={{ borderColor: 'var(--accent-amber)' }}>
                    🙂 OK
                  </button>
                  <button className="articulate-rating-btn" onClick={() => handleRating(2)}
                    style={{ borderColor: 'var(--accent-emerald)' }}>
                    🤩 Great
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
