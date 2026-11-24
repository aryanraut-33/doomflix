import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  ExternalLink,
  Plus
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

export const RotatingHeroPane: React.FC<RotatingHeroPaneProps> = ({ 
  onSelectTab, 
  onOpenTitleDetails 
}) => {
  const { watchProgress, user } = useAppStore();

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

  const currentMovies = React.useMemo(() => {
    if (!user.isGuest) {
      const phaseMovies = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === userCurrentPhase);
      return phaseMovies.length > 0 ? phaseMovies : defaultTitles;
    }
    return defaultTitles;
  }, [user.isGuest, userCurrentPhase, defaultTitles]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Reset index when movies array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentMovies.length, user.isGuest]);

  const activeMovie = currentMovies[currentIndex] || currentMovies[0];

  // Auto-rotation timer (7 seconds per slide)
  useEffect(() => {
    if (isPaused || currentMovies.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex(current => (current + 1) % currentMovies.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, currentMovies.length, currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + currentMovies.length) % currentMovies.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % currentMovies.length);
  };

  if (!activeMovie) return null;

  const currentStatus = watchProgress[activeMovie.id]?.status || 'not_started';
  const primaryStream = activeMovie.streamingIndia?.[0];
  const streamUrl = primaryStream?.directUrl || primaryStream?.searchUrl;
  const isDirect = Boolean(primaryStream?.directUrl);

  return (
    <section 
      className="relative w-screen -ml-[50vw] left-1/2 overflow-hidden bg-doom-950 select-none"
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
      <div className="relative z-10 h-full flex flex-col justify-end pl-28 sm:pl-32 lg:pl-36 pr-6 sm:pr-12 lg:pr-16 pb-16 sm:pb-20 pt-32" style={{ minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Title */}
        <h1 className="font-cinematic text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white uppercase tracking-wider leading-[0.9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-3xl">
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
              className={`h-0.5 rounded-full transition-all duration-500 ${
                idx === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Side navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
};
