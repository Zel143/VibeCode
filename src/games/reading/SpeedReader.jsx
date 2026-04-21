import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import { SPEED_READER_PASSAGES } from '../../data/games';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function SpeedReader() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['speed-reader'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('speed-reader', difficulty);

  const [phase, setPhase] = useState('start'); // start, reading, questions, result
  const [passage, setPassage] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const words = useMemo(() => passage?.text.split(' ') || [], [passage]);
  const totalQuestions = passage?.questions.length || 3;

  const startGame = () => {
    const p = SPEED_READER_PASSAGES[Math.floor(Math.random() * SPEED_READER_PASSAGES.length)];
    setPassage(p);
    setWordIndex(0);
    setCurrentQuestion(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setPhase('reading');
  };

  // Auto-scroll words at WPM rate
  useEffect(() => {
    if (phase !== 'reading') return;
    if (wordIndex >= words.length) {
      setPhase('questions');
      return;
    }
    const msPerWord = (60 / params.wpm) * 1000;
    const t = setTimeout(() => setWordIndex(prev => prev + 1), msPerWord);
    return () => clearTimeout(t);
  }, [wordIndex, phase, words, params.wpm]);

  const handleAnswer = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === passage.questions[currentQuestion].answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('correct');
      setFeedback('correct');
    } else {
      playSound('wrong');
      setFeedback('wrong');
    }

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      if (currentQuestion + 1 >= totalQuestions) {
        const finalScore = isCorrect ? score + 1 : score;
        recordGameResult('speed-reader', finalScore, totalQuestions, finalScore >= totalQuestions * 0.6);
        setScore(finalScore);
        setPhase('result');
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1000);
  };

  const skipReading = () => {
    setPhase('questions');
  };

  if (phase === 'result') {
    return <GameResults gameId="speed-reader" gameName="Speed Reader" score={score} maxScore={totalQuestions} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Speed Reader</span>
        </div>
        <div className="game-header-right">
          {phase === 'reading' && <span className="game-round">{params.wpm} WPM</span>}
          {phase === 'questions' && <span className="game-round">Q{currentQuestion + 1}/{totalQuestions}</span>}
        </div>
      </div>

      {phase === 'reading' && (
        <div className="game-progress-bar">
          <div className="game-progress-fill" style={{ width: `${(wordIndex / words.length) * 100}%` }} />
        </div>
      )}

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">📚</div>
            <h2 className="game-start-title">Speed Reader</h2>
            <p className="game-start-desc">Read the passage quickly, then answer comprehension questions!</p>
            <p className="game-start-level">Speed: {params.wpm} WPM • Level {difficulty}</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'reading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <p className="game-question-sm">Read carefully — comprehension questions will follow</p>
            <div className="reader-passage">
              {words.map((word, i) => (
                <span
                  key={i}
                  className={i === wordIndex ? 'reader-word-highlight' : ''}
                  style={{ opacity: i <= wordIndex ? 1 : 0.3, transition: 'opacity 0.15s' }}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
            <button className="btn-secondary" onClick={skipReading} style={{ marginTop: 'var(--space-md)' }}>
              I'm done reading →
            </button>
          </motion.div>
        )}

        {phase === 'questions' && passage && (
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500 }}>
            <p className="game-question-sm" style={{ marginBottom: 'var(--space-lg)' }}>
              {passage.questions[currentQuestion].q}
            </p>
            <div className="game-options" style={{ gridTemplateColumns: '1fr', maxWidth: 400 }}>
              {passage.questions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  className={`game-option-btn ${
                    selected !== null
                      ? i === passage.questions[currentQuestion].answer ? 'correct' : (selected === i ? 'wrong' : '')
                      : ''
                  }`}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
            {feedback && (
              <div className={`game-feedback ${feedback}`}>
                {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong answer'}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
