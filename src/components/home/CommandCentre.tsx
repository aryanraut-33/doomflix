import React, { useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { ACHIEVEMENTS } from '../../data/achievements';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { RotatingHeroPane } from './RotatingHeroPane';
import { NavTab } from '../common/Sidebar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { NumberTicker } from '../magicui/number-ticker';
import { BorderBeam } from '../magicui/border-beam';

interface CommandCentreProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({ onSelectTab, onOpenTitleDetails }) => {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const { 
    watchProgress, 
    updateWatchStatus, 
    getSeriesEpisodeStats, 
    overallStats, 
    unlockedAchievements,
  } = useAppStore();

  // Find currently watching / in-progress titles
  const inProgressTitles = MARVEL_TITLES.filter(
    t => watchProgress[t.id]?.status === 'in_progress'
  );

  // Determine Recommended Next Title
  const recommendedTitle: MarvelTitle = MARVEL_TITLES.find(
    t => !watchProgress[t.id] || watchProgress[t.id].status === 'not_started'
  ) || MARVEL_TITLES[0];

  // Calculate phase breakdown metrics
  const phaseStats = PHASE_ORDER.map(phaseName => {
    const titlesInPhase = MARVEL_TITLES.filter(t => t.defaultPhaseGroup === phaseName);
    const completedInPhase = titlesInPhase.filter(t => watchProgress[t.id]?.status === 'completed');
    const percent = titlesInPhase.length > 0 
      ? Math.round((completedInPhase.length / titlesInPhase.length) * 100) 
      : 0;
    return {
      name: phaseName,
      total: titlesInPhase.length,
      completed: completedInPhase.length,
      percent,
      titles: titlesInPhase
    };
  });

  // Identify active operational phase
  const activePhaseData = phaseStats.find(p => p.percent < 100) || phaseStats[0];

  return (
    <div className="pb-16">
      {/* 1. Full-Bleed Hero — no padding, edge-to-edge */}
      <RotatingHeroPane 
        onSelectTab={onSelectTab} 
        onOpenTitleDetails={onOpenTitleDetails} 
      />

      {/* Everything below hero gets constrained padding */}
      <div className="px-4 sm:px-6 md:px-8 lg:pl-32 lg:pr-12 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10 pt-6 sm:pt-10">

        {/* 2. Numbered Phase Movies Sequence (Netflix Top-10 Style) */}
        <section className="relative group/rail">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              {activePhaseData.name.split('—')[1]?.trim() || activePhaseData.name}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('watchlist')}
                className="text-xs text-gray-400 hover:text-white font-medium flex items-center gap-1 transition-colors mr-1"
              >
                View all <ChevronRight size={14} />
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scrollRail('left')}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                  aria-label="Scroll left"
                  title="Previous titles"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollRail('right')}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                  aria-label="Scroll right"
                  title="Next titles"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Left / Right Hover Buttons for desktop rail */}
          <button
            onClick={() => scrollRail('left')}
            className="hidden lg:flex absolute left-0 top-1/2 translate-y-2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white items-center justify-center shadow-xl opacity-0 group-hover/rail:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollRail('right')}
            className="hidden lg:flex absolute right-0 top-1/2 translate-y-2 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white items-center justify-center shadow-xl opacity-0 group-hover/rail:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>

          {/* Horizontal Scrolling Rail with Giant Netflix Outlined Numbers */}
          <div 
            ref={railRef}
            className="flex items-end gap-6 sm:gap-10 overflow-x-auto pb-4 scrollbar-none no-scrollbar pl-4 sm:pl-8 scroll-smooth"
          >
            {activePhaseData.titles.map((title, idx) => {
              const rank = idx + 1;
              const isWatched = watchProgress[title.id]?.status === 'completed';
              const isWatching = watchProgress[title.id]?.status === 'in_progress';
              const streamInfo = title.streamingIndia?.[0];

              return (
                <div
                  key={title.id}
                  onClick={() => onOpenTitleDetails(title)}
                  className="group relative flex items-end shrink-0 cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03]"
                >
                  {/* Giant Hollow Ranking Number positioned prominently on the left */}
                  <div className="netflix-rank-number shrink-0 z-0 pointer-events-none select-none">
                    {rank}
                  </div>

                  {/* Movie Poster Card slightly overlapping the number on the right */}
                  <div className="-ml-1 sm:-ml-2 relative w-36 sm:w-44 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 z-10 bg-doom-950 transition-all shadow-xl">
                    <CinematicImage
                      src={title.posterPath}
                      alt={title.title}
                      fallbackTitle={title.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                    {/* Status Badge */}
                    {isWatched && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 size={12} />
                      </div>
                    )}

                    {/* Title & metadata */}
                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1">
                        {title.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                        <span>{title.releaseYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Continue Watching */}
        {inProgressTitles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
                Continue Watching
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {inProgressTitles.map((title) => {
                const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
                return (
                  <div
                    key={title.id}
                    onClick={() => onOpenTitleDetails(title)}
                    className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-white/25 cursor-pointer transition-all bg-doom-950"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <CinematicImage
                        src={title.backdropPath || title.posterPath}
                        alt={title.title}
                        fallbackTitle={title.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-doom-950 to-transparent" />
                      
                      <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white text-doom-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} fill="currentColor" />
                      </button>
                    </div>

                    <div className="p-3">
                      <h4 className="text-sm font-medium text-white truncate">{title.title}</h4>
                      {epStats && (
                        <div className="mt-2">
                          <div className="w-full bg-white/10 h-0.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${epStats.percentage}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">{epStats.watched}/{epStats.total} episodes</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Up Next — Subtle & Compact */}
        {(() => {
          const recStream = recommendedTitle.streamingIndia?.[0];
          const recStreamUrl = recStream?.directUrl || recStream?.searchUrl;

          return (
            <section className="relative rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Small compact poster thumbnail */}
                <div 
                  onClick={() => onOpenTitleDetails(recommendedTitle)}
                  className="w-14 sm:w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-doom-950 cursor-pointer border border-white/10 shadow-sm"
                >
                  <CinematicImage
                    src={recommendedTitle.posterPath}
                    alt={recommendedTitle.title}
                    fallbackTitle={recommendedTitle.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 font-mono">Up Next</span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-[11px] text-gray-400 font-mono">{recommendedTitle.releaseYear} • {recommendedTitle.mediaType === 'tv' ? 'Series' : `${recommendedTitle.runtime}m`}</span>
                  </div>
                  
                  <h3 
                    onClick={() => onOpenTitleDetails(recommendedTitle)}
                    className="text-sm sm:text-base font-semibold text-white truncate cursor-pointer hover:text-emerald-300 transition-colors"
                  >
                    {recommendedTitle.title}
                  </h3>
                  
                  <p className="text-xs text-gray-400 line-clamp-1 max-w-xl mt-0.5 font-sans hidden sm:block">
                    {recommendedTitle.synopsis}
                  </p>
                </div>

                {/* Compact Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {recStreamUrl && (
                    <a
                      href={recStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-doom-950 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-sm"
                      title={`Stream ${recommendedTitle.title}`}
                    >
                      <Play size={12} fill="currentColor" />
                      <span className="hidden sm:inline">Watch</span>
                    </a>
                  )}

                  <button
                    onClick={() => onOpenTitleDetails(recommendedTitle)}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    Info
                  </button>
                </div>
              </div>
            </section>
          );
        })()}

        {/* 5. Phase Progress — compact */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Your Progress
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              {overallStats.completedCount}/{overallStats.totalTitles} watched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {phaseStats.map((phase, idx) => {
              const isActive = phase.name === activePhaseData.name;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectTab('watchlist')}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isActive 
                      ? 'border-emerald-500/40 bg-emerald-950/10' 
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white truncate pr-2">
                      {phase.name.split('—')[1]?.trim() || phase.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono shrink-0">
                      {phase.completed}/{phase.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        phase.percent === 100 ? 'bg-emerald-500' : isActive ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                      style={{ width: `${phase.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Quiz callout — simple */}
        <section
          onClick={() => onSelectTab('quiz')}
          className="p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-lg font-semibold text-white">Test Your Knowledge</h3>
            <p className="text-sm text-gray-500 mt-1">
              Spoiler-safe quizzes based on what you've watched.
            </p>
          </div>
          <ChevronRight size={20} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </section>
      </div>
    </div>
  );
};
