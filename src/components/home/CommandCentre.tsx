import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Tv, 
  Film, 
  Award, 
  HelpCircle, 
  Compass, 
  Flame,
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { ACHIEVEMENTS } from '../../data/achievements';
import { useAppStore } from '../../services/store';
import { DoomsdayCountdown } from '../common/DoomsdayCountdown';
import { GeometricCube } from '../common/GeometricCube';
import { NavTab } from '../common/Sidebar';

interface CommandCentreProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenTitleDetails: (title: MarvelTitle) => void;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({ onSelectTab, onOpenTitleDetails }) => {
  const { 
    watchProgress, 
    updateWatchStatus, 
    getSeriesEpisodeStats, 
    overallStats, 
    unlockedAchievements,
    collections,
    activeCollectionId
  } = useAppStore();

  // Find currently watching / in-progress titles
  const inProgressTitles = MARVEL_TITLES.filter(
    t => watchProgress[t.id]?.status === 'in_progress'
  );

  // Find recently completed titles
  const recentlyCompletedTitles = MARVEL_TITLES.filter(
    t => watchProgress[t.id]?.status === 'completed'
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

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Cinematic Hero Section with 3D Geometric Chronal Cube & Countdown */}
      <section className="relative rounded-3xl overflow-hidden border border-doom-border/90 bg-gradient-to-b from-doom-900/90 via-doom-950 to-doom-950 p-6 md:p-12 shadow-2xl">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-subtle-grid pointer-events-none opacity-40" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-doom-red/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-doom-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Hero Left Content */}
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-doom-900 border border-doom-red/40 px-3 py-1 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-doom-red animate-ping" />
              <span className="text-gray-300 font-sans tracking-wide">MULTIVERSE WATCH-TRACKING ENGINE</span>
            </div>

            <h1 className="font-cinematic text-5xl sm:text-7xl lg:text-8xl text-white tracking-wider leading-none uppercase text-glow-red">
              YOUR UNIVERSE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-doom-red">
                YOUR COUNTDOWN.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl">
              Track essential cinematic storylines, verify timeline connections, and prepare for the cataclysmic arrival of Victor Von Doom in <strong className="text-white">Avengers: Doomsday</strong>.
            </p>

            {/* Call to actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onSelectTab('watchlist')}
                className="bg-doom-red hover:bg-doom-red-bright text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-glow-red hover:shadow-glow-red-lg transition-all flex items-center gap-2"
              >
                <Play size={16} fill="white" />
                <span>Open Multiverse Watchlist</span>
              </button>

              <button
                onClick={() => onSelectTab('quiz')}
                className="bg-doom-900 hover:bg-doom-850 border border-doom-border hover:border-doom-gold text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <HelpCircle size={16} className="text-doom-gold" />
                <span>Test Lore in Knowledge Arena</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Interactive 3D Chronal Cube Visualizer */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative">
              <GeometricCube size={240} className="mx-auto" />
              <div className="text-center mt-2">
                <span className="text-[10px] font-mono tracking-widest text-doom-gold uppercase bg-doom-950/80 px-2.5 py-1 rounded-full border border-doom-gold/30">
                  ✦ Chronal Convergence Core (Interactive)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Doomsday Release Countdown */}
        <div className="mt-8 pt-8 border-t border-doom-border/80">
          <DoomsdayCountdown variant="hero" />
        </div>
      </section>

      {/* 2. Command Centre Intelligence & Overview Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metallic-card p-5 rounded-2xl border border-doom-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-marvel uppercase tracking-wider">Completion Rate</span>
            <TrendingUp size={16} className="text-doom-red" />
          </div>
          <div className="font-cinematic text-4xl lg:text-5xl text-white font-black tracking-wider my-1">
            {overallStats.completionPercentage}%
          </div>
          <div className="w-full bg-doom-950 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-doom-red to-doom-gold rounded-full"
              style={{ width: `${overallStats.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="metallic-card p-5 rounded-2xl border border-doom-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-marvel uppercase tracking-wider">Movies Watched</span>
            <Film size={16} className="text-doom-gold" />
          </div>
          <div className="font-cinematic text-4xl lg:text-5xl text-white font-black tracking-wider my-1">
            {overallStats.moviesWatched}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Across Marvel cinematic canon
          </div>
        </div>

        <div className="metallic-card p-5 rounded-2xl border border-doom-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-marvel uppercase tracking-wider">Series Completed</span>
            <Tv size={16} className="text-doom-emerald" />
          </div>
          <div className="font-cinematic text-4xl lg:text-5xl text-white font-black tracking-wider my-1">
            {overallStats.seriesCompleted}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            TVA & Multiverse serials
          </div>
        </div>

        <div className="metallic-card p-5 rounded-2xl border border-doom-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span className="font-marvel uppercase tracking-wider">Badges Earned</span>
            <Award size={16} className="text-purple-400" />
          </div>
          <div className="font-cinematic text-4xl lg:text-5xl text-white font-black tracking-wider my-1">
            {unlockedAchievements.length} <span className="text-xl text-gray-400 font-normal">/ {ACHIEVEMENTS.length}</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Operative status active
          </div>
        </div>
      </section>

      {/* 3. Continue Watching / Currently Watching Section */}
      {inProgressTitles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-doom-red animate-pulse" />
              <h3 className="font-cinematic text-2xl md:text-3xl uppercase tracking-wider text-white">
                Continue Watching
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('watchlist')}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTitles.map((title) => {
              const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
              return (
                <div
                  key={title.id}
                  onClick={() => onOpenTitleDetails(title)}
                  className="group metallic-card rounded-2xl overflow-hidden border border-doom-border/80 hover:border-doom-red/50 cursor-pointer transition-all flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-doom-950">
                    <img
                      src={title.backdropPath || title.posterPath}
                      alt={title.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 marvel-badge px-2 py-0.5 text-[10px] rounded">
                      {title.mediaType === 'tv' ? 'TV SERIES' : 'MOVIE'}
                    </span>

                    <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-doom-red text-white flex items-center justify-center shadow-glow-red group-hover:scale-110 transition-transform">
                      <Play size={16} fill="white" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-marvel text-lg text-white font-bold tracking-wide truncate">
                        {title.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {title.whyItMatters}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-3 pt-3 border-t border-doom-border/60">
                      {title.mediaType === 'tv' && epStats ? (
                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-mono">
                            <span className="text-gray-400">
                              {epStats.nextUnwatched 
                                ? `Next: S${epStats.nextUnwatched.season} E${epStats.nextUnwatched.episode}` 
                                : 'All Episodes Watched'}
                            </span>
                            <span className="text-doom-gold font-bold">{epStats.watched}/{epStats.total} eps</span>
                          </div>
                          <div className="w-full bg-doom-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-doom-gold rounded-full transition-all"
                              style={{ width: `${epStats.percentage}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-doom-gold font-mono">
                          <span>Marked In Progress</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateWatchStatus(title.id, 'completed');
                            }}
                            className="text-[11px] bg-doom-800 hover:bg-doom-red hover:text-white px-2 py-0.5 rounded text-gray-300 transition-colors"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Editorial Next Up Spotlight */}
      <section className="metallic-card rounded-3xl overflow-hidden border border-doom-border/90 p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-doom-900 via-doom-850 to-doom-950">
        <div className="w-full lg:w-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative group">
          <img
            src={recommendedTitle.posterPath}
            alt={recommendedTitle.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-doom-950/80 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 marvel-badge px-2 py-0.5 text-xs rounded">
            RECOMMENDED NEXT
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-doom-gold">
              {recommendedTitle.defaultPhaseGroup}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">#{recommendedTitle.defaultSequenceNumber} in sequence</span>
          </div>

          <h3 className="font-cinematic text-4xl md:text-5xl text-white uppercase tracking-wider">
            {recommendedTitle.title}
          </h3>

          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            {recommendedTitle.synopsis}
          </p>

          <div className="bg-doom-950/80 p-4 rounded-xl border border-doom-border/80">
            <div className="text-[10px] font-marvel uppercase tracking-wider text-doom-red font-bold mb-1">
              Why This Matters To Avengers: Doomsday
            </div>
            <p className="text-xs text-gray-300 italic font-sans">
              "{recommendedTitle.whyItMatters}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenTitleDetails(recommendedTitle)}
              className="bg-doom-red hover:bg-doom-red-bright text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-glow-red transition-all flex items-center gap-2"
            >
              <span>Explore Lore & Episodes</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => updateWatchStatus(recommendedTitle.id, 'completed')}
              className="bg-doom-900 hover:bg-doom-800 border border-doom-border hover:border-doom-emerald text-gray-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={15} className="text-doom-emerald" />
              <span>Mark as Watched</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Progress by Cinematic Phase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cinematic text-2xl md:text-3xl uppercase tracking-wider text-white">
            Multiverse Phase Progress
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {overallStats.completedCount} / {overallStats.totalTitles} Titles Complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {phaseStats.map((phase, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab('watchlist')}
              className="metallic-card p-5 rounded-2xl border border-doom-border/80 hover:border-doom-border-light cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-doom-gold font-mono font-bold text-[11px]">
                    0{idx + 1}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {phase.completed}/{phase.total} Done
                  </span>
                </div>

                <h4 className="font-marvel text-lg text-white font-bold tracking-wide line-clamp-1 mb-2">
                  {phase.name.split('—')[1]?.trim() || phase.name}
                </h4>

                <div className="space-y-1 mb-4">
                  {phase.titles.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs truncate">
                      {watchProgress[t.id]?.status === 'completed' ? (
                        <CheckCircle2 size={12} className="text-doom-emerald shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shrink-0" />
                      )}
                      <span className={`truncate ${watchProgress[t.id]?.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                  {phase.titles.length > 3 && (
                    <div className="text-[10px] text-gray-500 font-mono pl-3.5">
                      +{phase.titles.length - 3} more titles...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="w-full bg-doom-950 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-doom-red to-doom-gold rounded-full transition-all"
                    style={{ width: `${phase.percent}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 text-right font-mono">
                  {phase.percent}% completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quick Lore Arena & Multiverse Explorer Callout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge Arena Banner */}
        <div 
          onClick={() => onSelectTab('quiz')}
          className="metallic-card rounded-2xl p-6 border border-doom-border hover:border-doom-gold/50 cursor-pointer transition-all flex items-center justify-between group bg-gradient-to-br from-doom-900 to-doom-950"
        >
          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-gold font-bold">
              KNOWLEDGE ARENA
            </span>
            <h4 className="font-cinematic text-2xl md:text-3xl text-white uppercase tracking-wider">
              Test Your Lore Knowledge
            </h4>
            <p className="text-xs text-gray-400 font-sans">
              Play spoiler-protected quizzes tailored exclusively to content you have marked as watched.
            </p>
            <div className="pt-2 text-xs text-doom-gold font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Battle Challenge</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-doom-gold/10 border border-doom-gold/30 flex items-center justify-center text-doom-gold shadow-glow-gold shrink-0">
            <HelpCircle size={32} />
          </div>
        </div>

        {/* Multiverse Explorer Banner */}
        <div 
          onClick={() => onSelectTab('multiverse')}
          className="metallic-card rounded-2xl p-6 border border-doom-border hover:border-doom-red/50 cursor-pointer transition-all flex items-center justify-between group bg-gradient-to-br from-doom-900 to-doom-950"
        >
          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-red font-bold">
              MULTIVERSE EXPLORER
            </span>
            <h4 className="font-cinematic text-2xl md:text-3xl text-white uppercase tracking-wider">
              Interactive Timelines & Incursions
            </h4>
            <p className="text-xs text-gray-400 font-sans">
              Explore interconnected nodes across Earth-616, the TVA, Earth-838, Fox X-Men, and Doctor Doom's Battleworld.
            </p>
            <div className="pt-2 text-xs text-doom-red font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Multiverse Graph</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-doom-red/10 border border-doom-red/30 flex items-center justify-center text-doom-red shadow-glow-red shrink-0">
            <Compass size={32} />
          </div>
        </div>
      </section>
    </div>
  );
};
