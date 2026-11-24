import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Info, 
  ExternalLink
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { NavTab } from '../common/Sidebar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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

export const RotatingHeroPane: React.FC<RotatingHeroPaneProps> = ({ 
  onSelectTab, 
  onOpenTitleDetails 
}) => {
  const { watchProgress, updateWatchStatus, getSeriesEpisodeStats, user } = useAppStore();

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

  // Mode is strictly automatic based on auth status:
  // If user is logged in (!user.isGuest), show active phase movies.
  // Else (guest/logged out), show curated showcase movies.
  const currentMovies = React.useMemo(() => {
    if (!user.isGuest) {
      const phaseMovies = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === userCurrentPhase);
      return phaseMovies.length > 0 ? phaseMovies : defaultTitles;
    }
    return defaultTitles;
  }, [user.isGuest, userCurrentPhase, defaultTitles]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [slideProgress, setSlideProgress] = useState<number>(0);

  // Reset index when movies array changes
  useEffect(() => {
    setCurrentIndex(0);
    setSlideProgress(0);
  }, [currentMovies.length, user.isGuest]);

  const activeMovie = currentMovies[currentIndex] || currentMovies[0];

  // Auto-rotation timer (6.5 seconds per slide, paused on hover)
  useEffect(() => {
    if (isPaused || currentMovies.length <= 1) return;

    const intervalStep = 50;
    const totalDuration = 6500;
    const progressIncrement = (intervalStep / totalDuration) * 100;

    const interval = window.setInterval(() => {
      setSlideProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(current => (current + 1) % currentMovies.length);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalStep);

    return () => clearInterval(interval);
  }, [isPaused, currentMovies.length, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideProgress(0);
    setCurrentIndex(prev => (prev - 1 + currentMovies.length) % currentMovies.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideProgress(0);
    setCurrentIndex(prev => (prev + 1) % currentMovies.length);
  };

  const handleSelectMovie = (idx: number) => {
    setSlideProgress(0);
    setCurrentIndex(idx);
  };

  if (!activeMovie) return null;

  const currentStatus = watchProgress[activeMovie.id]?.status || 'not_started';
  const epStats = activeMovie.mediaType === 'tv' ? getSeriesEpisodeStats(activeMovie.id) : null;
  const primaryStream = activeMovie.streamingIndia?.[0];
  const streamUrl = primaryStream?.directUrl || primaryStream?.searchUrl;
  const isDirect = Boolean(primaryStream?.directUrl);

  return (
    <section 
      className="relative rounded-3xl overflow-hidden border border-border bg-doom-950 shadow-cinematic group select-none min-h-[500px] sm:min-h-[540px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Cinematic Backdrop Image with Cross-fade */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-doom-950">
        <CinematicImage
          key={activeMovie.id}
          src={activeMovie.backdropPath || activeMovie.posterPath}
          alt={activeMovie.title}
          fallbackTitle={activeMovie.title}
          fallbackSubtitle={`${activeMovie.releaseYear} • Marvel Cinematic Universe`}
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out filter brightness-[0.70] contrast-105"
        />

        {/* Netflix-style Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-doom-950/95 via-doom-950/75 to-transparent" />
        <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-20" />
      </div>

      {/* 2. Top Minimal Indicator */}
      <div className="relative z-10 px-6 sm:px-10 pt-6 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 doom-glass px-3 py-1 rounded-full text-[11px] font-mono pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-marvel uppercase tracking-wider font-bold">
            {!user.isGuest ? activeMovie.defaultPhaseGroup : 'FEATURED MULTIVERSE SHOWCASE'}
          </span>
        </div>

        {/* Minimal Slide Dots Indicator */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {currentMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectMovie(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-300' 
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3. Main Center Stage: Minimal Information Billboard */}
      <div className="relative z-10 px-6 sm:px-10 md:px-12 pb-6 pt-12 flex-1 flex flex-col justify-end max-w-2xl space-y-4">
        {/* Massive Cinematic Title */}
        <h1 className="font-cinematic text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-wider leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          {activeMovie.title}
        </h1>

        {/* Minimal Metadata Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-sans">
          <span className="font-mono text-emerald-400 font-bold">
            {activeMovie.mediaType === 'tv' ? 'TV SERIES' : 'MOVIE'}
          </span>
          <span className="text-gray-500">•</span>
          <span className="font-mono text-white font-semibold">{activeMovie.releaseYear}</span>
          <span className="text-gray-500">•</span>
          <span>{activeMovie.mediaType === 'tv' ? `${activeMovie.seasons?.length || 1} Seasons` : `${activeMovie.runtime} mins`}</span>
          <span className="text-gray-500">•</span>
          <div className="flex items-center gap-1 text-doom-gold font-mono font-bold">
            <Star size={13} fill="currentColor" />
            <span>{activeMovie.rating.toFixed(1)}</span>
          </div>
          {currentStatus === 'completed' && (
            <>
              <span className="text-gray-500">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-bold">
                <CheckCircle2 size={11} /> Watched
              </span>
            </>
          )}
        </div>

        {/* Clean 2-line Synopsis */}
        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 font-sans leading-relaxed drop-shadow max-w-xl">
          {activeMovie.synopsis}
        </p>

        {/* Action Controls: Direct Streaming Link + View Info */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary Play / Stream Button */}
          {streamUrl && (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 hover:brightness-110 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all border border-emerald-400/40 hover:scale-[1.03]"
              title={`Stream ${activeMovie.title} on ${primaryStream.provider}`}
            >
              <Play size={17} fill="white" />
              <span>{isDirect ? `Stream on ${primaryStream.provider}` : `Find on ${primaryStream.provider}`}</span>
              <ExternalLink size={13} className="opacity-80" />
            </a>
          )}

          {/* Secondary Info Button */}
          <button
            onClick={() => onOpenTitleDetails(activeMovie)}
            className="rounded-2xl px-5 py-3 text-sm font-semibold flex items-center gap-2 doom-glass hover:bg-white/10 text-white border border-white/15 transition-all hover:scale-[1.02]"
          >
            <Info size={17} />
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Rail: Minimalist Movie Thumbnails Carousel */}
      <div className="relative z-10 px-6 sm:px-10 py-4 bg-gradient-to-t from-doom-950 via-doom-950/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full doom-glass hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all text-gray-300"
            title="Previous Movie"
            aria-label="Previous Movie"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono text-xs text-gray-400 px-1">
            <span className="text-white font-bold">{currentIndex + 1}</span> / {currentMovies.length}
          </span>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full doom-glass hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all text-gray-300"
            title="Next Movie"
            aria-label="Next Movie"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Thumbnail Carousel Track */}
        <div className="flex items-center gap-2.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {currentMovies.map((movie, idx) => {
            const isSelected = idx === currentIndex;
            const isWatched = watchProgress[movie.id]?.status === 'completed';

            return (
              <button
                key={movie.id}
                onClick={() => handleSelectMovie(idx)}
                className={`group relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 text-left ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 scale-105 w-28 sm:w-36 h-14 sm:h-16 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'opacity-60 hover:opacity-100 w-24 sm:w-28 h-12 sm:h-14 border border-white/10'
                }`}
                title={movie.title}
              >
                <CinematicImage
                  src={movie.backdropPath || movie.posterPath}
                  alt={movie.title}
                  fallbackTitle={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 flex flex-col justify-end">
                  <span className="font-cinematic text-[11px] sm:text-xs text-white uppercase tracking-wider truncate leading-tight">
                    {movie.title}
                  </span>
                </div>

                {isWatched && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center shadow">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
