import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Film,
  FileText,
  Layers,
  Sparkles,
  Info,
  Star,
  MoreVertical,
  Check,
} from 'lucide-react';
import { MARVEL_TITLES, MarvelTitle, PHASE_ORDER } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CollectionModal } from './CollectionModal';
import { NotesModal } from './NotesModal';
import { MoveCollectionModal } from './MoveCollectionModal';
import { CinematicImage } from '../common/CinematicImage';

interface WatchlistManagerProps {
  onOpenTitleDetails: (title: MarvelTitle) => void;
  onNavigateDiscover: () => void;
}

type SortOption = 'phase' | 'sequence' | 'year' | 'rating' | 'title';

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  onOpenTitleDetails,
  onNavigateDiscover,
}) => {
  const {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    deleteCollection,
    removeTitleFromCollection,
    toggleTitlePriority,
    resetCollectionToDefault,
    watchProgress,
    updateWatchStatus,
  } = useAppStore();

  const activeCol = collections.find((c) => c.id === activeCollectionId) || collections[0];

  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [notesModalTitle, setNotesModalTitle] = useState<MarvelTitle | null>(null);
  const [moveModalTitle, setMoveModalTitle] = useState<MarvelTitle | null>(null);
  const [activeMenuTitleId, setActiveMenuTitleId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('phase');

  useEffect(() => {
    if (!activeMenuTitleId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenuTitleId(null);
    };
    const onClick = () => setActiveMenuTitleId(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [activeMenuTitleId]);

  useEffect(() => {
    if (!feedbackMsg) return;
    const t = window.setTimeout(() => setFeedbackMsg(''), 3000);
    return () => clearTimeout(t);
  }, [feedbackMsg]);

  const enrichedItems = useMemo(() => {
    if (!activeCol) return [];
    return activeCol.items.map((item) => {
      const details = MARVEL_TITLES.find((t) => t.id === item.movieId);
      return {
        ...item,
        details:
          details ||
          ({
            id: item.movieId,
            tmdbId: 0,
            mediaType: 'movie',
            title: 'Custom Title',
            releaseYear: 2025,
            releaseDate: '2025-01-01',
            runtime: 120,
            rating: 7.0,
            voteCount: 0,
            genres: ['Action'],
            director: 'Unknown',
            cast: [],
            synopsis: 'Custom added title.',
            posterPath: '',
            backdropPath: '',
            defaultPhaseGroup: 'Optional Viewing' as any,
            defaultSequenceNumber: 99,
            defaultPriority: 'optional' as any,
            whyItMatters: '',
            charactersIntroduced: [],
            relevantPlotPoints: [],
            universeConnections: [],
            multiverseSignificance: '',
            canonStatus: 'Confirmed Canon' as any,
            streamingIndia: [],
          } as MarvelTitle),
      };
    });
  }, [activeCol]);

  const filteredAndSortedItems = useMemo(() => {
    return enrichedItems
      .filter((item) => {
        const prog = watchProgress[item.movieId]?.status || 'not_started';
        if (statusFilter !== 'all' && prog !== statusFilter) return false;
        if (mediaFilter !== 'all' && item.details.mediaType !== mediaFilter) return false;
        if (
          phaseFilter !== 'all' &&
          (item.phaseGroup || item.details.defaultPhaseGroup) !== phaseFilter
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'phase') {
          const phaseGroupA = a.phaseGroup || a.details.defaultPhaseGroup;
          const phaseGroupB = b.phaseGroup || b.details.defaultPhaseGroup;
          const idxA = PHASE_ORDER.indexOf(phaseGroupA as any);
          const idxB = PHASE_ORDER.indexOf(phaseGroupB as any);
          const orderA = idxA === -1 ? 999 : idxA;
          const orderB = idxB === -1 ? 999 : idxB;
          if (orderA !== orderB) return orderA - orderB;
          return a.sequenceNumber - b.sequenceNumber;
        }
        if (sortBy === 'sequence') return a.sequenceNumber - b.sequenceNumber;
        if (sortBy === 'year') return a.details.releaseYear - b.details.releaseYear;
        if (sortBy === 'rating') return b.details.rating - a.details.rating;
        if (sortBy === 'title') return a.details.title.localeCompare(b.details.title);
        return 0;
      });
  }, [enrichedItems, statusFilter, mediaFilter, phaseFilter, sortBy, watchProgress]);

  const phaseGroupSections = useMemo(() => {
    if (sortBy !== 'phase' || phaseFilter !== 'all') return null;

    const groups: { phaseName: string; displayName: string; items: typeof filteredAndSortedItems }[] = [];

    for (const phase of PHASE_ORDER) {
      const itemsInPhase = filteredAndSortedItems.filter(
        (i) => (i.phaseGroup || i.details.defaultPhaseGroup) === phase
      );
      if (itemsInPhase.length > 0) {
        groups.push({
          phaseName: phase,
          displayName: phase.split('—')[1]?.trim() || phase,
          items: itemsInPhase,
        });
      }
    }

    const extras = filteredAndSortedItems.filter(
      (i) => !PHASE_ORDER.includes((i.phaseGroup || i.details.defaultPhaseGroup) as any)
    );
    if (extras.length > 0) {
      groups.push({
        phaseName: 'Optional',
        displayName: 'Special & Optional Lore',
        items: extras,
      });
    }

    return groups;
  }, [filteredAndSortedItems, sortBy, phaseFilter]);

  const collectionCompletedCount = enrichedItems.filter(
    (i) => watchProgress[i.movieId]?.status === 'completed'
  ).length;
  const collectionTotalCount = enrichedItems.length;
  const collectionPercent =
    collectionTotalCount > 0
      ? Math.round((collectionCompletedCount / collectionTotalCount) * 100)
      : 0;

  const renderCard = (item: (typeof enrichedItems)[0]) => {
    const title = item.details;
    const progress = watchProgress[title.id]?.status || 'not_started';
    const isCompleted = progress === 'completed';
    const isWatching = progress === 'in_progress';
    const isEssential = item.priority === 'essential';
    const isMenuOpen = activeMenuTitleId === title.id;
    const streamInfo = title.streamingIndia?.[0];
    const streamUrl = streamInfo?.directUrl || streamInfo?.searchUrl;

    return (
      <article
        key={title.id}
        className="group relative flex flex-col justify-between rounded-2xl bg-[#0f131b] hover:bg-[#131823] border border-white/10 hover:border-white/20 transition-[background-color,border-color] duration-150 p-2"
      >
        <div>
          <button
            type="button"
            onClick={() => onOpenTitleDetails(title)}
            aria-label={`View details for ${title.title}`}
            className="ui-press ui-press--surface ui-press--on-dark ui-focus relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-doom-950 block text-left"
          >
            <CinematicImage
              src={title.posterPath || title.backdropPath}
              alt={title.title}
              fallbackTitle={title.title}
              fallbackSubtitle={String(title.releaseYear)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
              loading="lazy"
            />
            <div
              data-ui-overlap
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-45 transition-opacity pointer-events-none"
            />

            <div
              data-ui-overlap
              className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none"
            >
              <span className="text-[10px] font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-white/90">
                #{String(item.sequenceNumber).padStart(2, '0')}
              </span>
              {isCompleted && (
                <span
                  aria-label="Watched"
                  className="w-5 h-5 rounded-full bg-emerald-500 text-doom-950 flex items-center justify-center"
                >
                  <CheckCircle2 size={12} aria-hidden="true" />
                </span>
              )}
              {isWatching && (
                <span
                  aria-label="Watching"
                  className="w-5 h-5 rounded-full bg-amber-400 text-doom-950 flex items-center justify-center"
                >
                  <Clock size={12} aria-hidden="true" />
                </span>
              )}
            </div>

            <div
              data-ui-overlap
              className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-amber-400 font-mono flex items-center gap-1 pointer-events-none"
            >
              <Star size={10} fill="currentColor" aria-hidden="true" />
              <span className="tabular-nums">{title.rating.toFixed(1)}</span>
            </div>

            <div
              data-ui-overlap
              className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 pointer-events-none"
            >
              <div className="w-9 h-9 rounded-full bg-white text-doom-950 flex items-center justify-center shadow-lg">
                <Play size={14} fill="currentColor" className="ml-px" aria-hidden="true" />
              </div>
            </div>
          </button>

          <div className="pt-2 px-0.5">
            <button
              type="button"
              onClick={() => onOpenTitleDetails(title)}
              className="ui-dim ui-focus block w-full text-left text-xs sm:text-sm font-semibold text-white truncate hover:text-emerald-300 leading-tight"
              title={title.title}
            >
              {title.title}
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums mt-1">
              <span>
                {title.releaseYear} · {title.mediaType === 'tv' ? 'Series' : `${title.runtime}m`}
              </span>
              {isEssential && (
                <span className="text-[10px] font-sans text-emerald-400 font-medium">
                  Essential
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Uniform 32px footer controls */}
        <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center gap-1.5">
          {streamUrl ? (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-press ui-press--on-dark ui-focus flex-1 h-8 px-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs flex items-center justify-center gap-1.5 truncate"
              title={`Stream on ${streamInfo?.provider || 'Platform'}`}
            >
              <Play size={12} fill="currentColor" className="ml-px shrink-0" aria-hidden="true" />
              <span className="truncate">Watch</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onOpenTitleDetails(title)}
              className="ui-press ui-press--on-dark ui-focus flex-1 h-8 px-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs flex items-center justify-center gap-1.5"
            >
              <Info size={12} className="shrink-0" aria-hidden="true" />
              <span>Info</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const nextStatus =
                progress === 'not_started'
                  ? 'in_progress'
                  : progress === 'in_progress'
                  ? 'completed'
                  : 'not_started';
              updateWatchStatus(title.id, nextStatus);
            }}
            aria-label={`Change watch status (currently ${progress.replace('_', ' ')})`}
            aria-pressed={isCompleted}
            className={`ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
              isCompleted
                ? 'bg-emerald-500/20 border-emerald-500/45 text-emerald-400'
                : isWatching
                ? 'bg-amber-500/20 border-amber-500/45 text-amber-300'
                : 'bg-white/[0.04] border-white/12 text-slate-400 hover:text-white'
              }`}
            title={`Status: ${
              progress === 'completed'
                ? 'Watched'
                : progress === 'in_progress'
                ? 'Watching'
                : 'Not Started'
            }. Click to toggle`}
          >
            {isCompleted ? (
              <CheckCircle2 size={13} className="ui-pop-icon" aria-hidden="true" />
            ) : isWatching ? (
              <Clock size={13} className="ui-pop-icon" aria-hidden="true" />
            ) : (
              <Check size={13} aria-hidden="true" />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuTitleId(isMenuOpen ? null : title.id);
              }}
              aria-label={`More options for ${title.title}`}
              aria-expanded={isMenuOpen}
              className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg bg-white/[0.04] border border-white/12 text-slate-400 hover:text-white flex items-center justify-center shrink-0"
              title="More options"
            >
              <MoreVertical size={13} aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                onClick={(e) => e.stopPropagation()}
                className="ui-dialog-enter absolute right-0 bottom-full mb-1.5 w-40 rounded-xl bg-[#131823] border border-white/15 shadow-2xl p-1 z-30 text-xs"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpenTitleDetails(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="ui-press ui-press--on-dark ui-focus w-full h-8 px-2.5 rounded-lg text-left text-slate-200 hover:bg-white/10 flex items-center gap-2"
                >
                  <Info size={13} aria-hidden="true" />
                  <span>Details</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    toggleTitlePriority(activeCol.id, title.id);
                    setActiveMenuTitleId(null);
                  }}
                  className="ui-press ui-press--on-dark ui-focus w-full h-8 px-2.5 rounded-lg text-left text-slate-200 hover:bg-white/10 flex items-center gap-2"
                >
                  <Sparkles size={13} className={isEssential ? 'text-emerald-400' : ''} aria-hidden="true" />
                  <span>{isEssential ? 'Mark Optional' : 'Mark Essential'}</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setNotesModalTitle(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="ui-press ui-press--on-dark ui-focus w-full h-8 px-2.5 rounded-lg text-left text-slate-200 hover:bg-white/10 flex items-center gap-2"
                >
                  <FileText size={13} aria-hidden="true" />
                  <span>Notes</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMoveModalTitle(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="ui-press ui-press--on-dark ui-focus w-full h-8 px-2.5 rounded-lg text-left text-slate-200 hover:bg-white/10 flex items-center gap-2"
                >
                  <Layers size={13} aria-hidden="true" />
                  <span>Move</span>
                </button>
                <div className="my-1 border-t border-white/10" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    removeTitleFromCollection(activeCol.id, title.id);
                    setActiveMenuTitleId(null);
                    setFeedbackMsg(`Removed "${title.title}" from ${activeCol.name}.`);
                  }}
                  className="ui-press ui-press--on-dark ui-focus w-full h-8 px-2.5 rounded-lg text-left text-rose-400 hover:bg-rose-500/15 flex items-center gap-2"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="pb-4 border-b border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {collections.map((col) => {
              const isActive = col.id === activeCollectionId;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setActiveCollectionId(col.id)}
                  aria-pressed={isActive}
                  className={`ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-white/14 text-white border-white/20 font-semibold'
                      : 'bg-transparent text-slate-400 hover:text-white border-transparent hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{col.name}</span>
                  <span className="text-[11px] font-mono tabular-nums opacity-75">
                    ({col.items.length})
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setEditingColId(null);
                setColModalOpen(true);
              }}
              className="ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-dashed border-white/20 hover:border-white/35 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Create a new collection"
            >
              <Plus size={13} aria-hidden="true" />
              <span>New</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeCol?.isSystemCollection ? (
              <button
                type="button"
                onClick={() => {
                  resetCollectionToDefault(activeCol.id);
                  setFeedbackMsg('Watchlist restored to recommended phase order.');
                }}
                className="ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 inline-flex items-center gap-1.5"
                title="Reset to recommended order"
              >
                <RotateCcw size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingColId(activeCol.id);
                    setColModalOpen(true);
                  }}
                  aria-label="Rename collection"
                  className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 inline-flex items-center justify-center"
                  title="Rename"
                >
                  <Edit2 size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCollection(activeCol.id)}
                  aria-label="Delete collection"
                  className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg text-rose-400 bg-rose-500/10 border border-rose-500/25 inline-flex items-center justify-center"
                  title="Delete"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onNavigateDiscover}
              className="ui-press ui-focus h-8 px-3 rounded-lg text-xs font-semibold text-doom-950 bg-white inline-flex items-center gap-1.5 shrink-0"
            >
              <Plus size={13} aria-hidden="true" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {activeCol?.name}
            </h1>
            {activeCol?.isSystemCollection && (
              <span className="text-xs text-slate-400">
                Curated sequence
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400">
            <span>
              {collectionCompletedCount}/{collectionTotalCount} watched
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{collectionPercent}%</span>
          </div>
        </div>

        {feedbackMsg && (
          <div
            role="status"
            aria-live="polite"
            className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300"
          >
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { val: 'all', label: 'All' },
            { val: 'in_progress', label: 'Watching' },
            { val: 'completed', label: 'Watched' },
            { val: 'not_started', label: 'Not Started' },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setStatusFilter(opt.val as any)}
              aria-pressed={statusFilter === opt.val}
              className={`ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border ${
                statusFilter === opt.val
                  ? 'bg-white/14 text-white border-white/20 font-semibold'
                  : 'text-slate-400 hover:text-white border-transparent hover:bg-white/[0.06]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <select
            aria-label="Filter by media type"
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value as any)}
            className="doom-select ui-field h-8 w-full sm:w-auto border border-white/14 rounded-lg px-2.5 text-xs text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">Series</option>
          </select>

          <select
            aria-label="Filter by phase"
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="doom-select ui-field h-8 w-full sm:w-auto border border-white/14 rounded-lg px-2.5 text-xs text-slate-200 truncate"
          >
            <option value="all">All Phases</option>
            {PHASE_ORDER.map((p) => (
              <option key={p} value={p}>
                {p.split('—')[1]?.trim() || p}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort watchlist"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="doom-select ui-field h-8 w-full sm:w-auto border border-white/14 rounded-lg px-2.5 text-xs text-slate-200"
          >
            <option value="phase">Phase Order</option>
            <option value="sequence">Sequence</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="rounded-2xl p-10 text-center space-y-3 border border-white/10 bg-[#0f131b]">
          <div className="w-11 h-11 rounded-full bg-white/[0.06] text-slate-400 flex items-center justify-center mx-auto">
            <Film size={20} aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-white">No titles match these filters</h3>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setMediaFilter('all');
              setPhaseFilter('all');
            }}
            className="ui-press ui-focus h-9 bg-white text-doom-950 px-4 rounded-lg text-xs font-semibold inline-flex items-center justify-center"
          >
            Clear filters
          </button>
        </div>
      ) : phaseGroupSections ? (
        <div className="space-y-8">
          {phaseGroupSections.map((group) => {
            const groupWatchedCount = group.items.filter(
              (i) => watchProgress[i.movieId]?.status === 'completed'
            ).length;

            return (
              <section key={group.phaseName} className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-white">
                      {group.displayName}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      ({group.items.length})
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {groupWatchedCount}/{group.items.length} watched
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {group.items.map((item) => renderCard(item))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredAndSortedItems.map((item) => renderCard(item))}
        </div>
      )}

      <CollectionModal
        isOpen={colModalOpen}
        onClose={() => setColModalOpen(false)}
        editingCollectionId={editingColId}
      />

      {notesModalTitle && (
        <NotesModal
          isOpen={!!notesModalTitle}
          onClose={() => setNotesModalTitle(null)}
          title={notesModalTitle}
        />
      )}

      {moveModalTitle && (
        <MoveCollectionModal
          isOpen={!!moveModalTitle}
          onClose={() => setMoveModalTitle(null)}
          title={moveModalTitle}
        />
      )}
    </div>
  );
};
