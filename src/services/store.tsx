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
import {
  dbCreateUser,
  dbAuthenticateUser,
  dbGetUserData,
  dbSaveUserData,
  getActiveSessionUserId,
  setActiveSessionUserId
} from './db';

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
  // 1. Auth State: Check active session for logged in user; default to pristine guest
  const [user, setUser] = useState<User>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const users = JSON.parse(localStorage.getItem('doomflix_db_users_v2') || '{}');
        const found = users[activeUserId];
        if (found) {
          return { id: found.id, username: found.username, email: found.email, isGuest: false };
        }
      }
    } catch {}
    return { id: 'guest_user', username: 'Operative (Guest)', isGuest: true };
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        return `doom_${activeUserId}`;
      }
    } catch {}
    return null;
  });

  // 2. Collections (Per-user saved lists or pristine default)
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.collections && parsed.collections.length > 0) return parsed.collections;
        }
      }
    } catch {}
    return [INITIAL_MULTIVERSE_ESSENTIALS];
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.activeCollectionId) return parsed.activeCollectionId;
        }
      }
    } catch {}
    return 'multiverse-essentials';
  });

  // 3. Watch Progress (Per-user history or pristine empty)
  const [watchProgress, setWatchProgress] = useState<Record<string, TitleWatchProgress>>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.watchProgress) return parsed.watchProgress;
        }
      }
    } catch {}
    return {};
  });

  // 4. Series Episode Progress (Per-user current watch or pristine empty)
  const [episodeProgress, setEpisodeProgress] = useState<EpisodeProgress>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.episodeProgress) return parsed.episodeProgress;
        }
      }
    } catch {}
    return {};
  });

  // 5. Achievements (Per-user badges or pristine empty)
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.unlockedAchievements) return parsed.unlockedAchievements;
        }
      }
    } catch {}
    return [];
  });
  const [newUnlockedToast, setNewUnlockedToast] = useState<Achievement | null>(null);

  // 6. Quiz Attempts (Per-user history or pristine empty)
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>(() => {
    try {
      const activeUserId = getActiveSessionUserId();
      if (activeUserId && activeUserId !== 'guest_user') {
        const raw = localStorage.getItem(`doomflix_db_userdata_v2_${activeUserId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.quizAttempts) return parsed.quizAttempts;
        }
      }
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

  // Guard to prevent auto-save from overwriting DB during login/logout state restoration
  const isRestoringRef = React.useRef(false);

  // Automatically save any changes into the authenticated user's isolated database record
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    if (user && !user.isGuest && user.id && user.id !== 'guest_user') {
      dbSaveUserData(user.id, {
        watchProgress,
        episodeProgress,
        collections,
        activeCollectionId,
        unlockedAchievements,
        quizAttempts
      });
    }
  }, [user, watchProgress, episodeProgress, collections, activeCollectionId, unlockedAchievements, quizAttempts]);

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

  // Auth Operations with Per-User Database Isolation & Instant Retrieval
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Authenticate user credentials in the database
      const authRes = await dbAuthenticateUser(email, pass);
      if (!authRes.success || !authRes.user) {
        return { success: false, error: authRes.error || 'Authentication failed' };
      }

      const authenticatedUser: User = {
        id: authRes.user.id,
        username: authRes.user.username,
        email: authRes.user.email,
        isGuest: false
      };

      // 2. Retrieve all saved watch history, badges, quiz history, and custom collections for this user
      const userData = await dbGetUserData(authRes.user.id);

      // 3. Mark active session and restore all isolated data into state
      isRestoringRef.current = true;
      setActiveSessionUserId(authRes.user.id);
      setUser(authenticatedUser);
      setToken(`doom_${btoa(authRes.user.email)}`);

      setWatchProgress(userData.watchProgress || {});
      setEpisodeProgress(userData.episodeProgress || {});
      setCollections(
        userData.collections && userData.collections.length > 0 
          ? userData.collections 
          : [INITIAL_MULTIVERSE_ESSENTIALS]
      );
      setActiveCollectionId(userData.activeCollectionId || 'multiverse-essentials');
      setUnlockedAchievements(userData.unlockedAchievements || []);
      setQuizAttempts(userData.quizAttempts || []);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (username: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const createRes = await dbCreateUser(username, email, pass);
      if (!createRes.success || !createRes.user) {
        return { success: false, error: createRes.error || 'Registration failed' };
      }

      const authenticatedUser: User = {
        id: createRes.user.id,
        username: createRes.user.username,
        email: createRes.user.email,
        isGuest: false
      };

      // If user had existing session data prior to creating account, migrate and save it
      const hasGuestProgress = Object.keys(watchProgress).length > 0 || quizAttempts.length > 0 || unlockedAchievements.length > 0;
      let initialData;
      if (hasGuestProgress) {
        initialData = {
          userId: createRes.user.id,
          watchProgress: { ...watchProgress },
          episodeProgress: { ...episodeProgress },
          collections: collections.length > 0 ? [...collections] : [INITIAL_MULTIVERSE_ESSENTIALS],
          activeCollectionId,
          unlockedAchievements: [...unlockedAchievements],
          quizAttempts: [...quizAttempts],
          updatedAt: new Date().toISOString()
        };
        await dbSaveUserData(createRes.user.id, initialData);
      } else {
        initialData = await dbGetUserData(createRes.user.id);
      }

      isRestoringRef.current = true;
      setActiveSessionUserId(createRes.user.id);
      setUser(authenticatedUser);
      setToken(`doom_${btoa(createRes.user.email)}`);

      setWatchProgress(initialData.watchProgress || {});
      setEpisodeProgress(initialData.episodeProgress || {});
      setCollections(
        initialData.collections && initialData.collections.length > 0 
          ? initialData.collections 
          : [INITIAL_MULTIVERSE_ESSENTIALS]
      );
      setActiveCollectionId(initialData.activeCollectionId || 'multiverse-essentials');
      setUnlockedAchievements(initialData.unlockedAchievements || []);
      setQuizAttempts(initialData.quizAttempts || []);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    // 1. Terminate active user session
    isRestoringRef.current = true;
    setActiveSessionUserId(null);

    // 2. Return all application state to clean pristine defaults
    setUser({ id: 'guest_user', username: 'Operative (Guest)', isGuest: true });
    setToken(null);
    setWatchProgress({});
    setEpisodeProgress({});
    setCollections([INITIAL_MULTIVERSE_ESSENTIALS]);
    setActiveCollectionId('multiverse-essentials');
    setUnlockedAchievements([]);
    setQuizAttempts([]);

    // 3. Purge legacy global keys so no previously saved data leaks into guest mode
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.WATCH_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.EPISODE_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_COLLECTION);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    } catch {}
  };

  const migrateGuestData = async (): Promise<{ success: boolean; message?: string }> => {
    if (user.isGuest || !user.id || user.id === 'guest_user') {
      return { success: false, message: 'Please log in to sync your guest data to your account.' };
    }
    await dbSaveUserData(user.id, {
      watchProgress,
      episodeProgress,
      collections,
      activeCollectionId,
      unlockedAchievements,
      quizAttempts
    });
    return { success: true, message: 'Data saved successfully to your database account!' };
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
