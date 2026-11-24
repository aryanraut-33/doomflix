/**
 * Doomflix Client Database Engine (IndexedDB + Synchronous Cache Layer)
 * 
 * Provides isolated, user-specific data storage for:
 * - User Authentication (Users table with unique email, username, and password hash)
 * - Watch Progress & History per title
 * - Current Series / Episode Watch Progress
 * - Custom Collections & Lists with item sequencing
 * - Unlocked Badges & Achievements
 * - Knowledge Arena Quiz Attempts & History
 * 
 * Ensures strict per-user data isolation:
 * - When a user logs in, all their data is retrieved.
 * - When a user logs out, all saved data is removed from active memory and the app returns to default.
 */

import { 
  Collection, 
  TitleWatchProgress, 
  EpisodeProgress, 
  QuizAttemptRecord, 
  UnlockedAchievement 
} from './types';
import { MARVEL_TITLES } from '../data/marvelCatalogue';

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDataRecord {
  userId: string;
  watchProgress: Record<string, TitleWatchProgress>;
  episodeProgress: EpisodeProgress;
  collections: Collection[];
  activeCollectionId: string;
  unlockedAchievements: UnlockedAchievement[];
  quizAttempts: QuizAttemptRecord[];
  updatedAt: string;
}

const DB_NAME = 'doomflix_persistent_db';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const USERDATA_STORE = 'user_data';

const LS_USERS_KEY = 'doomflix_db_users_v2';
const LS_DATA_PREFIX = 'doomflix_db_userdata_v2_';
const LS_SESSION_KEY = 'doomflix_db_active_session_v2';

// Clean default collection for any new user or reset state
export const createDefaultCollections = (): Collection[] => [
  {
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
  }
];

// Clean default user data record
export const createDefaultUserDataRecord = (userId: string): UserDataRecord => ({
  userId,
  watchProgress: {},
  episodeProgress: {},
  collections: createDefaultCollections(),
  activeCollectionId: 'multiverse-essentials',
  unlockedAchievements: [],
  quizAttempts: [],
  updatedAt: new Date().toISOString()
});

// Fast hash helper for passwords
export async function hashPasswordString(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password + '_doom_salt_2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

// -------------------------------------------------------------
// 1. IndexedDB Core
// -------------------------------------------------------------
let dbPromise: Promise<IDBDatabase> | null = null;

function getIndexedDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains(USERDATA_STORE)) {
          db.createObjectStore(USERDATA_STORE, { keyPath: 'userId' });
        }
      };
    });
  }
  return dbPromise;
}

// -------------------------------------------------------------
// 2. Synchronous Local Storage Mirror Helpers
// -------------------------------------------------------------
function getLSUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLSUsers(users: Record<string, StoredUser>): void {
  try {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  } catch {}
}

function getLSUserData(userId: string): UserDataRecord | null {
  try {
    const raw = localStorage.getItem(`${LS_DATA_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLSUserData(userId: string, data: UserDataRecord): void {
  try {
    localStorage.setItem(`${LS_DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch {}
}

export function getActiveSessionUserId(): string | null {
  try {
    return localStorage.getItem(LS_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSessionUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(LS_SESSION_KEY, userId);
    } else {
      localStorage.removeItem(LS_SESSION_KEY);
    }
  } catch {}
}

// -------------------------------------------------------------
// 3. User Operations (Find, Create, Authenticate)
// -------------------------------------------------------------
export async function dbFindUserByEmail(email: string): Promise<StoredUser | null> {
  const normEmail = email.trim().toLowerCase();

  // Try sync mirror first
  const lsUsers = getLSUsers();
  for (const u of Object.values(lsUsers)) {
    if (u.email.toLowerCase() === normEmail) {
      return u;
    }
  }

  // Try IndexedDB
  try {
    const db = await getIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(USERS_STORE, 'readonly');
      const store = tx.objectStore(USERS_STORE);
      const index = store.index('email');
      const req = index.get(normEmail);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function dbFindUserById(id: string): Promise<StoredUser | null> {
  const lsUsers = getLSUsers();
  if (lsUsers[id]) return lsUsers[id];

  try {
    const db = await getIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(USERS_STORE, 'readonly');
      const store = tx.objectStore(USERS_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function dbCreateUser(
  username: string, 
  email: string, 
  password: string
): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const existing = await dbFindUserByEmail(normEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = await hashPasswordString(password);
  const now = new Date().toISOString();

  const newUser: StoredUser = {
    id: userId,
    username: username.trim(),
    email: normEmail,
    passwordHash,
    createdAt: now,
    updatedAt: now
  };

  // 1. Save to localStorage mirror
  const lsUsers = getLSUsers();
  lsUsers[userId] = newUser;
  saveLSUsers(lsUsers);

  // 2. Initialize default user data in storage
  const initialData = createDefaultUserDataRecord(userId);
  saveLSUserData(userId, initialData);

  // 3. Save to IndexedDB
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([USERS_STORE, USERDATA_STORE], 'readwrite');
    tx.objectStore(USERS_STORE).put(newUser);
    tx.objectStore(USERDATA_STORE).put(initialData);
  } catch (err) {
    console.warn('IndexedDB write deferred/fallback to LS:', err);
  }

  return { success: true, user: newUser };
}

export async function dbAuthenticateUser(
  email: string, 
  password: string
): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  let user = await dbFindUserByEmail(normEmail);

  if (!user) {
    // For convenience: if user is logging in with an email not yet in DB,
    // auto-register them so they can immediately begin saving!
    const autoUsername = normEmail.split('@')[0] || 'Operative';
    const createRes = await dbCreateUser(autoUsername, normEmail, password);
    if (!createRes.success || !createRes.user) {
      return { success: false, error: createRes.error || 'Authentication failed' };
    }
    user = createRes.user;
  } else {
    // Check password
    const hash = await hashPasswordString(password);
    if (user.passwordHash && user.passwordHash !== hash) {
      return { success: false, error: 'Invalid password' };
    }
  }

  return { success: true, user };
}

// -------------------------------------------------------------
// 4. User Data Operations (Watch, Lists, Badges, Quiz)
// -------------------------------------------------------------
export async function dbGetUserData(userId: string): Promise<UserDataRecord> {
  // Try sync mirror first
  const lsData = getLSUserData(userId);
  if (lsData) return lsData;

  // Try IndexedDB
  try {
    const db = await getIndexedDB();
    const idbData = await new Promise<UserDataRecord | null>((resolve) => {
      const tx = db.transaction(USERDATA_STORE, 'readonly');
      const store = tx.objectStore(USERDATA_STORE);
      const req = store.get(userId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });

    if (idbData) {
      saveLSUserData(userId, idbData);
      return idbData;
    }
  } catch {}

  // If no record exists yet, generate pristine defaults
  const defaults = createDefaultUserDataRecord(userId);
  saveLSUserData(userId, defaults);
  return defaults;
}

export async function dbSaveUserData(userId: string, data: Partial<UserDataRecord>): Promise<void> {
  if (!userId || userId === 'guest_user') return;

  const current = getLSUserData(userId) || createDefaultUserDataRecord(userId);
  const updated: UserDataRecord = {
    ...current,
    ...data,
    userId,
    updatedAt: new Date().toISOString()
  };

  // 1. Update sync mirror
  saveLSUserData(userId, updated);

  // 2. Update IndexedDB
  try {
    const db = await getIndexedDB();
    const tx = db.transaction(USERDATA_STORE, 'readwrite');
    tx.objectStore(USERDATA_STORE).put(updated);
  } catch {}
}
