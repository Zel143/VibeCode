import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function NumberMemory() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['number-memory'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('number-memory', difficulty);

  const [phase, setPhase] = useState('start');
  const [currentDigits, setCurrentDigits] = useState(params.digits);
  const [number, setNumber] = useState('');
  const [answer, setAnswer] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [score, setScore] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const generateNumber = useCallback((digits) => {
    let num = '';
    for (let i = 0; i < digits; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    if (num[0] === '0') num = (Math.floor(Math.random() * 9) + 1).toString() + num.slice(1);
    return num;
  }, []);

  const startGame = () => {
    const digits = params.digits;
    setCurrentDigits(digits);
    const num = generateNumber(digits);
    setNumber(num);
    setShowNumber(true);
    setAnswer('');
    setScore(0);
    setBestRound(0);
    setFeedback(null);
    setPhase('playing');

    setTimeout(() => setShowNumber(false), params.displayTime);
  };

  const handleSubmit = () => {
    if (answer === number) {
      playSound('correct');
      setFeedback('correct');
      const newScore = score + currentDigits;
      setScore(newScore);

      setTimeout(() => {
        setFeedback(null);
        const newDigits = currentDigits + 1;
        setCurrentDigits(newDigits);
        setBestRound(prev => Math.max(prev, currentDigits));
        const num = generateNumber(newDigits);
        setNumber(num);
        setAnswer('');
        setShowNumber(true);
        setTimeout(() => setShowNumber(false), params.displayTime);
      }, 800);
    } else {
      playSound('wrong');
      setFeedback('wrong');
      const finalScore = score + (answer.length > 0 ? Math.max(0, currentDigits - levenshtein(answer, number)) : 0);
      setTimeout(() => {
        recordGameResult('number-memory', finalScore, currentDigits * 3, finalScore >= currentDigits * 2);
        setScore(finalScore);
        setPhase('result');
      }, 1000);
    }
  };

  // Simple Levenshtein distance
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + (a[i-1]!==b[j-1]?1:0));
    return dp[m][n];
  }

  if (phase === 'result') {
    return <GameResults gameId="number-memory" gameName="Number Memory" score={score} maxScore={currentDigits * 3} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Number Memory</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">Score: {score}</span>
            <span className="game-round">{currentDigits} digits</span>
          </div>
        )}
      </div>

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">🔢</div>
            <h2 className="game-start-title">Number Memory</h2>
            <p className="game-start-desc">Remember the number, then type it back. Numbers get longer each round!</p>
            <p className="game-start-level">Starting with {params.digits} digits • Level {difficulty}</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key={currentDigits} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {showNumber ? (
              <>
                <p className="game-question-sm">Remember this number:</p>
                <div className="number-display">{number}</div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', marginTop: 'var(--space-md)' }}>
                  Memorize it before it disappears...
                </p>
              </>
            ) : (
              <>
                <p className="game-question-sm">What was the number?</p>
                <input
                  type="text"
                  className="game-input"
                  value={answer}
                  onChange={e => setAnswer(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && answer && handleSubmit()}
                  autoFocus
                  placeholder="Type the number..."
                  maxLength={currentDigits + 2}
                />
                <button className="btn-primary" onClick={handleSubmit} disabled={!answer} style={{ opacity: answer ? 1 : 0.5 }}>
                  Submit
                </button>
              </>
            )}
            {feedback && (
              <div className={`game-feedback ${feedback}`}>
                {feedback === 'correct' ? '✓ Correct! Next level...' : `✗ The number was: ${number}`}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
