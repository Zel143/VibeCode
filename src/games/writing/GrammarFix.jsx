import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import { GRAMMAR_SENTENCES } from '../../data/games';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function GrammarFix() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['grammar-fix'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('grammar-fix', difficulty);

  const [phase, setPhase] = useState('start');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sentence, setSentence] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = params.rounds;

  const generateRound = useCallback(() => {
    const pool = [...GRAMMAR_SENTENCES].sort(() => Math.random() - 0.5);
    const s = pool[0];
    const opts = [
      { text: s.correct, isCorrect: true },
      { text: s.wrong, isCorrect: false },
    ].sort(() => Math.random() - 0.5);
    setSentence(s);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(params.timeLimit);
  }, [params]);

  const [usedIndices, setUsedIndices] = useState([]);

  const nextRound = useCallback(() => {
    let available = GRAMMAR_SENTENCES.filter((_, i) => !usedIndices.includes(i));
    if (available.length === 0) {
      setUsedIndices([]);
      available = GRAMMAR_SENTENCES;
    }
    const idx = Math.floor(Math.random() * available.length);
    const realIdx = GRAMMAR_SENTENCES.indexOf(available[idx]);
    setUsedIndices(prev => [...prev, realIdx]);

    const s = available[idx];
    const opts = [
      { text: s.correct, isCorrect: true },
      { text: s.wrong, isCorrect: false },
    ].sort(() => Math.random() - 0.5);
    setSentence(s);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    setTimeLeft(params.timeLimit);
  }, [params, usedIndices]);

  const startGame = () => {
    setPhase('playing');
    setRound(1);
    setScore(0);
    setUsedIndices([]);
    nextRound();
  };

  useEffect(() => {
    if (phase !== 'playing' || selected !== null) return;
    if (timeLeft <= 0) {
      handleSelect(-1);
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, selected]);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);

    const isCorrect = index >= 0 && options[index].isCorrect;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('correct');
      setFeedback('correct');
    } else {
      playSound('wrong');
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        const finalScore = isCorrect ? score + 1 : score;
        recordGameResult('grammar-fix', finalScore, totalRounds, finalScore >= totalRounds * 0.6);
        setScore(finalScore);
        setPhase('result');
      } else {
        setRound(prev => prev + 1);
        nextRound();
      }
    }, 1200);
  };

  if (phase === 'result') {
    return <GameResults gameId="grammar-fix" gameName="Grammar Fix" score={score} maxScore={totalRounds} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Grammar Fix</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">Score: {score}</span>
            <span className="game-round">{round}/{totalRounds}</span>
            <span className={`game-timer ${timeLeft <= 5 ? 'warning' : ''}`}><Clock size={14} /> {timeLeft}s</span>
          </div>
        )}
      </div>
      {phase === 'playing' && <div className="game-progress-bar"><div className="game-progress-fill" style={{ width: `${(round / totalRounds) * 100}%` }} /></div>}

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">✏️</div>
            <h2 className="game-start-title">Grammar Fix</h2>
            <p className="game-start-desc">Choose the grammatically correct sentence!</p>
            <p className="game-start-level">Level {difficulty} • {totalRounds} rounds</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && sentence && (
          <motion.div key={round} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500 }}>
            <p className="game-question-sm">Which sentence is correct?</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%', marginTop: 'var(--space-md)' }}>
              {options.map((opt, i) => (
                <button
                  key={i}
                  className={`game-option-btn ${
                    selected !== null
                      ? opt.isCorrect ? 'correct' : (selected === i ? 'wrong' : '')
                      : ''
                  }`}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  style={{ textAlign: 'left', padding: 'var(--space-md) var(--space-lg)' }}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {feedback && sentence && (
              <div className={`game-feedback ${feedback}`} style={{ marginTop: 'var(--space-md)' }}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ Error type: ${sentence.error}`}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
