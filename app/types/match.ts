export type PlayerRole = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface PlayerStats {
  goals: number;
  assists: number;
  saves?: number; // For goalkeepers
  yellowCards: number;
  redCards: number;
  isMVP: boolean;
  rating?: number; // 1-5 rating
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isAvailable: boolean;
  stats?: PlayerStats;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  players: string[];
  createdBy: string;
  createdAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  goals?: number;
  assists?: number;
  isMVP?: boolean;
  rating?: number;
}

export interface CreateMatchData {
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
}

export interface MatchFormErrors {
  date?: string;
  time?: string;
  location?: string;
  maxPlayers?: string;
}

export const validateMatchForm = (data: CreateMatchData): MatchFormErrors => {
  const errors: MatchFormErrors = {};

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.time) {
    errors.time = 'Time is required';
  }

  if (!data.location) {
    errors.location = 'Location is required';
  }

  if (!data.maxPlayers || data.maxPlayers < 2) {
    errors.maxPlayers = 'Maximum players must be at least 2';
  }

  return errors;
}; 