-- Migration: 0001_initial_schema.sql
-- Doomflix Cloudflare D1 Normalized Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  media_type TEXT NOT NULL CHECK(media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  original_title TEXT,
  synopsis TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date TEXT,
  runtime INTEGER,
  rating REAL DEFAULT 0,
  genres TEXT,
  director TEXT,
  cast_members TEXT,
  why_it_matters TEXT,
  characters_introduced TEXT,
  relevant_plot_points TEXT,
  universe_connections TEXT,
  multiverse_significance TEXT,
  canon_status TEXT DEFAULT 'Confirmed Canon',
  seasons_count INTEGER DEFAULT 0,
  episodes_count INTEGER DEFAULT 0,
  metadata_updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  is_system_collection INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collection_titles (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  sequence_number INTEGER NOT NULL,
  priority TEXT NOT NULL DEFAULT 'essential' CHECK(priority IN ('essential', 'optional')),
  phase_group TEXT,
  added_at TEXT NOT NULL,
  UNIQUE(collection_id, movie_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watch_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'completed')),
  completion_date TEXT,
  personal_notes TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS series_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  season_number INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  watched INTEGER NOT NULL DEFAULT 0 CHECK(watched IN (0, 1)),
  watched_at TEXT,
  UNIQUE(user_id, movie_id, season_number, episode_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS streaming_availability (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'IN',
  provider TEXT NOT NULL,
  provider_url TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available',
  last_verified_at TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('beginner', 'intermediate', 'expert')),
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  related_movie_id TEXT,
  spoiler_season INTEGER,
  spoiler_episode INTEGER,
  FOREIGN KEY (related_movie_id) REFERENCES movies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  quiz_mode TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  unlock_condition TEXT NOT NULL,
  icon_key TEXT NOT NULL,
  badge_color TEXT NOT NULL DEFAULT 'red'
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  UNIQUE(user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movies_tmdb ON movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_collection_titles_col ON collection_titles(collection_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_watch_progress_user ON watch_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_series_progress_user ON series_progress(user_id, movie_id);
CREATE INDEX IF NOT EXISTS idx_streaming_movie ON streaming_availability(movie_id, country_code);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_movie ON quiz_questions(related_movie_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
