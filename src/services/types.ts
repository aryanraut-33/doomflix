import { MarvelTitle } from '../data/marvelCatalogue';

export interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
  avatarUrl?: string;
}

export interface CollectionItem {
  movieId: string; // references marvelCatalogue ID
  sequenceNumber: number;
  priority: 'essential' | 'optional';
  phaseGroup?: string;
  addedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isSystemCollection: boolean;
  items: CollectionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TitleWatchProgress {
  movieId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionDate?: string;
  personalNotes?: string;
  updatedAt: string;
}

export interface EpisodeProgress {
  // key format: `${movieId}_s${seasonNumber}_e${episodeNumber}`
  [key: string]: {
    watched: boolean;
    watchedAt: string;
  };
}

export interface QuizAttemptRecord {
  id: string;
  date: string;
  mode: 'watched_only' | 'full_collection';
  difficulty: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakTopics: string[];
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}
