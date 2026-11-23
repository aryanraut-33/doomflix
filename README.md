# Doomflix — Cinematic Universe Watch-Tracking Platform

> **"Your Universe. Your Watchlist. Your Countdown."**

Doomflix is a premium, highly interactive cinematic tracking platform designed for fans of Marvel's multiverse and cinematic universes. Architected as a scalable cinematic companion, Doomflix helps operatives follow curated viewing orders, track movie and episode progress, test knowledge in a spoiler-protected quiz arena, explore multiverse timeline incursions, and verify streaming availability in India.

---

## 🌟 Key Features

### 1. Command Centre (Central Dashboard)
- **Live Doomsday Countdown**: Configurable release countdown to *Avengers: Doomsday* (per requirement, release date is configurable in Settings rather than hardcoded).
- **Interactive 3D Chronal Cube**: Three.js WebGL geometric motif representing the temporal convergence singularity (drag and inspect in real-time).
- **Overall Completion & Intelligence**: Live percentage completed, feature films watched, TV series completed, and badges earned.
- **Continue Watching with Episode Progress**: Instant resume cards for serials like *Loki* with season & episode tracking.
- **Recommended Next Title**: Editorial spotlight identifying the exact next canonical title with "Why This Matters" contextual analysis.
- **Phase Breakdown**: Visual tracking across *Phase 01: Avengers Foundation*, *Phase 02: The Multiverse*, *Phase 03: New Generation & Returning Universes*, and *Optional Lore*.

### 2. My Watchlist (The Core Feature)
- **Predefined Collection — "Multiverse Essentials"**:
  - **Phase 01 — The Avengers Foundation** (5 titles: Cap 1, Avengers 1, Civil War, Infinity War, Endgame)
  - **Phase 02 — The Multiverse** (5 titles: Loki S1, Loki S2, No Way Home, Multiverse of Madness, Deadpool & Wolverine)
  - **Phase 03 — New Generation & Returning Universes** (4 titles: X-Men 2000, X2, Thunderbolts*, Fantastic Four: First Steps)
  - **Optional Viewing** (4 titles: Wakanda Forever, Brave New World, Shang-Chi, Days of Future Past)
- **Sequence Reordering**: Up/Down controls and sequence persistence.
- **Essential vs Optional Classification**: Toggle priority tags per title.
- **Custom Collections**: Create, rename, delete, and move titles between user collections.
- **Duplicate Prevention**: Enforces TMDB uniqueness within individual collections.
- **Episode-Level TV Tracking**: Expand series to inspect seasons, check off individual episodes, view runtimes, synopses, and air dates.
- **Operative Debrief Notes**: Record personal theories and notes per movie.
- **Filtering & Sorting**: Filter by Phase, Status, Priority, and Media Type; sort by Sequence, Release Year, TMDB Rating, or Title.

### 3. Movie & Series Dossier & Streaming in India 🇮🇳
- **Cinematic Detail Views**: Official high-res TMDB posters and backdrops, ratings, director, cast, and genres.
- **Verified India Streaming Availability**: Prioritizes JioHotstar / Disney+ Hotstar, Netflix, and Amazon Prime Video. Provides direct streaming links and fallback search links.
- **Contextual Cinematic Lore**:
  - *Why this title matters to the broader story*
  - *Important characters introduced*
  - *Crucial plot developments*
  - *Connections to other movies and series*
  - *Multiverse significance*
  - *Strict distinction between confirmed canon and speculative theories*

### 4. Knowledge Arena (Interactive Quiz System)
- **Mode A — Watched Content Only**:
  - **Strict Spoiler Protection**: Only generates questions from movies and series the user has marked as watched.
  - **Episode-Level Spoiler Protection**: Won't ask questions about unwatched TV episodes.
- **Mode B — Full Multiverse Pool**:
  - Access to 60+ verified canonical questions with explicit spoiler warnings.
- **Configurable Parameters**:
  - Difficulty: Beginner, Intermediate, Expert, or Mixed
  - Question count: 5, 10, 15, or 20
  - Optional 20-second countdown timer per question
- **Interactive Experience**:
  - Instant visual feedback (emerald for correct, crimson for incorrect)
  - Factually verified canonical explanations for every answer
  - Final score, accuracy %, and diagnostic weak-topic identification
  - Replay and review question logs.

### 5. Multiverse Explorer (Interactive Atlas)
- **Interactive Timeline Network Graph**:
  - Earth-616 (Sacred Timeline)
  - The TVA & The Void (Loki God of Stories / Yggdrasil)
  - Earth-838 (Illuminati Realm)
  - Earth-10005 (Fox X-Men Timeline)
  - Sony Spider-Verses (Raimi & Webb)
  - 1960s Retro-Futuristic Earth (Fantastic Four)
  - Battleworld & Incursion Nexus (Doctor Doom)
- **Multiverse Dossier Drawer**:
  - Threat level indicators (Low, Moderate, Critical, Cataclysmic)
  - Key anchors and characters
  - Incursion lore explaining how timelines bleed and collide
  - Direct links to associated watchlist titles.

### 6. Profile, Gamification & Guest-to-Account Migration
- **Original Achievement Badges**:
  - *First Watch*, *Earth's Mightiest*, *Multiverse Explorer*, *TVA Field Agent*, *First Fans*, *Knowledge Master*, *Sacred Omniscience*, *Doomsday Ready*.
- **Celebration Confetti & Toasts**: Real-time notifications upon unlocking achievements.
- **Guest Mode**: Full functionality persisted instantly to browser LocalStorage.
- **Cloudflare D1 Account Mode**: Secure registration and login using WebCrypto PBKDF2-SHA256 password hashing.
- **Seamless Guest Migration**: Merge local guest progress, custom collections, and quiz attempts into your Cloudflare D1 account with zero duplicates.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Three.js, Canvas Confetti |
| **Backend API** | Cloudflare Workers (Edge runtime) |
| **Database** | Cloudflare D1 (Normalized SQLite relational database with indexes) |
| **Authentication** | WebCrypto PBKDF2-SHA256 + HMAC Session Tokens |
| **Metadata** | TMDB API proxy + Curated Marvel fallback cache |
| **Deployment** | Cloudflare Workers / Pages (`wrangler`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ or v22+)
- npm (v10+)
- Wrangler CLI (included in devDependencies)

### Installation
```bash
# Clone or navigate to the repository
cd doomsday_ready

# Install dependencies
npm install
```

### Local Development
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Cloudflare D1 Database Setup
1. Create a D1 database using Wrangler:
   ```bash
   npx wrangler d1 create doomflix_db
   ```
2. Paste the generated `database_id` into `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "doomflix_db"
   database_id = "<your-database-id>"
   ```
3. Run migrations:
   ```bash
   npx wrangler d1 migrations apply doomflix_db --local # for local dev
   npx wrangler d1 migrations apply doomflix_db --remote # for production
   ```

### Production Build & Deployment
```bash
# Build the optimized production bundle
npm run build

# Deploy to Cloudflare Workers / Pages
npx wrangler deploy
```

---

## 🛡️ Intellectual Property Disclaimer
Doomflix is an independent fan-oriented tracking product and is not affiliated with, authorized, or endorsed by Marvel Studios, The Walt Disney Company, or Sony Pictures. All Marvel character names, movie titles, and related indicia are trademarks of their respective owners and are displayed strictly for informational cataloguing and educational reference.
