import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getDifficultyParams } from '../../utils/difficulty';
import { playSound } from '../../utils/sounds';
import { WORD_LISTS } from '../../data/games';
import GameResults from '../../components/GameResults';
import '../GameStyles.css';

export default function WordFinder() {
  const navigate = useNavigate();
  const { userData, recordGameResult } = useUser();
  const stats = userData.gameStats['word-finder'];
  const difficulty = stats?.difficulty || 1;
  const params = getDifficultyParams('word-finder', difficulty);

  const [phase, setPhase] = useState('start');
  const [grid, setGrid] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  const generateGrid = useCallback(() => {
    const size = params.gridSize;
    const pool = difficulty <= 4 ? WORD_LISTS.easy : difficulty <= 7 ? WORD_LISTS.medium : WORD_LISTS.hard;
    const short = pool.filter(w => w.length <= size);
    const selected = [];
    const shuffled = [...short].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(params.wordCount, shuffled.length); i++) {
      selected.push(shuffled[i].toUpperCase());
    }

    // Create empty grid
    const g = Array.from({ length: size }, () => Array(size).fill(''));

    // Place words horizontally or vertically
    const placed = [];
    for (const word of selected) {
      let attempts = 0;
      let success = false;
      while (attempts < 50 && !success) {
        const dir = Math.random() < 0.5 ? 'h' : 'v';
        const maxR = dir === 'v' ? size - word.length : size - 1;
        const maxC = dir === 'h' ? size - word.length : size - 1;
        const r = Math.floor(Math.random() * (maxR + 1));
        const c = Math.floor(Math.random() * (maxC + 1));

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const cr = dir === 'v' ? r + i : r;
          const cc = dir === 'h' ? c + i : c;
          if (g[cr][cc] !== '' && g[cr][cc] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          const cells = [];
          for (let i = 0; i < word.length; i++) {
            const cr = dir === 'v' ? r + i : r;
            const cc = dir === 'h' ? c + i : c;
            g[cr][cc] = word[i];
            cells.push(`${cr}-${cc}`);
          }
          placed.push({ word, cells });
          success = true;
        }
        attempts++;
      }
    }

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (g[r][c] === '') {
          g[r][c] = letters[Math.floor(Math.random() * 26)];
        }
      }
    }

    return { grid: g, words: placed.map(p => p.word), wordCells: placed };
  }, [params, difficulty]);

  const [wordCells, setWordCells] = useState([]);

  const startGame = () => {
    const { grid: g, words, wordCells: wc } = generateGrid();
    setGrid(g);
    setTargetWords(words);
    setWordCells(wc);
    setFoundWords([]);
    setSelectedCells([]);
    setTimeLeft(params.timeLimit);
    setScore(0);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0 || foundWords.length === targetWords.length) {
      recordGameResult('word-finder', foundWords.length, targetWords.length, foundWords.length >= targetWords.length * 0.5);
      setScore(foundWords.length);
      setPhase('result');
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, foundWords, targetWords]);

  const handleCellClick = (r, c) => {
    const cellKey = `${r}-${c}`;
    const isSelected = selectedCells.includes(cellKey);

    if (isSelected) {
      setSelectedCells(prev => prev.filter(k => k !== cellKey));
      return;
    }

    const newSelected = [...selectedCells, cellKey];
    setSelectedCells(newSelected);

    // Check if selection matches any word
    const selectedWord = newSelected.map(k => {
      const [sr, sc] = k.split('-').map(Number);
      return grid[sr][sc];
    }).join('');

    const match = wordCells.find(wc =>
      !foundWords.includes(wc.word) &&
      wc.cells.length === newSelected.length &&
      wc.cells.every(c => newSelected.includes(c))
    );

    if (match) {
      playSound('correct');
      setFoundWords(prev => [...prev, match.word]);
      setSelectedCells([]);
    } else if (newSelected.length >= Math.max(...targetWords.map(w => w.length))) {
      setSelectedCells([]);
    }
  };

  const clearSelection = () => setSelectedCells([]);

  if (phase === 'result') {
    return <GameResults gameId="word-finder" gameName="Word Finder" score={score} maxScore={targetWords.length} onPlayAgain={startGame} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-header-left">
          <button className="game-back-btn" onClick={() => navigate('/games')}><X size={18} /></button>
          <span className="game-title">Word Finder</span>
        </div>
        {phase === 'playing' && (
          <div className="game-header-right">
            <span className="game-score">{foundWords.length}/{targetWords.length}</span>
            <span className={`game-timer ${timeLeft <= 10 ? 'warning' : ''}`}><Clock size={14} /> {timeLeft}s</span>
          </div>
        )}
      </div>

      <div className="game-body">
        {phase === 'start' && (
          <motion.div className="game-start-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="game-start-emoji">🔍</div>
            <h2 className="game-start-title">Word Finder</h2>
            <p className="game-start-desc">Find hidden words in the grid! Tap letters to select them.</p>
            <p className="game-start-level">{params.gridSize}×{params.gridSize} grid • {params.wordCount} words • Level {difficulty}</p>
            <button className="btn-primary" onClick={startGame}>Start Game</button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="finder-words">
              {targetWords.map(w => (
                <span key={w} className={`finder-word ${foundWords.includes(w) ? 'found' : ''}`}>{w}</span>
              ))}
            </div>

            <div className="finder-grid" style={{
              gridTemplateColumns: `repeat(${grid.length}, 40px)`,
              gridTemplateRows: `repeat(${grid.length}, 40px)`,
            }}>
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key = `${r}-${c}`;
                  const isFound = wordCells.some(wc => foundWords.includes(wc.word) && wc.cells.includes(key));
                  return (
                    <div
                      key={key}
                      className={`finder-cell ${selectedCells.includes(key) ? 'selected' : ''} ${isFound ? 'found' : ''}`}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {cell}
                    </div>
                  );
                })
              )}
            </div>

            {selectedCells.length > 0 && (
              <button className="btn-secondary" onClick={clearSelection} style={{ marginTop: 'var(--space-md)' }}>
                Clear Selection
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
