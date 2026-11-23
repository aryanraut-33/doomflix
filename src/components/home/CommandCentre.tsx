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
  ChevronRight, 
  Bookmark,
  Layers,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { ACHIEVEMENTS } from '../../data/achievements';
import { useAppStore } from '../../services/store';
import { DoomsdayCountdown } from '../common/DoomsdayCountdown';
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
    <div className="space-y-10 pb-16">
      {/* 1. Cinematic Rotating Hero Screen (Curated Showcase & Active Phase Movies) */}
      <RotatingHeroPane 
        onSelectTab={onSelectTab} 
        onOpenTitleDetails={onOpenTitleDetails} 
      />

      {/* 2. Official Avengers: Doomsday Nexus Countdown */}
      <DoomsdayCountdown variant="hero" />

      {/* 3. Asymmetric Mission Telemetry Bar (No generic 4-card SaaS grid) */}
      <section className="metallic-card p-6 rounded-2xl border border-border flex flex-col lg:flex-row items-stretch justify-between gap-6 shadow-card">
        {/* Left: Active Phase Mission Progress */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doom-red animate-pulse" />
              <span className="font-marvel uppercase tracking-wider text-muted-foreground font-semibold">
                Active Multiverse Mission
              </span>
            </div>
            <span className="font-mono text-doom-gold text-xs font-bold">
              <NumberTicker value={activePhaseData.percent} />% PREPARED
            </span>
          </div>

          <div className="font-cinematic text-2xl sm:text-3xl text-white uppercase tracking-wider">
            {activePhaseData.name}
          </div>

          <Progress value={activePhaseData.percent} indicatorClassName="bg-gradient-to-r from-doom-red to-doom-gold" />

          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{activePhaseData.completed} of {activePhaseData.total} Phase Titles Verified</span>
            <button
              onClick={() => onSelectTab('watchlist')}
              className="text-doom-red hover:underline font-semibold"
            >
              Open Phase Sequence →
            </button>
          </div>
        </div>

        {/* Center Divider */}
        <div className="hidden lg:block w-[1px] bg-border my-1" />

        {/* Right: Telemetry Metrics in High-Density Alignment */}
        <div className="flex items-center gap-8 justify-around lg:justify-start px-2 sm:px-6">
          <div className="text-center sm:text-left">
            <div className="text-[10px] font-marvel uppercase tracking-widest text-muted-foreground font-semibold">
              Readiness Status
            </div>
            <div className="font-cinematic text-4xl sm:text-5xl text-white font-black tracking-wider leading-none mt-1">
              <NumberTicker value={overallStats.completionPercentage} />%
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {overallStats.completedCount}/{overallStats.totalTitles} Titles Watched
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-[10px] font-marvel uppercase tracking-widest text-muted-foreground font-semibold">
              Badges Cleared
            </div>
            <div className="font-cinematic text-4xl sm:text-5xl text-doom-gold font-black tracking-wider leading-none mt-1">
              <NumberTicker value={unlockedAchievements.length} />
              <span className="text-xl text-muted-foreground">/{ACHIEVEMENTS.length}</span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Level {Math.max(1, Math.floor(unlockedAchievements.length / 2))} Operative
            </div>
          </div>
        </div>
      </section>

      {/* 4. Continue Watching / Currently Watching Section */}
      {inProgressTitles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-doom-red" />
              <h3 className="font-cinematic text-2xl md:text-3xl uppercase tracking-wider text-white">
                Continue Watching
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectTab('watchlist')}
              className="text-gray-400 hover:text-white"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTitles.map((title, idx) => {
              const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
              return (
                <div
                  key={title.id}
                  onClick={() => onOpenTitleDetails(title)}
                  className="group relative metallic-card rounded-2xl overflow-hidden border border-border hover:border-white/30 cursor-pointer transition-all flex flex-col shadow-card"
                >
                  {/* Subtle Magic UI BorderBeam on the first in-progress item */}
                  {idx === 0 && <BorderBeam size={150} duration={8} borderWidth={1.5} />}

                  <div className="relative h-44 overflow-hidden bg-doom-950">
                    <CinematicImage
                      src={title.backdropPath || title.posterPath}
                      alt={title.title}
                      fallbackTitle={title.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 marvel-badge px-2 py-0.5 text-[10px] rounded">
                      {title.mediaType === 'tv' ? 'TV SERIES' : 'MOVIE'}
                    </span>

                    <button 
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-doom-red text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md"
                      aria-label="Play title"
                    >
                      <Play size={16} fill="white" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-marvel text-lg text-white font-bold tracking-wide truncate">
                        {title.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-sans">
                        {title.whyItMatters}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-3 pt-3 border-t border-border">
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
                          <Progress value={epStats.percentage} indicatorClassName="bg-doom-gold" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-doom-gold font-mono">
                          <span>In Progress</span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateWatchStatus(title.id, 'completed');
                            }}
                            className="h-6 text-[10px] px-2"
                          >
                            Mark Complete
                          </Button>
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

      {/* 5. Editorial Next Up Spotlight */}
      <section className="metallic-card rounded-3xl overflow-hidden border border-border p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-doom-900 via-doom-850 to-doom-950 shadow-card">
        <div className="w-full lg:w-72 shrink-0 rounded-2xl overflow-hidden relative group bg-doom-950 shadow-md">
          <CinematicImage
            src={recommendedTitle.posterPath}
            alt={recommendedTitle.title}
            fallbackTitle={recommendedTitle.title}
            fallbackSubtitle={String(recommendedTitle.releaseYear)}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-doom-950/80 via-transparent to-transparent pointer-events-none" />
          <Badge variant="marvel" className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded shadow-sm">
            RECOMMENDED NEXT
          </Badge>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-doom-gold border-doom-gold/30">
              {recommendedTitle.defaultPhaseGroup}
            </Badge>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">#{recommendedTitle.defaultSequenceNumber} in sequence</span>
          </div>

          <h3 className="font-cinematic text-4xl md:text-5xl text-white uppercase tracking-wider">
            {recommendedTitle.title}
          </h3>

          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            {recommendedTitle.synopsis}
          </p>

          <div className="bg-doom-950/90 p-4 rounded-xl border border-border">
            <div className="text-[10px] font-marvel uppercase tracking-wider text-doom-red font-bold mb-1">
              Why This Matters To Avengers: Doomsday
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              "{recommendedTitle.whyItMatters}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="default"
              size="lg"
              onClick={() => onOpenTitleDetails(recommendedTitle)}
            >
              <span>Explore Lore & Episodes</span>
              <ArrowRight size={14} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => updateWatchStatus(recommendedTitle.id, 'completed')}
            >
              <CheckCircle2 size={15} className="text-doom-emerald" />
              <span>Mark as Watched</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Progress by Cinematic Phase */}
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
              className="metallic-card p-5 rounded-2xl border border-border hover:border-white/20 cursor-pointer transition-all flex flex-col justify-between shadow-card"
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
                <Progress value={phase.percent} indicatorClassName="bg-gradient-to-r from-doom-red to-doom-gold" className="h-1.5 mb-1" />
                <div className="text-[10px] text-gray-400 text-right font-mono">
                  {phase.percent}% completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Quick Lore Arena & Multiverse Explorer Callout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onSelectTab('quiz')}
          className="metallic-card rounded-2xl p-6 border border-border hover:border-doom-gold/40 cursor-pointer transition-all flex items-center justify-between group bg-gradient-to-br from-doom-900 to-doom-950 shadow-card"
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
          <div className="w-14 h-14 rounded-2xl bg-doom-gold/10 border border-doom-gold/30 flex items-center justify-center text-doom-gold shrink-0">
            <HelpCircle size={28} />
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('multiverse')}
          className="metallic-card rounded-2xl p-6 border border-border hover:border-doom-red/40 cursor-pointer transition-all flex items-center justify-between group bg-gradient-to-br from-doom-900 to-doom-950 shadow-card"
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
          <div className="w-14 h-14 rounded-2xl bg-doom-red/10 border border-doom-red/30 flex items-center justify-center text-doom-red shrink-0">
            <Compass size={28} />
          </div>
        </div>
      </section>
    </div>
  );
};
