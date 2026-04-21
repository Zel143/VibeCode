import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function SequenceMemory() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['sequence-memory'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('sequence-memory', difficulty);

  const [phase, setPhase] = useState('start');
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [currentLength, setCurrentLength] = useState(params.sequenceLength);
  const [activeCell, setActiveCell] = useState(-1);
  const [cellStatus, setCellStatus] = useState({});

  const gridSize = params.gridSize;
  const totalCells = gridSize * gridSize;

  const generateSequence = useCallback((length) => {
    const seq = [];
    for (let i = 0; i < length; i++) {
      let cell;
      do {
        cell = Math.floor(Math.random() * totalCells);
      } while (seq.length > 0 && seq[seq.length - 1] === cell);
      seq.push(cell);
    }
    return seq;
  }, [totalCells]);

  const showSequence = useCallback((seq) => {
    setIsShowingSequence(true);
    setShowingIndex(-1);

    seq.forEach((cell, i) => {
      setTimeout(() => {
        setActiveCell(cell);
        setShowingIndex(i);
      }, (i + 1) * params.displaySpeed);

      setTimeout(() => {
        setActiveCell(-1);
      }, (i + 1) * params.displaySpeed + params.displaySpeed * 0.7);
    });

    setTimeout(() => {
      setIsShowingSequence(false);
      setShowingIndex(-1);
      setActiveCell(-1);
    }, (seq.length + 1) * params.displaySpeed);
  }, [params.displaySpeed]);

  const startGame = () => {
    const len = params.sequenceLength;
    setCurrentLength(len);
    setScore(0);
    setPhase('playing');
    const seq = generateSequence(len);
    setSequence(seq);
    setPlayerSequence([]);
    setCellStatus({});
    showSequence(seq);
  };

  const handleCellClick = (index) => {
    if (isShowingSequence) return;

    const nextExpected = sequence[playerSequence.length];
    const newPlayerSeq = [...playerSequence, index];

    if (index === nextExpected) {
      playSound('click');
      setCellStatus(prev => ({ ...prev, [index]: 'correct' }));
      setTimeout(() => setCellStatus(prev => {
        const n = { ...prev };
        delete n[index];
        return n;
      }), 300);

      setPlayerSequence(newPlayerSeq);

      if (newPlayerSeq.length === sequence.length) {
        // Level complete!
        playSound('correct');
        const newScore = score + currentLength;
        setScore(newScore);

        setTimeout(() => {
          const newLen = currentLength + 1;
          setCurrentLength(newLen);
          const seq = generateSequence(newLen);
          setSequence(seq);
          setPlayerSequence([]);
          setCellStatus({});
          showSequence(seq);
        }, 800);
      }
    } else {
      // Wrong!
      playSound('wrong');
      setCellStatus(prev => ({ ...prev, [index]: 'wrong' }));

      setTimeout(() => {
        recordGameResult('sequence-memory', score, currentLength * 2, score >= currentLength);
        setPhase('result');
      }, 800);
    }
  };

  if (phase === 'result') {
    return <GameResults gameId="sequence-memory" gameName="Sequence Memory" score={score} maxScore={currentLength * 2} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Sequence Memory</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">Score: {score}</span>
            <span className="game-round">Length: {currentLength}</span>
          </div>
        )}
      </div>

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">🧩</div>
            <h2 className="game-start-title">Sequence Memory</h2>
            <p className="game-start-desc">Watch the sequence of tiles light up, then repeat it!</p>
            <p className="game-start-level">{gridSize}×{gridSize} grid • Sequence: {params.sequenceLength} • Level {difficulty}</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="game-question-sm">
              {isShowingSequence ? 'Watch the sequence...' : `Repeat the sequence (${playerSequence.length}/${sequence.length})`}
            </p>

            <div
              className="seq-grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 64px)`,
                gridTemplateRows: `repeat(${gridSize}, 64px)`,
              }}
            >
              {Array.from({ length: totalCells }, (_, i) => (
                <motion.div
                  key={i}
                  className={`seq-cell ${
                    activeCell === i ? 'active' : ''
                  } ${cellStatus[i] || ''}`}
                  onClick={() => handleCellClick(i)}
                  whileTap={{ scale: 0.9 }}
                  style={{ cursor: isShowingSequence ? 'default' : 'pointer' }}
                />
              ))}
            </div>

            {isShowingSequence && (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)', marginTop: 'var(--space-md)' }}>
                {showingIndex + 1} / {sequence.length}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
