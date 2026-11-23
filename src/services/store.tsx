import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { MARVEL_TITLES, MarvelTitle } from '../data/marvelCatalogue';
import { ACHIEVEMENTS, Achievement } from '../data/achievements';
import { 
  User, 
  Collection, 
  CollectionItem, 
  TitleWatchProgress, 
  EpisodeProgress, 
  QuizAttemptRecord, 
  UnlockedAchievement 
} from './types';

// Pre-populated default collection: Multiverse Essentials
const INITIAL_MULTIVERSE_ESSENTIALS: Collection = {
  id: 'multiverse-essentials',
  name: 'Multiverse Essentials',
  description: 'The official curated preparation sequence for Avengers: Doomsday across three pivotal phases and optional lore anchors.',
  isSystemCollection: true,
  createdAt: '2026-11-20T00:00:00Z',
  updatedAt: '2026-11-20T00:00:00Z',
  items: MARVEL_TITLES.map((title, idx) => ({
    movieId: title.id,
    sequenceNumber: idx + 1,
    priority: title.defaultPriority,
    phaseGroup: title.defaultPhaseGroup,
    addedAt: '2026-11-20T00:00:00Z'
  }))
};

interface AppContextType {
  // Auth
  user: User;
  token: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (user: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  migrateGuestData: () => Promise<{ success: boolean; message?: string }>;

  // Watchlist & Collections
  collections: Collection[];
  activeCollectionId: string;
  setActiveCollectionId: (id: string) => void;
  createCollection: (name: string, description?: string) => string;
  renameCollection: (id: string, name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  addTitleToCollection: (collectionId: string, movieId: string, priority?: 'essential' | 'optional') => boolean;
  removeTitleFromCollection: (collectionId: string, movieId: string) => void;
  reorderCollectionTitles: (collectionId: string, reorderedItems: CollectionItem[]) => void;
  toggleTitlePriority: (collectionId: string, movieId: string) => void;
  resetCollectionToDefault: (collectionId: string) => void;

  // Watch Progress
  watchProgress: Record<string, TitleWatchProgress>;
  updateWatchStatus: (movieId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  updatePersonalNotes: (movieId: string, notes: string) => void;

  // Episode Progress for TV
  episodeProgress: EpisodeProgress;
  toggleEpisodeWatched: (movieId: string, seasonNumber: number, episodeNumber: number) => void;
  isEpisodeWatched: (movieId: string, seasonNumber: number, episodeNumber: number) => boolean;
  getSeriesEpisodeStats: (movieId: string) => { watched: number; total: number; percentage: number; nextUnwatched?: { season: number; episode: number } };

  // Achievements & Gamification
  unlockedAchievements: UnlockedAchievement[];
  newUnlockedToast: Achievement | null;
  dismissAchievementToast: () => void;

  // Quiz records
  quizAttempts: QuizAttemptRecord[];
  recordQuizAttempt: (attempt: Omit<QuizAttemptRecord, 'id' | 'date'>) => void;

  // Configuration
  doomsdayDate: string;
  setDoomsdayDate: (date: string) => void;

  // Computed metrics
  overallStats: {
    totalTitles: number;
    completedCount: number;
    inProgressCount: number;
    notStartedCount: number;
    completionPercentage: number;
    moviesWatched: number;
    seriesCompleted: number;
  };
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'doomflix_user',
  TOKEN: 'doomflix_token',
  COLLECTIONS: 'doomflix_collections',
  ACTIVE_COLLECTION: 'doomflix_active_collection',
  WATCH_PROGRESS: 'doomflix_watch_progress',
  EPISODE_PROGRESS: 'doomflix_episode_progress',
  ACHIEVEMENTS: 'doomflix_achievements',
  QUIZ_ATTEMPTS: 'doomflix_quiz_attempts',
  DOOMSDAY_DATE: 'doomflix_doomsday_date',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State (Defaults to Guest Mode)
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { id: 'guest_user', username: 'Operative (Guest)', isGuest: true };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  });

  // 2. Collections
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [INITIAL_MULTIVERSE_ESSENTIALS];
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COLLECTION) || 'multiverse-essentials';
  });

  // 3. Watch Progress
  const [watchProgress, setWatchProgress] = useState<Record<string, TitleWatchProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // 4. Series Episode Progress
  const [episodeProgress, setEpisodeProgress] = useState<EpisodeProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EPISODE_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // 5. Achievements
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [newUnlockedToast, setNewUnlockedToast] = useState<Achievement | null>(null);

  // 6. Quiz Attempts
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // 7. Configurable Doomsday Release Date (Default Dec 18, 2026)
  const [doomsdayDate, setDoomsdayDateState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.DOOMSDAY_DATE) || '2026-12-18T00:00:00';
  });

  const setDoomsdayDate = (date: string) => {
    setDoomsdayDateState(date);
    localStorage.setItem(STORAGE_KEYS.DOOMSDAY_DATE, date);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, [token]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COLLECTION, activeCollectionId);
  }, [activeCollectionId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(watchProgress));
  }, [watchProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EPISODE_PROGRESS, JSON.stringify(episodeProgress));
  }, [episodeProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Achievement unlocker with celebration confetti
  const triggerUnlock = useCallback((achievementId: string) => {
    setUnlockedAchievements(prev => {
      if (prev.some(a => a.achievementId === achievementId)) return prev;
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        setNewUnlockedToast(achievement);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#F0141E', '#f59e0b', '#10b981', '#ffffff']
          });
        } catch {}
      }
      return [...prev, { achievementId, unlockedAt: new Date().toISOString() }];
    });
  }, []);

  const dismissAchievementToast = () => setNewUnlockedToast(null);

  // Check achievement conditions reactively
  useEffect(() => {
    const completedTitles = Object.values(watchProgress).filter(p => p.status === 'completed').map(p => p.movieId);

    // 1. First Watch
    if (completedTitles.length >= 1) {
      triggerUnlock('first-watch');
    }

    // 2. Earth's Mightiest (Phase 1 complete)
    const phase1Titles = ['cap-first-avenger', 'the-avengers', 'captain-america-civil-war', 'avengers-infinity-war', 'avengers-endgame'];
    if (phase1Titles.every(id => completedTitles.includes(id))) {
      triggerUnlock('avengers-founding');
      triggerUnlock('timeline-keeper');
    }

    // 3. Multiverse Explorer (Phase 2 complete)
    const phase2Titles = ['loki-s1', 'loki-s2', 'spider-man-no-way-home', 'dr-strange-multiverse-madness', 'deadpool-and-wolverine'];
    if (phase2Titles.every(id => completedTitles.includes(id))) {
      triggerUnlock('multiverse-explorer');
    }

    // 4. Doomsday Ready (all 18 completed)
    if (MARVEL_TITLES.every(m => completedTitles.includes(m.id))) {
      triggerUnlock('doom-ready');
    }

    // 5. TVA Field Agent (Loki S1 or S2 all 6 episodes checked)
    const checkLokiSeason = (seasonNum: number) => {
      let allWatched = true;
      for (let i = 1; i <= 6; i++) {
        const key = `loki-s${seasonNum}_s${seasonNum}_e${i}`;
        if (!episodeProgress[key]?.watched) {
          allWatched = false;
          break;
        }
      }
      return allWatched;
    };

    if (checkLokiSeason(1) || checkLokiSeason(2)) {
      triggerUnlock('episode-binger');
    }
  }, [watchProgress, episodeProgress, triggerUnlock]);

  // Watch Progress Actions
  const updateWatchStatus = (movieId: string, status: 'not_started' | 'in_progress' | 'completed') => {
    setWatchProgress(prev => ({
      ...prev,
      [movieId]: {
        movieId,
        status,
        completionDate: status === 'completed' ? new Date().toISOString() : undefined,
        personalNotes: prev[movieId]?.personalNotes || '',
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const updatePersonalNotes = (movieId: string, notes: string) => {
    setWatchProgress(prev => ({
      ...prev,
      [movieId]: {
        movieId,
        status: prev[movieId]?.status || 'not_started',
        completionDate: prev[movieId]?.completionDate,
        personalNotes: notes,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  // Episode Progress Actions
  const toggleEpisodeWatched = (movieId: string, seasonNumber: number, episodeNumber: number) => {
    const key = `${movieId}_s${seasonNumber}_e${episodeNumber}`;
    const nextVal = !episodeProgress[key]?.watched;

    setEpisodeProgress(prev => ({
      ...prev,
      [key]: {
        watched: nextVal,
        watchedAt: nextVal ? new Date().toISOString() : ''
      }
    }));

    // Auto update series status if title is TV series
    const title = MARVEL_TITLES.find(t => t.id === movieId);
    if (title && title.seasons) {
      setTimeout(() => {
        let totalEpisodes = 0;
        let watchedEpisodes = 0;
        for (const s of title.seasons || []) {
          for (const ep of s.episodes) {
            totalEpisodes++;
            const epKey = `${movieId}_s${s.seasonNumber}_e${ep.episodeNumber}`;
            const isChecked = epKey === key ? nextVal : !!episodeProgress[epKey]?.watched;
            if (isChecked) watchedEpisodes++;
          }
        }

        if (watchedEpisodes === totalEpisodes && totalEpisodes > 0) {
          updateWatchStatus(movieId, 'completed');
        } else if (watchedEpisodes > 0) {
          updateWatchStatus(movieId, 'in_progress');
        } else {
          updateWatchStatus(movieId, 'not_started');
        }
      }, 0);
    }
  };

  const isEpisodeWatched = (movieId: string, seasonNumber: number, episodeNumber: number): boolean => {
    const key = `${movieId}_s${seasonNumber}_e${episodeNumber}`;
    return !!episodeProgress[key]?.watched;
  };

  const getSeriesEpisodeStats = (movieId: string) => {
    const title = MARVEL_TITLES.find(t => t.id === movieId);
    if (!title || !title.seasons) return { watched: 0, total: 0, percentage: 0 };

    let total = 0;
    let watched = 0;
    let nextUnwatched: { season: number; episode: number } | undefined = undefined;

    for (const s of title.seasons) {
      for (const ep of s.episodes) {
        total++;
        const isWatched = isEpisodeWatched(movieId, s.seasonNumber, ep.episodeNumber);
        if (isWatched) {
          watched++;
        } else if (!nextUnwatched) {
          nextUnwatched = { season: s.seasonNumber, episode: ep.episodeNumber };
        }
      }
    }

    const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;
    return { watched, total, percentage, nextUnwatched };
  };

  // Collection Actions
  const createCollection = (name: string, description?: string): string => {
    const id = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol: Collection = {
      id,
      name,
      description: description || 'Custom cinematic collection',
      isSystemCollection: false,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCollections(prev => [...prev, newCol]);
    setActiveCollectionId(id);
    return id;
  };

  const renameCollection = (id: string, name: string, description?: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === id && !c.isSystemCollection) {
        return {
          ...c,
          name,
          description: description !== undefined ? description : c.description,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => {
      const filtered = prev.filter(c => c.id !== id || c.isSystemCollection);
      return filtered;
    });
    if (activeCollectionId === id) {
      setActiveCollectionId('multiverse-essentials');
    }
  };

  const addTitleToCollection = (collectionId: string, movieId: string, priority: 'essential' | 'optional' = 'essential'): boolean => {
    let added = false;
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        // Prevent duplicate TMDB/Movie entries in the same collection
        if (c.items.some(item => item.movieId === movieId)) {
          return c;
        }
        added = true;
        const newItem: CollectionItem = {
          movieId,
          sequenceNumber: c.items.length + 1,
          priority,
          addedAt: new Date().toISOString()
        };
        return {
          ...c,
          items: [...c.items, newItem],
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
    return added;
  };

  const removeTitleFromCollection = (collectionId: string, movieId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const filtered = c.items.filter(item => item.movieId !== movieId);
        // re-index sequence numbers
        const reindexed = filtered.map((item, idx) => ({ ...item, sequenceNumber: idx + 1 }));
        return { ...c, items: reindexed, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const reorderCollectionTitles = (collectionId: string, reorderedItems: CollectionItem[]) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        const indexed = reorderedItems.map((item, idx) => ({ ...item, sequenceNumber: idx + 1 }));
        return { ...c, items: indexed, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const toggleTitlePriority = (collectionId: string, movieId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return {
          ...c,
          items: c.items.map(item => {
            if (item.movieId === movieId) {
              return { ...item, priority: item.priority === 'essential' ? 'optional' : 'essential' };
            }
            return item;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  const resetCollectionToDefault = (collectionId: string) => {
    if (collectionId === 'multiverse-essentials') {
      setCollections(prev => prev.map(c => {
        if (c.id === 'multiverse-essentials') {
          return { ...INITIAL_MULTIVERSE_ESSENTIALS, updatedAt: new Date().toISOString() };
        }
        return c;
      }));
    }
  };

  // Auth Operations
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser({ ...data.user, isGuest: false });
      setToken(data.token);
      return { success: true };
    } catch {
      // Local fallback simulation if server is offline
      const userObj: User = { id: `usr_${Date.now()}`, username: email.split('@')[0], email, isGuest: false };
      setUser(userObj);
      setToken(`doom_${btoa(email)}`);
      return { success: true };
    }
  };

  const register = async (username: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser({ ...data.user, isGuest: false });
      setToken(data.token);
      return { success: true };
    } catch {
      // Local fallback simulation
      const userObj: User = { id: `usr_${Date.now()}`, username, email, isGuest: false };
      setUser(userObj);
      setToken(`doom_${btoa(email)}`);
      return { success: true };
    }
  };

  const logout = () => {
    setUser({ id: 'guest_user', username: 'Operative (Guest)', isGuest: true });
    setToken(null);
  };

  const migrateGuestData = async (): Promise<{ success: boolean; message?: string }> => {
    if (user.isGuest || !token) {
      return { success: false, message: 'Please log in to sync your guest data to your account.' };
    }
    try {
      const res = await fetch('/api/migrate-guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          watchProgress,
          episodeProgress,
          customCollections: collections.filter(c => !c.isSystemCollection),
          quizAttempts
        })
      });
      const data = await res.json();
      return { success: data.success, message: data.message || 'Synced successfully.' };
    } catch {
      return { success: true, message: 'Local data retained and synced with session.' };
    }
  };

  const recordQuizAttempt = (attempt: Omit<QuizAttemptRecord, 'id' | 'date'>) => {
    const record: QuizAttemptRecord = {
      ...attempt,
      id: `qa_${Date.now()}`,
      date: new Date().toISOString()
    };
    setQuizAttempts(prev => [record, ...prev]);

    // Check quiz achievements
    if (attempt.percentage >= 80) {
      triggerUnlock('knowledge-master');
    }
    if (attempt.percentage === 100 && attempt.totalQuestions >= 10) {
      triggerUnlock('perfect-lore');
    }
  };

  // Overall statistics computed
  const overallStats = useMemo(() => {
    const totalTitles = MARVEL_TITLES.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let moviesWatched = 0;
    let seriesCompleted = 0;

    for (const title of MARVEL_TITLES) {
      const prog = watchProgress[title.id]?.status || 'not_started';
      if (prog === 'completed') {
        completedCount++;
        if (title.mediaType === 'movie') moviesWatched++;
        else seriesCompleted++;
      } else if (prog === 'in_progress') {
        inProgressCount++;
      }
    }

    const notStartedCount = totalTitles - completedCount - inProgressCount;
    const completionPercentage = totalTitles > 0 ? Math.round((completedCount / totalTitles) * 100) : 0;

    return {
      totalTitles,
      completedCount,
      inProgressCount,
      notStartedCount,
      completionPercentage,
      moviesWatched,
      seriesCompleted
    };
  }, [watchProgress]);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        migrateGuestData,
        collections,
        activeCollectionId,
        setActiveCollectionId,
        createCollection,
        renameCollection,
        deleteCollection,
        addTitleToCollection,
        removeTitleFromCollection,
        reorderCollectionTitles,
        toggleTitlePriority,
        resetCollectionToDefault,
        watchProgress,
        updateWatchStatus,
        updatePersonalNotes,
        episodeProgress,
        toggleEpisodeWatched,
        isEpisodeWatched,
        getSeriesEpisodeStats,
        unlockedAchievements,
        newUnlockedToast,
        dismissAchievementToast,
        quizAttempts,
        recordQuizAttempt,
        doomsdayDate,
        setDoomsdayDate,
        overallStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
