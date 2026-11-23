import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Layers, 
  Info, 
  Film,
  Tv
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { NavTab } from '../common/Sidebar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShimmerButton } from '../magicui/shimmer-button';

interface RotatingHeroPaneProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

// 6 Default Showcase Movies requested:
// Infinity War, Endgame, Fantastic 4 2025, The Avengers, Dr Strange Multiverse of Madness, Loki S1
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
  const { watchProgress, updateWatchStatus, getSeriesEpisodeStats } = useAppStore();

  // Resolve the 6 default movies
  const defaultTitles: MarvelTitle[] = React.useMemo(() => {
    return DEFAULT_SHOWCASE_IDS
      .map(id => MARVEL_TITLES.find(t => t.id === id))
      .filter((t): t is MarvelTitle => Boolean(t));
  }, []);

  // Determine user's current active phase based on watch progress
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

  // Mode: 'default' (the 6 curated movies) or 'active_phase' (movies from user's current phase)
  const [rotationMode, setRotationMode] = useState<'default' | 'active_phase'>('default');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [slideProgress, setSlideProgress] = useState<number>(0);

  // Active movie list according to mode
  const currentMovies = React.useMemo(() => {
    if (rotationMode === 'active_phase') {
      const phaseMovies = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === userCurrentPhase);
      return phaseMovies.length > 0 ? phaseMovies : defaultTitles;
    }
    return defaultTitles;
  }, [rotationMode, userCurrentPhase, defaultTitles]);

  // Reset index when mode or movie list changes
  useEffect(() => {
    setCurrentIndex(0);
    setSlideProgress(0);
  }, [rotationMode, currentMovies.length]);

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
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out filter brightness-[0.72] contrast-105"
        />

        {/* Cinematic Vignettes & Matte Gradients (No purple tints) */}
        <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-doom-950/95 via-doom-950/75 to-transparent" />
        <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-20" />
      </div>

      {/* 2. Top Header HUD: Mode Switcher & Auto-rotation Progress Indicator */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 backdrop-blur-sm bg-black/30">
        <div className="flex items-center gap-2">
          {/* Engine indicator */}
          <div className="inline-flex items-center gap-2 bg-doom-950/90 border border-doom-red/50 px-3 py-1 rounded-full text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-doom-red" />
            <span className="text-gray-200 uppercase tracking-wider font-semibold font-marvel">
              CINEMATIC MULTIVERSE MARQUEE
            </span>
          </div>

          {/* Pause indicator */}
          {isPaused && (
            <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
              PAUSED
            </span>
          )}
        </div>

        {/* Mode Selector Tabs: Curated Showcase (Default) vs Active Phase */}
        <div className="flex items-center gap-1 bg-doom-950/90 border border-doom-border p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setRotationMode('default')}
            className={`px-3 py-1.5 rounded-lg text-xs font-marvel uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              rotationMode === 'default'
                ? 'bg-doom-red text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} className={rotationMode === 'default' ? 'text-white' : 'text-doom-red'} />
            <span>Curated Showcase (Default)</span>
          </button>

          <button
            onClick={() => setRotationMode('active_phase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-marvel uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              rotationMode === 'active_phase'
                ? 'bg-doom-red text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
            title={`Movies from your current phase: ${userCurrentPhase}`}
          >
            <Layers size={12} className={rotationMode === 'active_phase' ? 'text-white' : 'text-doom-gold'} />
            <span className="hidden sm:inline">Active:</span>
            <span className="font-mono text-doom-gold text-[11px]">
              {userCurrentPhase.split('—')[0].trim()}
            </span>
          </button>
        </div>
      </div>

      {/* Auto-rotation Thin Timer Bar */}
      <div className="relative z-10 w-full bg-black/40 h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-doom-red to-doom-gold transition-all duration-75"
          style={{ width: `${slideProgress}%` }}
        />
      </div>

      {/* 3. Main Center Stage: Movie Information & CTAs */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-end max-w-3xl space-y-4">
        {/* Phase Pill & Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-doom-red/50 text-white bg-doom-red/20 font-bold px-2.5 py-0.5">
            {activeMovie.defaultPhaseGroup}
          </Badge>

          <Badge variant="hud">
            {activeMovie.mediaType === 'tv' ? 'TV SERIES' : 'FEATURE FILM'}
          </Badge>

          {/* User Watch Status */}
          {currentStatus === 'completed' && (
            <Badge variant="watched" className="flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Watched</span>
            </Badge>
          )}
          {currentStatus === 'in_progress' && (
            <Badge variant="watching" className="flex items-center gap-1">
              <Clock size={12} />
              <span>Watching</span>
            </Badge>
          )}
        </div>

        {/* Massive Cinematic Title */}
        <h2 className="font-cinematic text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-wider leading-none">
          {activeMovie.title}
        </h2>

        {/* Metadata Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-sans">
          <span className="font-mono text-white font-semibold">{activeMovie.releaseYear}</span>
          <span className="text-gray-600">•</span>
          <span>
            {activeMovie.mediaType === 'tv' 
              ? `${activeMovie.seasons?.length || 1} Seasons • ${activeMovie.seasons?.[0]?.episodes.length || 6} Episodes` 
              : `${activeMovie.runtime} Minutes`}
          </span>
          <span className="text-gray-600">•</span>
          <div className="flex items-center gap-1 text-doom-gold font-mono font-bold">
            <Star size={13} fill="currentColor" />
            <span>{activeMovie.rating.toFixed(1)} / 10</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="text-emerald-400 font-mono text-[11px] uppercase">
            {activeMovie.canonStatus}
          </span>
        </div>

        {/* Why this matters to Doomsday Lore Callout */}
        <div className="bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-border max-w-2xl shadow-card">
          <div className="text-[10px] font-marvel uppercase tracking-wider text-doom-red font-bold flex items-center gap-1.5 mb-1">
            <Sparkles size={12} />
            <span>Why This Matters to Avengers: Doomsday</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 font-sans leading-relaxed">
            {activeMovie.whyItMatters}
          </p>
        </div>

        {/* TV Series Episode Progress Bar (if applicable) */}
        {activeMovie.mediaType === 'tv' && epStats && (
          <div className="max-w-md bg-doom-950/80 border border-doom-border p-2.5 rounded-xl space-y-1">
            <div className="flex justify-between text-[11px] text-gray-300 font-mono">
              <span>Episode Progress</span>
              <span className="text-doom-gold font-bold">
                {epStats.watched} / {epStats.total} Episodes ({epStats.percentage}%)
              </span>
            </div>
            <div className="w-full bg-doom-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-doom-red to-doom-gold rounded-full"
                style={{ width: `${epStats.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Controls using Magic UI ShimmerButton & shadcn Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary CTA: Magic UI ShimmerButton */}
          <ShimmerButton
            onClick={() => onOpenTitleDetails(activeMovie)}
            className="flex items-center gap-2"
          >
            <Info size={16} />
            <span>Inspect Intelligence Dossier</span>
          </ShimmerButton>

          {/* Quick Watch Status Toggle */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (currentStatus === 'completed') {
                updateWatchStatus(activeMovie.id, 'not_started');
              } else if (currentStatus === 'in_progress') {
                updateWatchStatus(activeMovie.id, 'completed');
              } else {
                updateWatchStatus(activeMovie.id, 'in_progress');
              }
            }}
          >
            {currentStatus === 'completed' ? (
              <>
                <CheckCircle2 size={16} className="text-doom-emerald" />
                <span>Mark Not Watched</span>
              </>
            ) : currentStatus === 'in_progress' ? (
              <>
                <CheckCircle2 size={16} className="text-doom-emerald" />
                <span>Mark as Watched</span>
              </>
            ) : (
              <>
                <Play size={16} className="text-doom-gold" />
                <span>Start Watching</span>
              </>
            )}
          </Button>

          {/* Watchlist Hub CTA */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onSelectTab('watchlist')}
            className="text-gray-400 hover:text-white"
          >
            <span>View Full Watchlist</span>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* 4. Bottom Rail: Left/Right Arrows & Interactive Movie Thumbnails */}
      <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-doom-950 via-doom-950/90 to-transparent border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="rounded-full bg-black/60 hover:bg-doom-red hover:text-white"
            title="Previous Movie"
            aria-label="Previous Movie"
          >
            <ChevronLeft size={18} />
          </Button>

          <span className="font-mono text-xs text-gray-400 px-2">
            <span className="text-white font-bold">{currentIndex + 1}</span> / {currentMovies.length}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="rounded-full bg-black/60 hover:bg-doom-red hover:text-white"
            title="Next Movie"
            aria-label="Next Movie"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Thumbnail Carousel Track */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 order-1 sm:order-2 scrollbar-none">
          {currentMovies.map((movie, idx) => {
            const isSelected = idx === currentIndex;
            const isWatched = watchProgress[movie.id]?.status === 'completed';

            return (
              <button
                key={movie.id}
                onClick={() => handleSelectMovie(idx)}
                className={`group relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 text-left ${
                  isSelected
                    ? 'ring-2 ring-doom-red scale-105 w-28 sm:w-36 h-14 sm:h-16 shadow-card'
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
