import { MARVEL_TITLES } from '../src/data/marvelCatalogue';
import { QUIZ_QUESTIONS } from '../src/data/quizBank';
import { ACHIEVEMENTS } from '../src/data/achievements';

export interface Env {
  DB?: D1Database;
  TMDB_API_KEY?: string;
  ENVIRONMENT?: string;
  DEFAULT_DOOMSDAY_DATE?: string;
}

// Helpers for WebCrypto Auth
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password + salt),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(payload: object): string {
  const encoded = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  return `doom_${encoded}`;
}

function parseToken(token: string): { userId: string; username: string } | null {
  try {
    if (!token.startsWith('doom_')) return null;
    const raw = atob(token.slice(5));
    const data = JSON.parse(raw);
    if (data.exp && data.exp < Date.now()) return null;
    return { userId: data.userId, username: data.username };
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (data: unknown, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    };

    const error = (message: string, status = 400) => {
      return json({ error: message, success: false }, status);
    };

    // Extract Bearer Token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const authUser = token ? parseToken(token) : null;

    try {
      // 1. Health & Config
      if (pathname === '/api/health') {
        return json({
          status: 'online',
          engine: 'Doomflix Cloudflare Worker',
          d1Connected: !!env.DB,
          timestamp: new Date().toISOString()
        });
      }

      // 2. Auth: Register
      if (pathname === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json() as { username?: string; email?: string; password?: string };
        if (!body.username || !body.email || !body.password) {
          return error('Username, email, and password are required');
        }

        const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
        const salt = crypto.randomUUID().slice(0, 16);
        const hash = await hashPassword(body.password, salt);
        const now = new Date().toISOString();

        if (env.DB) {
          try {
            await env.DB.prepare(
              'INSERT INTO users (id, username, email, password_hash, salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
            ).bind(userId, body.username, body.email, hash, salt, now, now).run();
          } catch (e: any) {
            if (e.message?.includes('UNIQUE')) {
              return error('Username or email already exists', 409);
            }
            throw e;
          }
        }

        const user = { id: userId, username: body.username, email: body.email };
        const authToken = generateToken({ userId, username: body.username });
        return json({ success: true, user, token: authToken });
      }

      // 3. Auth: Login
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json() as { email?: string; password?: string };
        if (!body.email || !body.password) {
          return error('Email and password required');
        }

        if (env.DB) {
          const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(body.email).first<{
            id: string; username: string; email: string; password_hash: string; salt: string;
          }>();

          if (!row) {
            return error('Invalid email or password', 401);
          }

          const computed = await hashPassword(body.password, row.salt);
          if (computed !== row.password_hash) {
            return error('Invalid email or password', 401);
          }

          const authToken = generateToken({ userId: row.id, username: row.username });
          return json({
            success: true,
            user: { id: row.id, username: row.username, email: row.email },
            token: authToken
          });
        } else {
          // In-memory demo fallback if D1 not yet bound
          const userId = `usr_${btoa(body.email).slice(0, 8)}`;
          const username = body.email.split('@')[0];
          const authToken = generateToken({ userId, username });
          return json({
            success: true,
            user: { id: userId, username, email: body.email },
            token: authToken
          });
        }
      }

      // 4. Auth: Me
      if (pathname === '/api/auth/me' && request.method === 'GET') {
        if (!authUser) {
          return error('Unauthorized', 401);
        }
        return json({ success: true, user: authUser });
      }

      // 5. Movies Catalogue
      if (pathname === '/api/movies' && request.method === 'GET') {
        return json({
          success: true,
          count: MARVEL_TITLES.length,
          movies: MARVEL_TITLES
        });
      }

      if (pathname.startsWith('/api/movies/') && request.method === 'GET') {
        const id = pathname.replace('/api/movies/', '');
        const movie = MARVEL_TITLES.find(m => m.id === id || String(m.tmdbId) === id);
        if (!movie) return error('Movie not found', 404);
        return json({ success: true, movie });
      }

      // 6. Knowledge Arena Questions
      if (pathname === '/api/quiz/questions' && request.method === 'GET') {
        const mode = url.searchParams.get('mode') || 'full_collection';
        const difficulty = url.searchParams.get('difficulty');
        const category = url.searchParams.get('category');
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const watchedMovieIds = (url.searchParams.get('watched') || '').split(',').filter(Boolean);

        let pool = [...QUIZ_QUESTIONS];

        // Mode A: Watched Content Only (strict spoiler protection)
        if (mode === 'watched_only') {
          pool = pool.filter(q => watchedMovieIds.includes(q.relatedMovieId));
        }

        if (difficulty && difficulty !== 'all') {
          pool = pool.filter(q => q.difficulty === difficulty);
        }

        if (category && category !== 'All Categories') {
          pool = pool.filter(q => q.category === category);
        }

        // Shuffle pool
        pool.sort(() => Math.random() - 0.5);
        const selected = pool.slice(0, limit);

        return json({
          success: true,
          mode,
          totalAvailable: pool.length,
          questions: selected
        });
      }

      // 7. TMDB Proxy / Fallback
      if (pathname === '/api/tmdb/search' && request.method === 'GET') {
        const query = url.searchParams.get('query') || '';
        if (env.TMDB_API_KEY && query) {
          try {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/search/multi?api_key=${env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
            );
            if (tmdbRes.ok) {
              const data = await tmdbRes.json();
              return json({ success: true, source: 'tmdb_live', data });
            }
          } catch (e) {
            console.error('TMDB fetch error:', e);
          }
        }

        // Curated search fallback
        const matches = MARVEL_TITLES.filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.cast.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
          m.charactersIntroduced.some(ci => ci.toLowerCase().includes(query.toLowerCase()))
        );

        return json({
          success: true,
          source: 'curated_catalogue',
          results: matches.map(m => ({
            id: m.tmdbId,
            media_type: m.mediaType,
            title: m.title,
            name: m.title,
            release_date: m.releaseDate,
            first_air_date: m.releaseDate,
            vote_average: m.rating,
            overview: m.synopsis,
            poster_path: m.posterPath,
            backdrop_path: m.backdropPath,
            custom_id: m.id
          }))
        });
      }

      // 8. Achievements List
      if (pathname === '/api/achievements' && request.method === 'GET') {
        return json({
          success: true,
          achievements: ACHIEVEMENTS
        });
      }

      // 9. Guest Migration Endpoint
      if (pathname === '/api/migrate-guest' && request.method === 'POST') {
        if (!authUser) {
          return error('Must be logged in to migrate data', 401);
        }
        const guestData = await request.json() as {
          watchProgress?: Record<string, any>;
          seriesProgress?: Record<string, any>;
          customCollections?: any[];
          quizAttempts?: any[];
        };

        if (env.DB) {
          // Merge watch progress
          if (guestData.watchProgress) {
            for (const [movieId, progress] of Object.entries(guestData.watchProgress)) {
              await env.DB.prepare(`
                INSERT INTO watch_progress (id, user_id, movie_id, status, completion_date, personal_notes, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, movie_id) DO UPDATE SET
                  status = excluded.status,
                  personal_notes = COALESCE(excluded.personal_notes, watch_progress.personal_notes),
                  updated_at = excluded.updated_at
              `).bind(
                `wp_${crypto.randomUUID().slice(0, 8)}`,
                authUser.userId,
                movieId,
                progress.status,
                progress.completionDate || null,
                progress.personalNotes || null,
                new Date().toISOString()
              ).run();
            }
          }
        }

        return json({
          success: true,
          message: 'Guest data successfully merged into user account'
        });
      }

      // Fallback 404 for unknown API routes
      if (pathname.startsWith('/api/')) {
        return error('Endpoint not found', 404);
      }

      // Static assets or frontend handling
      return new Response('Doomflix API Engine', {
        headers: { 'Content-Type': 'text/plain', ...corsHeaders }
      });
    } catch (err: any) {
      return json({ error: err.message || 'Internal server error', success: false }, 500);
    }
  }
};
