import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  ExternalLink,
  Plus,
  Search,
  User,
  Bookmark,
  Star,
  Flame
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { NavTab } from '../common/Sidebar';

interface RotatingHeroPaneProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

// 6 Default Curated Showcase Titles for Guests / Logged-out users:
const DEFAULT_SHOWCASE_IDS = [
  'avengers-infinity-war',
  'avengers-endgame',
  'fantastic-four-first-steps',
  'the-avengers',
  'dr-strange-multiverse-madness',
  'loki-s1'
];

const MOBILE_CATEGORIES = ['ALL', 'MOVIES', 'SERIES', 'PHASE 1-3', 'PHASE 4-6'] as const;
type MobileCategory = typeof MOBILE_CATEGORIES[number];

export const RotatingHeroPane: React.FC<RotatingHeroPaneProps> = ({ 
  onSelectTab, 
  onOpenTitleDetails 
}) => {
  const { watchProgress, user, updateWatchStatus } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<MobileCategory>('ALL');

  // Curated showcase list
  const defaultTitles: MarvelTitle[] = React.useMemo(() => {
    return DEFAULT_SHOWCASE_IDS
      .map(id => MARVEL_TITLES.find(t => t.id === id))
      .filter((t): t is MarvelTitle => Boolean(t));
  }, []);

  // Determine user's active phase based on watch progress
  const userCurrentPhase = React.useMemo(() => {
    for (const phaseName of PHASE_ORDER) {
      const titlesInPhase = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === phaseName);
      if (titlesInPhase.length > 0) {
        const isPhaseIncomplete = titlesInPhase.some(
          t => watchProgress[t.id]?.status !== 'completed'
        );
        if (isPhaseIncomplete) {
          return phaseName;
        }
      }
    }
    return PHASE_ORDER[0];
  }, [watchProgress]);

  const baseMovies = React.useMemo(() => {
    if (!user.isGuest) {
      const phaseMovies = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === userCurrentPhase);
      return phaseMovies.length > 0 ? phaseMovies : defaultTitles;
    }
    return defaultTitles;
  }, [user.isGuest, userCurrentPhase, defaultTitles]);

  // Mobile filtered movies based on category chips
  const currentMovies = React.useMemo(() => {
    if (selectedCategory === 'MOVIES') {
      return baseMovies.filter(t => t.mediaType === 'movie');
    }
    if (selectedCategory === 'SERIES') {
      return baseMovies.filter(t => t.mediaType === 'tv');
    }
    if (selectedCategory === 'PHASE 1-3') {
      return MARVEL_TITLES.filter(t => 
        t.defaultPhaseGroup.includes('Phase One') || 
        t.defaultPhaseGroup.includes('Phase Two') || 
        t.defaultPhaseGroup.includes('Phase Three')
      ).slice(0, 6);
    }
    if (selectedCategory === 'PHASE 4-6') {
      return MARVEL_TITLES.filter(t => 
        t.defaultPhaseGroup.includes('Phase Four') || 
        t.defaultPhaseGroup.includes('Phase Five') || 
        t.defaultPhaseGroup.includes('Phase Six')
      ).slice(0, 6);
    }
    return baseMovies;
  }, [baseMovies, selectedCategory]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Reset index when movies array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentMovies.length, user.isGuest, selectedCategory]);

  const activeMovie = currentMovies[currentIndex] || currentMovies[0] || defaultTitles[0];

  // Auto-rotation timer (7 seconds per slide)
  useEffect(() => {
    if (isPaused || currentMovies.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex(current => (current + 1) % currentMovies.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, currentMovies.length, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + currentMovies.length) % currentMovies.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % currentMovies.length);
  };

  // Mobile Touch Swipe Handlers (Zero-latency synchronous tracking with refs)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      setIsPaused(false);
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Minimum swipe threshold of 30px, with horizontal dominance over vertical scroll
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX < 0) {
        // Swiped left -> next
        handleNext();
      } else {
        // Swiped right -> prev
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setIsPaused(false);
  };

  if (!activeMovie) return null;

  const currentStatus = watchProgress[activeMovie.id]?.status || 'not_started';
  const primaryStream = activeMovie.streamingIndia?.[0];
  const streamUrl = primaryStream?.directUrl || primaryStream?.searchUrl;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MOBILE FORMAT ONLY (< lg): MixMax Inspired Modern Layout   */}
      {/* ============================================================== */}
      <div className="block lg:hidden w-full select-none pt-3">
        {/* Mobile Header Bar */}
        <header className="px-4 py-2 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 doom-flame-container relative shrink-0">
              <div className="doom-flame-smoke" />
              <div className="doom-flame-smoke-layer2" />
              <img
                src="/assets/image.png"
                alt="Doomflix"
                className="doom-logo-img w-9 h-9 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cinematic text-xl font-black tracking-wider text-white leading-tight">
                DOOM<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">FLIX</span>
              </span>
              <span className="text-[10px] text-gray-400 font-sans tracking-wide">
                Marvel Cinematic Universe
              </span>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('discover')}
              aria-label="Search"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              aria-label="Profile"
              className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase"
            >
              {user.isGuest ? <User size={15} /> : user.username.charAt(0)}
            </button>
          </div>
        </header>

        {/* Category Filter Chips Bar */}
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none">
          {MOBILE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-emerald-500/50 shadow-[0_2px_10px_rgba(16,185,129,0.25)]'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Mobile Hero Billboard Card */}
        <div className="px-4 pt-1">
          <div 
            className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85)] bg-doom-950 group cursor-grab active:cursor-grabbing touch-pan-y"
            onClick={() => onOpenTitleDetails(activeMovie)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Image */}
            <CinematicImage
              key={activeMovie.id}
              src={activeMovie.posterPath || activeMovie.backdropPath}
              alt={activeMovie.title}
              fallbackTitle={activeMovie.title}
              className="w-full h-full object-cover"
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Top Row on Card: Trending Badge & Bookmark */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-white">
                <Flame size={12} className="text-amber-400" />
                <span>Trending</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateWatchStatus(
                    activeMovie.id, 
                    currentStatus === 'completed' ? 'not_started' : 'completed'
                  );
                }}
                aria-label="Toggle Watchlist"
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                  currentStatus === 'completed'
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-black/60 text-white/80 hover:text-white border border-white/15'
                }`}
              >
                {currentStatus === 'completed' ? <CheckCircle2 size={16} /> : <Bookmark size={15} />}
              </button>
            </div>

            {/* Bottom Card Content: Title, Meta, and Action Buttons */}
            <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col gap-2.5">
              {/* Title */}
              <h2 className="font-cinematic text-3xl sm:text-4xl text-white uppercase tracking-wider leading-tight drop-shadow-md">
                {activeMovie.title}
              </h2>

              {/* Meta row with Rating */}
              <div className="flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-400">{activeMovie.releaseYear}</span>
                  <span className="text-gray-500">•</span>
                  <span>{activeMovie.mediaType === 'tv' ? `${activeMovie.seasons?.length || 1}S` : `${activeMovie.runtime}m`}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">4K HDR</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                  <Star size={12} fill="currentColor" />
                  <span>{activeMovie.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-1">
                {streamUrl && (
                  <a
                    href={streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black py-2.5 px-4 rounded-full font-bold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Watch Now</span>
                  </a>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTitleDetails(activeMovie);
                  }}
                  aria-label="More Info"
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 hover:bg-black/80 transition-colors"
                >
                  <Info size={16} />
                </button>
              </div>

              {/* Carousel Dot Indicators at bottom */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {currentMovies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex 
                        ? 'w-5 h-1.5 bg-emerald-400' 
                        : 'w-1.5 h-1.5 bg-white/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP FORMAT ONLY (lg:block): Wide Cinematic Layout       */}
      {/* ============================================================== */}
      <section 
        className="hidden lg:block relative w-screen -ml-[50vw] left-1/2 overflow-hidden bg-doom-950 select-none group"
        style={{ minHeight: 'calc(100vh - 56px)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-bleed Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <CinematicImage
            key={activeMovie.id}
            src={activeMovie.backdropPath || activeMovie.posterPath}
            alt={activeMovie.title}
            fallbackTitle={activeMovie.title}
            fallbackSubtitle={`${activeMovie.releaseYear} • Marvel Cinematic Universe`}
            className="w-full h-full object-cover object-top transition-opacity duration-700 ease-out"
          />

          {/* Gradient overlays — Prime Video / Netflix style */}
          <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-doom-950/90 via-doom-950/40 to-transparent" />
        </div>

        {/* Content positioned to clear the 96px collapsed rail */}
        <div className="relative z-10 h-full flex flex-col justify-end pl-32 lg:pl-36 pr-6 sm:pr-12 lg:pr-16 pb-16 sm:pb-20 pt-32" style={{ minHeight: 'calc(100vh - 56px)' }}>
          
          {/* Title */}
          <h1 className="font-cinematic text-5xl lg:text-7xl xl:text-8xl text-white uppercase tracking-wider leading-[0.9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-3xl">
            {activeMovie.title}
          </h1>

          {/* Minimal metadata */}
          <div className="flex items-center gap-3 mt-4 text-sm text-gray-300">
            <span className="text-emerald-400 font-semibold">{activeMovie.releaseYear}</span>
            <span className="text-gray-600">•</span>
            <span>{activeMovie.mediaType === 'tv' ? `${activeMovie.seasons?.length || 1} Seasons` : `${activeMovie.runtime} min`}</span>
            {currentStatus === 'completed' && (
              <>
                <span className="text-gray-600">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 size={12} /> Watched
                </span>
              </>
            )}
          </div>

          {/* Synopsis — 2 lines max */}
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed max-w-xl mt-3">
            {activeMovie.synopsis}
          </p>

          {/* Action buttons — Prime Video style */}
          <div className="flex items-center gap-3 mt-5">
            {streamUrl && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-doom-950 px-6 py-2.5 rounded-md font-bold text-sm transition-all"
                title={`Stream ${activeMovie.title}`}
              >
                <Play size={16} fill="currentColor" />
                <span>Watch now</span>
              </a>
            )}

            <button
              onClick={() => onOpenTitleDetails(activeMovie)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
              title="More Info"
            >
              <Info size={18} />
            </button>
          </div>

          {/* Streaming provider pill */}
          {primaryStream && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Available on {primaryStream.provider}</span>
            </div>
          )}

          {/* Bottom: Slide indicators */}
          <div className="flex items-center gap-2 mt-8">
            {currentMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                className={`h-0.5 rounded-full transition-all duration-500 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
                  idx === currentIndex 
                    ? 'w-8 bg-white' 
                    : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right side navigation arrows stacked vertically — Left arrow below Right arrow */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <button
            onClick={(e) => handleNext(e)}
            onMouseDown={(e) => e.preventDefault()}
            className="p-2 text-white/75 hover:text-white hover:scale-125 active:scale-95 transition-transform cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 ring-0 shadow-none border-0 select-none filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight size={38} strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => handlePrev(e)}
            onMouseDown={(e) => e.preventDefault()}
            className="p-2 text-white/75 hover:text-white hover:scale-125 active:scale-95 transition-transform cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 ring-0 shadow-none border-0 select-none filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft size={38} strokeWidth={2.5} />
          </button>
        </div>
      </section>
    </>
  );
};
