import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Match } from '../types/match';
import { useUserStore } from './user';

const predefinedMatches: Match[] = [
  {
    id: '1',
    date: '2024-04-15',
    time: '19:00',
    location: 'Futsal Arena Downtown',
    maxPlayers: 10,
    players: ['1', '2', '3'],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    status: 'scheduled',
  },
  {
    id: '2',
    date: '2024-04-16',
    time: '20:00',
    location: 'Sports Center West',
    maxPlayers: 8,
    players: ['1', '4'],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    status: 'scheduled',
  },
  {
    id: '3',
    date: '2024-04-17',
    time: '18:30',
    location: 'Futsal Club East',
    maxPlayers: 12,
    players: [],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    status: 'scheduled',
  },
];

interface MatchesState {
  matches: Match[];
  addMatch: (match: Match) => void;
  updateMatch: (id: string, match: Match) => void;
  deleteMatch: (id: string) => void;
  canEditMatch: (matchId: string) => boolean;
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set, get) => ({
      matches: predefinedMatches,
      addMatch: (match) =>
        set((state) => ({
          matches: [...state.matches, match],
        })),
      updateMatch: (id, match) =>
        set((state) => ({
          matches: state.matches.map((m) => (m.id === id ? match : m)),
        })),
      deleteMatch: (id) =>
        set((state) => ({
          matches: state.matches.filter((m) => m.id !== id),
        })),
      canEditMatch: (matchId) => {
        const match = get().matches.find((m) => m.id === matchId);
        const currentUser = useUserStore.getState().currentUser;
        return (
          match?.createdBy === currentUser?.id ||
          currentUser?.role === 'admin' ||
          currentUser?.role === 'organizer'
        );
      },
    }),
    {
      name: 'futsapp-matches',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 