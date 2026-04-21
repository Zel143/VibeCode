import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Clock, Delete } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import { WORD_LISTS } from '../../data/games';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function WordScramble() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['word-scramble'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('word-scramble', difficulty);

  const [phase, setPhase] = useState('start');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const totalRounds = params.rounds;

  const wordPool = useMemo(() => {
    const pool = difficulty <= 3 ? WORD_LISTS.easy : difficulty <= 6 ? WORD_LISTS.medium : WORD_LISTS.hard;
    return pool.filter(w => w.length <= params.wordLength + 2 && w.length >= Math.max(3, params.wordLength - 2));
  }, [difficulty, params]);

  const scrambleWord = useCallback((w) => {
    const letters = w.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    if (letters.join('') === w) return scrambleWord(w);
    return letters;
  }, []);

  const nextRound = useCallback(() => {
    const w = wordPool[Math.floor(Math.random() * wordPool.length)].toUpperCase();
    setWord(w);
    setScrambled(scrambleWord(w).map((l, i) => ({ letter: l, id: i, used: false })));
    setSelected([]);
    setFeedback(null);
    setTimeLeft(params.timeLimit);
  }, [wordPool, scrambleWord, params]);

  const startGame = () => {
    setPhase('playing');
    setRound(1);
    setScore(0);
    nextRound();
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      checkAnswer(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const selectLetter = (tile) => {
    if (tile.used) return;
    playSound('click');
    setScrambled(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t));
    const newSelected = [...selected, tile];
    setSelected(newSelected);

    if (newSelected.length === word.length) {
      setTimeout(() => checkAnswer(false, newSelected), 300);
    }
  };

  const removeLast = () => {
    if (selected.length === 0) return;
    const last = selected[selected.length - 1];
    setSelected(prev => prev.slice(0, -1));
    setScrambled(prev => prev.map(t => t.id === last.id ? { ...t, used: false } : t));
  };

  const checkAnswer = (timeout = false, sel = selected) => {
    const attempt = sel.map(t => t.letter).join('');
    const isCorrect = !timeout && attempt === word;

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
        recordGameResult('word-scramble', finalScore, totalRounds, finalScore >= totalRounds * 0.6);
        setScore(finalScore);
        setPhase('result');
      } else {
        setRound(prev => prev + 1);
        nextRound();
      }
    }, 800);
  };

  if (phase === 'result') {
    return <GameResults gameId="word-scramble" gameName="Word Scramble" score={score} maxScore={totalRounds} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Word Scramble</span>
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
            <div className="game-start-emoji">🔀</div>
            <h2 className="game-start-title">Word Scramble</h2>
            <p className="game-start-desc">Unscramble the letters to form a word!</p>
            <p className="game-start-level">Level {difficulty} • {totalRounds} rounds</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key={round} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <p className="game-question-sm">Unscramble the word:</p>

            <div className="scramble-answer">
              {word.split('').map((_, i) => (
                <div key={i} className="scramble-slot">{selected[i]?.letter || ''}</div>
              ))}
            </div>

            <div className="scramble-tiles">
              {scrambled.map(tile => (
                <motion.div
                  key={tile.id}
                  className={`scramble-tile ${tile.used ? 'used' : ''}`}
                  onClick={() => selectLetter(tile)}
                  whileTap={{ scale: 0.9 }}
                >
                  {tile.letter}
                </motion.div>
              ))}
            </div>

            <button className="btn-secondary" onClick={removeLast} disabled={selected.length === 0}>
              <Delete size={16} /> Undo
            </button>

            {feedback && (
              <div className={`game-feedback ${feedback}`}>
                {feedback === 'correct' ? '✓ Correct!' : `✗ The word was: ${word}`}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
