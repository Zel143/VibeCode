import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadUserData, saveUserData, createNewUser, recordActivity } from '../utils/storage';
import { updateDifficulty, calculateXP } from '../utils/difficulty';
import { ACHIEVEMENTS } from '../data/games';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = loadUserData();
    setUserData(data);
    setIsLoading(false);
  }, []);

  const initUser = useCallback((username) => {
    const data = createNewUser(username);
    setUserData({ ...data });
  }, []);

  const updateUser = useCallback((updater) => {
    setUserData(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveUserData(updated);
      return { ...updated };
    });
  }, []);

  const recordGameResult = useCallback((gameId, score, maxScore, wasSuccessful) => {
    setUserData(prev => {
      if (!prev) return prev;
      const newData = { ...prev };

      // Initialize game stats if needed
      if (!newData.gameStats[gameId]) {
        newData.gameStats[gameId] = {
          highScore: 0, gamesPlayed: 0, totalScore: 0,
          difficulty: 1, consecutiveCorrect: 0, consecutiveWrong: 0, lastPlayed: null,
        };
      }

      // Update difficulty
      updateDifficulty(newData.gameStats[gameId], wasSuccessful);

      // Calculate and record XP
      const xpEarned = calculateXP(score, newData.gameStats[gameId].difficulty, maxScore);
      const updated = recordActivity(newData, gameId, score, xpEarned);

      // Check achievements
      checkAchievements(updated);

      return { ...updated };
    });
  }, []);

  const checkAchievements = (data) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!data.achievements.includes(achievement.id) && achievement.condition(data)) {
        data.achievements.push(achievement.id);
      }
    });
  };

  const toggleFavorite = useCallback((gameId) => {
    setUserData(prev => {
      const updated = { ...prev };
      if (updated.favorites.includes(gameId)) {
        updated.favorites = updated.favorites.filter(id => id !== gameId);
      } else {
        updated.favorites.push(gameId);
      }
      saveUserData(updated);
      return { ...updated };
    });
  }, []);

  const value = {
    userData,
    isLoading,
    initUser,
    updateUser,
    recordGameResult,
    toggleFavorite,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
