import React, { useState, useMemo } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Plus, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  Film, 
  FileText, 
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Star,
  MoreVertical,
  Check
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
  onNavigateDiscover 
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
    getSeriesEpisodeStats
  } = useAppStore();

  const activeCol = collections.find(c => c.id === activeCollectionId) || collections[0];

  // Modals state
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [notesModalTitle, setNotesModalTitle] = useState<MarvelTitle | null>(null);
  const [moveModalTitle, setMoveModalTitle] = useState<MarvelTitle | null>(null);
  const [activeMenuTitleId, setActiveMenuTitleId] = useState<string | null>(null);

  // Filters & Sorting State - Phase wise by default!
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('phase');

  // Expanded TV Series Accordion State
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  // Build items combined with catalogue metadata
  const enrichedItems = useMemo(() => {
    if (!activeCol) return [];
    return activeCol.items.map(item => {
      const details = MARVEL_TITLES.find(t => t.id === item.movieId);
      return {
        ...item,
        details: details || {
          id: item.movieId,
          tmdbId: 0,
          mediaType: 'movie',
          title: 'Unknown Title',
          releaseYear: 2025,
          releaseDate: '2025-01-01',
          runtime: 120,
          rating: 7.0,
          voteCount: 0,
          genres: ['Action'],
          director: 'Unknown',
          cast: [],
          synopsis: 'Custom added title.',
          posterPath: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
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
          streamingIndia: []
        } as MarvelTitle
      };
    });
  }, [activeCol]);

  // Filter and Sort Items
  const filteredAndSortedItems = useMemo(() => {
    return enrichedItems
      .filter(item => {
        const prog = watchProgress[item.movieId]?.status || 'not_started';
        if (statusFilter !== 'all' && prog !== statusFilter) return false;
        if (mediaFilter !== 'all' && item.details.mediaType !== mediaFilter) return false;
        if (phaseFilter !== 'all' && (item.phaseGroup || item.details.defaultPhaseGroup) !== phaseFilter) return false;
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

  // Grouped by Phase structure when sorting by phase
  const phaseGroupSections = useMemo(() => {
    if (sortBy !== 'phase' || phaseFilter !== 'all') return null;

    const groups: { phaseName: string; displayName: string; items: typeof filteredAndSortedItems }[] = [];
    
    for (const phase of PHASE_ORDER) {
      const itemsInPhase = filteredAndSortedItems.filter(
        i => (i.phaseGroup || i.details.defaultPhaseGroup) === phase
      );
      if (itemsInPhase.length > 0) {
        groups.push({
          phaseName: phase,
          displayName: phase.split('—')[1]?.trim() || phase,
          items: itemsInPhase
        });
      }
    }

    // Optional or extra titles
    const extras = filteredAndSortedItems.filter(
      i => !PHASE_ORDER.includes((i.phaseGroup || i.details.defaultPhaseGroup) as any)
    );
    if (extras.length > 0) {
      groups.push({
        phaseName: 'Optional',
        displayName: 'Special & Optional Lore',
        items: extras
      });
    }

    return groups;
  }, [filteredAndSortedItems, sortBy, phaseFilter]);

  const collectionCompletedCount = enrichedItems.filter(i => watchProgress[i.movieId]?.status === 'completed').length;
  const collectionTotalCount = enrichedItems.length;
  const collectionPercent = collectionTotalCount > 0 ? Math.round((collectionCompletedCount / collectionTotalCount) * 100) : 0;

  // Render a single minimalist card
  const renderCard = (item: (typeof enrichedItems)[0]) => {
    const title = item.details;
    const progress = watchProgress[title.id]?.status || 'not_started';
    const isCompleted = progress === 'completed';
    const isWatching = progress === 'in_progress';
    const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
    const isExpanded = expandedSeriesId === title.id;
    const hasNotes = !!watchProgress[title.id]?.personalNotes;
    const isEssential = item.priority === 'essential';
    const isMenuOpen = activeMenuTitleId === title.id;
    const streamInfo = title.streamingIndia?.[0];
    const streamUrl = streamInfo?.directUrl || streamInfo?.searchUrl;

    return (
      <div
        key={title.id}
        className={`doom-glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-card ${
          isCompleted
            ? 'border-emerald-500/30 bg-emerald-950/15'
            : isWatching
            ? 'border-amber-500/30 bg-amber-950/10'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {/* 1. Card Poster / Backdrop */}
        <div 
          onClick={() => onOpenTitleDetails(title)}
          className="relative aspect-[16/10] w-full overflow-hidden bg-doom-950 cursor-pointer"
        >
          <CinematicImage
            src={title.backdropPath || title.posterPath}
            alt={title.title}
            fallbackTitle={title.title}
            fallbackSubtitle={String(title.releaseYear)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-doom-950 via-doom-950/40 to-transparent" />

          {/* Top Indicators: Minimal & Clean */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            {/* Sequence tag or essential pill */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white/90 border border-white/15">
                #{String(item.sequenceNumber).padStart(2, '0')}
              </span>
              {isEssential && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-semibold bg-emerald-600/90 text-white shadow-sm">
                  Essential
                </span>
              )}
            </div>

            {/* Status Indicator */}
            {isCompleted && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30">
                <CheckCircle2 size={11} />
                <span>Watched</span>
              </span>
            )}
            {isWatching && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/30">
                <Clock size={11} />
                <span>Watching</span>
              </span>
            )}
          </div>

          {/* Rating tag bottom-right */}
          <div className="absolute bottom-2 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-400 font-mono flex items-center gap-1 border border-white/10">
            <Star size={10} fill="currentColor" />
            <span>{title.rating.toFixed(1)}</span>
          </div>

          {/* Center Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/90 text-doom-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </div>

        {/* 2. Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Meta Row: Year, Runtime/Media, Category */}
            <div className="flex items-center justify-between text-xs text-gray-400 font-sans mb-1">
              <span>{title.releaseYear} • {title.mediaType === 'tv' ? 'Series' : `${title.runtime}m`}</span>
              {hasNotes && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium" title="Has personal notes">
                  <FileText size={10} /> Notes
                </span>
              )}
            </div>

            {/* Clean Title */}
            <h3 
              onClick={() => onOpenTitleDetails(title)}
              className="text-base font-semibold text-white tracking-wide cursor-pointer hover:text-emerald-300 transition-colors line-clamp-1"
              title={title.title}
            >
              {title.title}
            </h3>

            {/* TV Episode Progress bar & accordion trigger */}
            {title.mediaType === 'tv' && epStats && (
              <div className="mt-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <button
                    onClick={() => {
                      setExpandedSeriesId(isExpanded ? null : title.id);
                      if (title.seasons?.[0]) setSelectedSeasonNumber(title.seasons[0].seasonNumber);
                    }}
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <span>Episodes ({epStats.watched}/{epStats.total})</span>
                    {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                  <span className="text-[10px] text-emerald-400 font-bold">{epStats.percentage}%</span>
                </div>
                <div className="w-full bg-black/60 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                    style={{ width: `${epStats.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Actions: Stream Button + Compact Status Toggle + More Menu */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            {/* Primary Action Button */}
            {streamUrl ? (
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 hover:brightness-110 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Play size={12} fill="white" />
                <span>Stream on {streamInfo?.provider || 'Platform'}</span>
                <ExternalLink size={10} className="opacity-80" />
              </a>
            ) : (
              <button
                onClick={() => onOpenTitleDetails(title)}
                className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Info size={12} />
                <span>View Details</span>
              </button>
            )}

            {/* Status Control & More Options */}
            <div className="flex items-center gap-1.5">
              {/* Sleek Segmented Status Toggle */}
              <div className="flex-1 grid grid-cols-3 bg-black/50 p-0.5 rounded-lg border border-white/10 text-center text-[10px]">
                <button
                  onClick={() => updateWatchStatus(title.id, 'not_started')}
                  className={`py-1 rounded transition-colors font-medium truncate ${
                    progress === 'not_started'
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mark Not Started"
                >
                  Unwatched
                </button>
                <button
                  onClick={() => updateWatchStatus(title.id, 'in_progress')}
                  className={`py-1 rounded transition-colors font-medium truncate ${
                    progress === 'in_progress'
                      ? 'bg-amber-500/90 text-doom-950 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mark In Progress"
                >
                  Watching
                </button>
                <button
                  onClick={() => updateWatchStatus(title.id, 'completed')}
                  className={`py-1 rounded transition-colors font-medium flex items-center justify-center gap-0.5 truncate ${
                    progress === 'completed'
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Mark Watched"
                >
                  <Check size={10} />
                  <span>Done</span>
                </button>
              </div>

              {/* Minimal Popover Menu for Secondary Actions */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenuTitleId(isMenuOpen ? null : title.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors border border-white/10"
                  title="More actions"
                >
                  <MoreVertical size={13} />
                </button>

                {isMenuOpen && (
                  <div 
                    className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-doom-950 border border-white/20 shadow-2xl py-1 z-30 text-xs backdrop-blur-xl"
                    onMouseLeave={() => setActiveMenuTitleId(null)}
                  >
                    <button
                      onClick={() => {
                        onOpenTitleDetails(title);
                        setActiveMenuTitleId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <Info size={13} />
                      <span>Details & Lore</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleTitlePriority(activeCol.id, title.id);
                        setActiveMenuTitleId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <Sparkles size={13} className={isEssential ? 'text-emerald-400' : ''} />
                      <span>{isEssential ? 'Make Optional' : 'Mark Essential'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setNotesModalTitle(title);
                        setActiveMenuTitleId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <FileText size={13} />
                      <span>{hasNotes ? 'Edit Notes' : 'Add Note'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setMoveModalTitle(title);
                        setActiveMenuTitleId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <Layers size={13} />
                      <span>Move Collection</span>
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => {
                        removeTitleFromCollection(activeCol.id, title.id);
                        setActiveMenuTitleId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-red-400 hover:bg-red-950/50 flex items-center gap-2"
                    >
                      <Trash2 size={13} />
                      <span>Remove from List</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Collection Header Bar with Switcher */}
      <div className="doom-glass-panel rounded-2xl p-5 md:p-6 border border-emerald-500/20 shadow-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            {/* Collection Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {collections.map(col => {
                const isActive = col.id === activeCollectionId;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollectionId(col.id)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-semibold shadow-sm border border-emerald-400/40'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{col.name}</span>
                    <span className="text-[10px] font-mono opacity-80">({col.items.length})</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setEditingColId(null);
                  setColModalOpen(true);
                }}
                className="px-3 py-1 rounded-full text-xs font-medium border border-dashed border-emerald-400/40 hover:border-emerald-400 text-emerald-400 flex items-center gap-1 transition-all"
                title="Create a new collection"
              >
                <Plus size={12} />
                <span>New</span>
              </button>
            </div>

            {/* Collection Title & Description */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {activeCol?.name}
                </h1>
                {activeCol?.isSystemCollection && (
                  <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider px-2 py-0.5 text-[10px] rounded-md font-semibold">
                    Curated Prep
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5 max-w-xl">
                {activeCol?.description}
              </p>
            </div>
          </div>

          {/* Right Action Tools for Active Collection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Progress Meter */}
            <div className="bg-black/40 px-4 py-2.5 rounded-xl border border-white/10 w-full sm:w-52">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-400">Watched</span>
                <span className="text-white font-semibold">{collectionCompletedCount} / {collectionTotalCount}</span>
              </div>
              <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${collectionPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 text-right font-medium">
                {collectionPercent}% Complete
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {activeCol?.isSystemCollection ? (
                <button
                  onClick={() => resetCollectionToDefault(activeCol.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
                  title="Reset to recommended order"
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingColId(activeCol.id);
                      setColModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
                    title="Rename collection"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => deleteCollection(activeCol.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-950/50 text-red-400 text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
                    title="Delete collection"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}

              <button
                onClick={onNavigateDiscover}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>Add Titles</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Sort Toolbar — Minimal & Decluttered */}
      <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { val: 'all', label: 'All' },
            { val: 'in_progress', label: 'Watching' },
            { val: 'completed', label: 'Watched' },
            { val: 'not_started', label: 'Not Started' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setStatusFilter(opt.val as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === opt.val
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-semibold shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Media & Sorting Controls */}
        <div className="flex items-center gap-2">
          {/* Media Filter */}
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value as any)}
            className="bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>

          {/* Phase Filter (if user wants to isolate one phase) */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 max-w-[150px] truncate"
          >
            <option value="all">All Phases</option>
            {PHASE_ORDER.map(p => (
              <option key={p} value={p}>{p.split('—')[1]?.trim() || p}</option>
            ))}
          </select>

          {/* Sort By Dropdown — Default is Phase Order */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <ArrowUpDown size={12} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="phase">Phase Order (Default)</option>
              <option value="sequence">Custom Sequence</option>
              <option value="year">Release Year</option>
              <option value="rating">Rating</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Titles Display: Phase-Grouped by Default or Filtered Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="rounded-2xl p-12 text-center space-y-4 border border-white/10 bg-black/20">
          <div className="w-14 h-14 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
            <Film size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white">
            No Titles Match Filters
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
            Adjust your active filters or add new titles from the Discover catalog.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setMediaFilter('all');
              setPhaseFilter('all');
            }}
            className="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : phaseGroupSections ? (
        /* Phase-Wise Grouped Display */
        <div className="space-y-10">
          {phaseGroupSections.map((group) => {
            const groupWatchedCount = group.items.filter(
              i => watchProgress[i.movieId]?.status === 'completed'
            ).length;

            return (
              <section key={group.phaseName} className="space-y-4">
                {/* Phase Section Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    <h2 className="text-lg font-semibold text-white tracking-wide">
                      {group.displayName}
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">
                      ({group.items.length})
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400/80 font-mono font-medium">
                    {groupWatchedCount}/{group.items.length} watched
                  </span>
                </div>

                {/* Grid of Cards for this Phase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {group.items.map(item => renderCard(item))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Standard Sorted Grid (when sorting by year, rating, title, or filtered by single phase) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAndSortedItems.map(item => renderCard(item))}
        </div>
      )}

      {/* Modals */}
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
