import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProvider, useUser } from './context/UserContext';
import TabBar from './components/TabBar';
import Onboarding from './components/Onboarding';
import Today from './pages/Today';
import Games from './pages/Games';
import Leagues from './pages/Leagues';
import Me from './pages/Me';
import SettingsPage from './pages/Settings';
import SpeedMath from './games/math/SpeedMath';
import NumberMemory from './games/math/NumberMemory';
import WordScramble from './games/writing/WordScramble';
import GrammarFix from './games/writing/GrammarFix';
import SpeedReader from './games/reading/SpeedReader';
import WordFinder from './games/reading/WordFinder';
import Articulate from './games/speaking/Articulate';
import SequenceMemory from './games/memory/SequenceMemory';
import './App.css';

const GAME_COMPONENTS = {
  'speed-math': SpeedMath,
  'number-memory': NumberMemory,
  'word-scramble': WordScramble,
  'grammar-fix': GrammarFix,
  'speed-reader': SpeedReader,
  'word-finder': WordFinder,
  'articulate': Articulate,
  'sequence-memory': SequenceMemory,
};

function GameRouter() {
  const location = useLocation();
  const gameId = location.pathname.split('/play/')[1];
  const GameComponent = GAME_COMPONENTS[gameId];
  if (!GameComponent) return <div className="game-body"><p>Game not found</p></div>;
  return <GameComponent />;
}

function AppContent() {
  const { userData, isLoading } = useUser();
  const location = useLocation();
  const isGameRoute = location.pathname.startsWith('/play/');

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    );
  }

  if (!userData) {
    return <Onboarding />;
  }

  return (
    <div className="app-main">
      <div className="app-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Today />} />
              <Route path="/games" element={<Games />} />
              <Route path="/leagues" element={<Leagues />} />
              <Route path="/me" element={<Me />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/play/:gameId" element={<GameRouter />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      {!isGameRoute && <TabBar />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}
