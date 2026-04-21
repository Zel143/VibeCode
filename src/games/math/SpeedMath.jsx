import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function SpeedMath() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['speed-math'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('speed-math', difficulty);

  const [phase, setPhase] = useState('start'); // start, playing, result
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [totalRounds, setTotalRounds] = useState(params.rounds);

  const generateProblem = useCallback(() => {
    const ops = params.operations;
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, correctAnswer;
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * params.maxNumber) + 1;
        b = Math.floor(Math.random() * params.maxNumber) + 1;
        correctAnswer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * params.maxNumber) + 1;
        b = Math.floor(Math.random() * a) + 1;
        correctAnswer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * Math.min(params.maxNumber, 12)) + 1;
        b = Math.floor(Math.random() * Math.min(params.maxNumber, 12)) + 1;
        correctAnswer = a * b;
        break;
      case '÷':
        b = Math.floor(Math.random() * 11) + 2;
        correctAnswer = Math.floor(Math.random() * 11) + 1;
        a = b * correctAnswer;
        break;
      default:
        a = 1; b = 1; correctAnswer = 2;
    }
    return { a, b, op, answer: correctAnswer, display: `${a} ${op} ${b}` };
  }, [params]);

  const startGame = () => {
    setPhase('playing');
    setRound(1);
    setScore(0);
    setTotalRounds(params.rounds);
    setTimeLeft(params.timeLimit);
    setProblem(generateProblem());
    setAnswer('');
    setFeedback(null);
  };

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const handleSubmit = (timeout = false) => {
    const isCorrect = !timeout && parseInt(answer) === problem.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('correct');
      setFeedback('correct');
    } else {
      playSound('wrong');
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (round >= totalRounds) {
        const finalScore = isCorrect ? score + 1 : score;
        recordGameResult('speed-math', finalScore, totalRounds, finalScore >= totalRounds * 0.7);
        setScore(finalScore);
        setPhase('result');
      } else {
        setRound(prev => prev + 1);
        setTimeLeft(params.timeLimit);
        setProblem(generateProblem());
        setAnswer('');
      }
    }, 600);
  };

  if (phase === 'result') {
    return <GameResults gameId="speed-math" gameName="Speed Math" score={score} maxScore={totalRounds} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Speed Math</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">Score: {score}</span>
            <span className="game-round">{round}/{totalRounds}</span>
            <span className={`game-timer ${timeLeft <= 3 ? 'warning' : ''}`}>
              <Clock size={14} /> {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {phase === 'playing' && (
        <div className="game-progress-bar">
          <div className="game-progress-fill" style={{ width: `${(round / totalRounds) * 100}%` }} />
        </div>
      )}

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">⚡</div>
            <h2 className="game-start-title">Speed Math</h2>
            <p className="game-start-desc">Solve arithmetic problems as fast as you can!</p>
            <p className="game-start-level">Difficulty Level {difficulty} • {params.rounds} rounds • {params.timeLimit}s per problem</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && problem && (
          <motion.div key={round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="game-question">{problem.display} = ?</div>
            <input
              type="number"
              className="game-input"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && answer && handleSubmit()}
              autoFocus
              placeholder="?"
            />
            <button className="btn-primary" onClick={() => handleSubmit()} disabled={!answer} style={{ opacity: answer ? 1 : 0.5 }}>
              Submit
            </button>
            {feedback && (
              <div className={`game-feedback ${feedback}`}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ Answer: ${problem.answer}`}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
