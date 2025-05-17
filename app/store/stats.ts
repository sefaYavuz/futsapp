import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserStats {
  goals: number;
  assists: number;
  gamesPlayed: number;
  rating: number;
  currentStreak: number;
  mvpCount: number;
  totalRating: number; // Used to calculate average rating
  ratingCount: number; // Used to calculate average rating
}

interface StatsState {
  stats: UserStats;
  updateStats: (gameStats: Partial<UserStats>) => void;
  addRating: (rating: number) => void;
  resetStats: () => void;
}

const initialStats: UserStats = {
  goals: 0,
  assists: 0,
  gamesPlayed: 0,
  rating: 0,
  currentStreak: 0,
  mvpCount: 0,
  totalRating: 0,
  ratingCount: 0,
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      stats: initialStats,
      updateStats: (gameStats) =>
        set((state) => ({
          stats: {
            ...state.stats,
            ...gameStats,
            // Update current streak
            currentStreak: gameStats.gamesPlayed ? state.stats.currentStreak + 1 : 0,
          },
        })),
      addRating: (rating) =>
        set((state) => {
          const newTotalRating = state.stats.totalRating + rating;
          const newRatingCount = state.stats.ratingCount + 1;
          return {
            stats: {
              ...state.stats,
              totalRating: newTotalRating,
              ratingCount: newRatingCount,
              rating: newTotalRating / newRatingCount,
            },
          };
        }),
      resetStats: () => set({ stats: initialStats }),
    }),
    {
      name: 'futsapp-stats',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 