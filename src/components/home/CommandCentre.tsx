import React, { useRef } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';
import { RotatingHeroPane } from './RotatingHeroPane';
import { NavTab } from '../common/Sidebar';

interface CommandCentreProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({
  onSelectTab,
  onOpenTitleDetails,
}) => {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = direction === 'left' ? -360 : 360;
    railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const {
    watchProgress,
    getSeriesEpisodeStats,
    overallStats,
  } = useAppStore();

  const inProgressTitles = MARVEL_TITLES.filter(
    (t) => watchProgress[t.id]?.status === 'in_progress'
  );

  const recommendedTitle: MarvelTitle =
    MARVEL_TITLES.find(
      (t) => !watchProgress[t.id] || watchProgress[t.id].status === 'not_started'
    ) || MARVEL_TITLES[0];

  const phaseStats = PHASE_ORDER.map((phaseName) => {
    const titlesInPhase = MARVEL_TITLES.filter((t) => t.defaultPhaseGroup === phaseName);
    const completedInPhase = titlesInPhase.filter(
      (t) => watchProgress[t.id]?.status === 'completed'
    );
    const percent =
      titlesInPhase.length > 0
        ? Math.round((completedInPhase.length / titlesInPhase.length) * 100)
        : 0;
    return {
      name: phaseName,
      total: titlesInPhase.length,
      completed: completedInPhase.length,
      percent,
      titles: titlesInPhase,
    };
  });

  const activePhaseData = phaseStats.find((p) => p.percent < 100) || phaseStats[0];

  return (
    <div className="pb-16">
      {/* Full-Bleed Cinema Hero */}
      <RotatingHeroPane
        onSelectTab={onSelectTab}
        onOpenTitleDetails={onOpenTitleDetails}
      />

      <div className="px-4 sm:px-6 md:px-8 lg:pl-32 lg:pr-12 max-w-7xl mx-auto w-full space-y-10 pt-8 sm:pt-10">
        {/* Phase Sequence Rail */}
        <section className="relative">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              {activePhaseData.name.split('—')[1]?.trim() || activePhaseData.name}
            </h2>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSelectTab('watchlist')}
                className="ui-dim ui-focus h-8 px-2.5 rounded-lg text-xs text-slate-300 hover:text-white font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight size={14} className="ui-icon-nudge" aria-hidden="true" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollRail('left')}
                  className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-200"
                  aria-label="Scroll left"
                  title="Previous titles"
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail('right')}
                  className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-slate-200"
                  aria-label="Scroll right"
                  title="Next titles"
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={railRef}
            className="scroll-fade-x flex items-end gap-6 sm:gap-9 overflow-x-auto pb-3 pt-1 pl-3 sm:pl-6 pr-8 scrollbar-none no-scrollbar scroll-smooth"
          >
            {activePhaseData.titles.map((title, idx) => {
              const rank = idx + 1;
              const isWatched = watchProgress[title.id]?.status === 'completed';

              return (
                <button
                  key={title.id}
                  type="button"
                  onClick={() => onOpenTitleDetails(title)}
                  aria-label={`#${rank} ${title.title} (${title.releaseYear})`}
                  className="ui-press ui-press--surface ui-press--on-dark ui-focus group relative flex items-end shrink-0 text-left rounded-xl p-1"
                >
                  <div className="netflix-rank-number shrink-0 z-0 pointer-events-none select-none">
                    {rank}
                  </div>

                  <div className="-ml-1.5 sm:-ml-2 relative w-36 sm:w-44 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/25 z-10 bg-[#0f131b] transition-[border-color] duration-200 shadow-lg">
                    <CinematicImage
                      src={title.posterPath}
                      alt={title.title}
                      fallbackTitle={title.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

                    {isWatched && (
                      <span
                        aria-label="Watched"
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-doom-950 flex items-center justify-center"
                      >
                        <CheckCircle2 size={12} aria-hidden="true" />
                      </span>
                    )}

                    <div className="absolute bottom-0 inset-x-0 p-3">
                      <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1">
                        {title.title}
                      </h4>
                      <span className="block text-[11px] text-slate-300 font-mono tabular-nums mt-1">
                        {title.releaseYear}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Continue Watching */}
        {inProgressTitles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Continue Watching
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {inProgressTitles.map((title) => {
                const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
                return (
                  <button
                    key={title.id}
                    type="button"
                    onClick={() => onOpenTitleDetails(title)}
                    className="ui-press ui-press--surface ui-press--on-dark ui-focus group text-left rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 bg-[#0f131b] p-2"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-doom-950">
                      <CinematicImage
                        src={title.backdropPath || title.posterPath}
                        alt={title.title}
                        fallbackTitle={title.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                      <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-doom-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Play size={13} fill="currentColor" className="ml-px" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="pt-2.5 px-1 pb-1">
                      <h4 className="text-sm font-medium text-white truncate">{title.title}</h4>
                      {epStats && (
                        <div className="mt-2">
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${epStats.percentage}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono tabular-nums mt-1">
                            {epStats.watched}/{epStats.total} episodes
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Up Next Strip */}
        {(() => {
          const recStream = recommendedTitle.streamingIndia?.[0];
          const recStreamUrl = recStream?.directUrl || recStream?.searchUrl;

          return (
            <section className="rounded-2xl border border-white/10 bg-[#0f131b] p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => onOpenTitleDetails(recommendedTitle)}
                  aria-label={`Inspect ${recommendedTitle.title}`}
                  className="ui-press ui-press--on-dark ui-focus w-14 sm:w-16 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-doom-950 border border-white/10"
                >
                  <CinematicImage
                    src={recommendedTitle.posterPath}
                    alt={recommendedTitle.title}
                    fallbackTitle={recommendedTitle.title}
                    className="w-full h-full object-cover"
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums mb-0.5">
                    <span className="font-semibold text-emerald-400">Up Next</span>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <span className="text-slate-400">
                      {recommendedTitle.releaseYear} ·{' '}
                      {recommendedTitle.mediaType === 'tv'
                        ? 'Series'
                        : `${recommendedTitle.runtime}m`}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                    {recommendedTitle.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xl mt-0.5 hidden sm:block">
                    {recommendedTitle.synopsis}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {recStreamUrl && (
                    <a
                      href={recStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-press ui-focus h-8 inline-flex items-center gap-1.5 bg-white text-doom-950 px-3 rounded-lg font-semibold text-xs"
                      title={`Stream ${recommendedTitle.title}`}
                    >
                      <Play size={13} fill="currentColor" className="ml-px" aria-hidden="true" />
                      <span className="hidden sm:inline">Watch</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenTitleDetails(recommendedTitle)}
                    className="ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-white/[0.06] border border-white/12 inline-flex items-center justify-center"
                  >
                    Info
                  </button>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Phase Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              Your Progress
            </h2>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {overallStats.completedCount}/{overallStats.totalTitles} watched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {phaseStats.map((phase, idx) => {
              const isActive = phase.name === activePhaseData.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectTab('watchlist')}
                  className={`ui-press ui-press--surface ui-press--on-dark ui-focus text-left p-4 rounded-xl border ${
                    isActive
                      ? 'border-emerald-500/40 bg-emerald-950/15'
                      : 'border-white/10 bg-[#0f131b] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-sm font-medium text-white truncate">
                      {phase.name.split('—')[1]?.trim() || phase.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono shrink-0 tabular-nums">
                      {phase.completed}/{phase.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.08] h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-[width,background-color] duration-300 ease-out ${
                        phase.percent === 100
                          ? 'bg-emerald-400'
                          : isActive
                          ? 'bg-emerald-500'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${phase.percent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Lore Quiz Entry */}
        <section>
          <button
            type="button"
            onClick={() => onSelectTab('quiz')}
            className="ui-press ui-press--surface ui-press--on-dark ui-focus w-full p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0f131b] hover:border-white/20 flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Lore Challenge
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Questions filtered strictly to titles you have watched.
              </p>
            </div>
            <ChevronRight
              size={18}
              className="ui-icon-nudge text-slate-400 shrink-0"
              aria-hidden="true"
            />
          </button>
        </section>
      </div>
    </div>
  );
};
