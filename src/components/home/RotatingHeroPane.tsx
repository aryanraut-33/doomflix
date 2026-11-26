import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  User,
  Bookmark,
  Star,
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { NavTab } from '../common/Sidebar';

interface RotatingHeroPaneProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

const DEFAULT_SHOWCASE_IDS = [
  'avengers-infinity-war',
  'avengers-endgame',
  'fantastic-four-first-steps',
  'the-avengers',
  'dr-strange-multiverse-madness',
  'loki-s1',
];

export const RotatingHeroPane: React.FC<RotatingHeroPaneProps> = ({
  onSelectTab,
  onOpenTitleDetails,
}) => {
  const { watchProgress, user, updateWatchStatus } = useAppStore();

  const defaultTitles: MarvelTitle[] = React.useMemo(() => {
    return DEFAULT_SHOWCASE_IDS.map((id) => MARVEL_TITLES.find((t) => t.id === id)).filter(
      (t): t is MarvelTitle => Boolean(t)
    );
  }, []);

  const userCurrentPhase = React.useMemo(() => {
    for (const phaseName of PHASE_ORDER) {
      const titlesInPhase = MARVEL_TITLES.filter((t) => t.defaultPhaseGroup === phaseName);
      if (titlesInPhase.length > 0) {
        const isPhaseIncomplete = titlesInPhase.some(
          (t) => watchProgress[t.id]?.status !== 'completed'
        );
        if (isPhaseIncomplete) return phaseName;
      }
    }
    return PHASE_ORDER[0];
  }, [watchProgress]);

  const currentMovies = React.useMemo(() => {
    if (!user.isGuest) {
      const phaseMovies = MARVEL_TITLES.filter(
        (t) => t.defaultPhaseGroup === userCurrentPhase
      );
      return phaseMovies.length > 0 ? phaseMovies : defaultTitles;
    }
    return defaultTitles;
  }, [user.isGuest, userCurrentPhase, defaultTitles]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentMovies.length, user.isGuest]);

  const activeMovie = currentMovies[currentIndex] || currentMovies[0] || defaultTitles[0];

  useEffect(() => {
    if (isPaused || currentMovies.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % currentMovies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, currentMovies.length, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + currentMovies.length) % currentMovies.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % currentMovies.length);
  };

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
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX < 0) handleNext();
      else handlePrev();
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
      {/* MOBILE FORMAT (< lg) */}
      <div className="block lg:hidden w-full select-none pt-3">
        <header className="px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/image.png"
              alt="Doomflix"
              className="doom-crest-mark w-9 h-9 object-cover shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-cinematic text-xl font-bold tracking-wider text-white leading-tight">
                DOOM<span className="text-emerald-400">FLIX</span>
              </span>
              <span className="text-[11px] text-slate-400 leading-none">
                Doomsday Watch Ledger
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectTab('discover')}
              aria-label="Search"
              className="ui-press ui-press--on-dark ui-focus w-9 h-9 rounded-full bg-white/[0.06] border border-white/12 flex items-center justify-center text-slate-200 hover:text-white"
            >
              <Search size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              aria-label="Profile"
              className="ui-press ui-press--on-dark ui-focus w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-300 font-semibold text-xs uppercase"
            >
              {user.isGuest ? <User size={15} aria-hidden="true" /> : user.username.charAt(0)}
            </button>
          </div>
        </header>

        <div className="px-4 pt-2">
          <div
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-doom-950 shadow-[0_16px_40px_rgba(0,0,0,0.75)] cursor-grab active:cursor-grabbing touch-pan-y"
            onClick={() => onOpenTitleDetails(activeMovie)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <CinematicImage
              key={activeMovie.id}
              src={activeMovie.posterPath || activeMovie.backdropPath}
              alt={activeMovie.title}
              fallbackTitle={activeMovie.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />

            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
              <span className="inline-flex items-center bg-black/65 backdrop-blur-md border border-white/15 px-2.5 h-7 rounded-full text-[11px] font-medium text-slate-100">
                {activeMovie.mediaType === 'tv' ? 'Series' : 'Feature'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateWatchStatus(
                    activeMovie.id,
                    currentStatus === 'completed' ? 'not_started' : 'completed'
                  );
                }}
                aria-label="Toggle Watched"
                aria-pressed={currentStatus === 'completed'}
                className={`ui-press ui-press--on-dark ui-focus w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border ${
                  currentStatus === 'completed'
                    ? 'bg-emerald-500 text-doom-950 border-emerald-400'
                    : 'bg-black/65 text-white/90 border-white/15'
                }`}
              >
                {currentStatus === 'completed' ? (
                  <CheckCircle2 size={16} className="ui-pop-icon" aria-hidden="true" />
                ) : (
                  <Bookmark size={15} className="ui-pop-icon" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 inset-x-4 z-10 flex flex-col gap-2.5">
              <h2 className="font-cinematic text-3xl sm:text-4xl text-white uppercase tracking-wider leading-[0.95]">
                {activeMovie.title}
              </h2>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-semibold text-emerald-400">{activeMovie.releaseYear}</span>
                  <span aria-hidden="true" className="text-slate-500">/</span>
                  <span>
                    {activeMovie.mediaType === 'tv'
                      ? `${activeMovie.seasons?.length || 1}S`
                      : `${activeMovie.runtime}m`}
                  </span>
                  {primaryStream && (
                    <>
                      <span aria-hidden="true" className="text-slate-500">/</span>
                      <span className="text-slate-300">{primaryStream.provider}</span>
                    </>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-amber-400 font-semibold font-mono bg-black/55 backdrop-blur-sm px-2 h-6 rounded-full border border-white/10">
                  <Star size={11} fill="currentColor" aria-hidden="true" />
                  <span className="tabular-nums text-[11px]">{activeMovie.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                {streamUrl && (
                  <a
                    href={streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ui-press ui-focus flex-1 h-10 inline-flex items-center justify-center gap-2 bg-white text-doom-950 px-4 rounded-full font-semibold text-xs shadow-md"
                  >
                    <Play size={13} fill="currentColor" className="ml-px" aria-hidden="true" />
                    <span>Watch Now</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTitleDetails(activeMovie);
                  }}
                  aria-label="More Info"
                  className="ui-press ui-press--on-dark ui-focus w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0"
                >
                  <Info size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 pt-1">
                {currentMovies.map((movie, idx) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className="ui-press ui-press--on-dark ui-focus h-6 px-1.5 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
                    aria-label={`Show ${movie.title}`}
                    aria-current={idx === currentIndex ? 'true' : undefined}
                  >
                    <span
                      className={`block rounded-full transition-[width,background-color] duration-250 ease-out ${
                        idx === currentIndex ? 'w-5 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/35'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP FORMAT (lg+) */}
      <section
        className="hidden lg:block relative w-screen -ml-[50vw] left-1/2 overflow-hidden bg-doom-950 select-none group"
        style={{ minHeight: 'calc(100vh - 56px)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 z-0">
          <CinematicImage
            key={activeMovie.id}
            src={activeMovie.backdropPath || activeMovie.posterPath}
            alt={activeMovie.title}
            fallbackTitle={activeMovie.title}
            fallbackSubtitle={`${activeMovie.releaseYear}`}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-doom-950/92 via-doom-950/45 to-transparent" />
        </div>

        <div
          className="relative z-10 h-full flex flex-col justify-end pl-32 pr-16 pb-16 pt-32 max-w-7xl mx-auto"
          style={{ minHeight: 'calc(100vh - 56px)' }}
        >
          <h1 className="font-cinematic text-6xl xl:text-8xl text-white uppercase tracking-wider leading-[0.9] max-w-3xl">
            {activeMovie.title}
          </h1>

          <div className="flex items-center gap-3 mt-4 text-sm text-slate-300 tabular-nums">
            <span className="text-emerald-400 font-semibold">{activeMovie.releaseYear}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>
              {activeMovie.mediaType === 'tv'
                ? `${activeMovie.seasons?.length || 1} Seasons`
                : `${activeMovie.runtime} min`}
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
              <Star size={13} fill="currentColor" aria-hidden="true" />
              {activeMovie.rating.toFixed(1)}
            </span>
            {currentStatus === 'completed' && (
              <>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 size={13} aria-hidden="true" /> Watched
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-xl mt-3">
            {activeMovie.synopsis}
          </p>

          <div className="flex items-center gap-3 mt-5">
            {streamUrl && (
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-press ui-focus h-10 inline-flex items-center gap-2 bg-white text-doom-950 px-6 rounded-lg font-semibold text-sm"
                title={`Stream ${activeMovie.title}`}
              >
                <Play size={15} fill="currentColor" className="ml-px" aria-hidden="true" />
                <span>Watch now</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => onOpenTitleDetails(activeMovie)}
              className="ui-press ui-press--on-dark ui-focus w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white"
              aria-label={`More details for ${activeMovie.title}`}
              title="More Info"
            >
              <Info size={17} aria-hidden="true" />
            </button>
          </div>

          {primaryStream && (
            <div className="mt-3 text-xs text-slate-400">
              Streaming on <span className="text-slate-200 font-medium">{primaryStream.provider}</span>
            </div>
          )}

          {/* Slide Indicators with crisp hit areas */}
          <div className="flex items-center gap-1.5 mt-7">
            {currentMovies.map((movie, idx) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="ui-press ui-press--on-dark ui-focus h-6 px-1.5 flex items-center rounded-full hover:bg-white/10 active:bg-white/20"
                aria-label={`Slide ${idx + 1}: ${movie.title}`}
                aria-current={idx === currentIndex ? 'true' : undefined}
              >
                <span
                  className={`block h-[3px] rounded-full transition-[width,background-color] duration-300 ease-out ${
                    idx === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/55'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Slide Navigation Arrows (Right arrow above Left arrow, click-glow free) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => handleNext(e)}
            className="ui-press ui-press--on-dark ui-focus w-11 h-11 rounded-full text-white/80 hover:text-white flex items-center justify-center bg-black/40 border border-white/10"
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight size={24} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => handlePrev(e)}
            className="ui-press ui-press--on-dark ui-focus w-11 h-11 rounded-full text-white/80 hover:text-white flex items-center justify-center bg-black/40 border border-white/10"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft size={24} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
};
