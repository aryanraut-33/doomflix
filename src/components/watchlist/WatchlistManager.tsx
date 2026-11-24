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

  // Render a compact, subtle portrait card (fitting 2-3 per row on mobile, 5-6 on desktop)
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
      <div
        key={title.id}
        className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all p-2"
      >
        <div>
          {/* 1. Portrait Poster: aspect-[2/3] */}
          <div 
            onClick={() => onOpenTitleDetails(title)}
            className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-doom-950 cursor-pointer shadow-md"
          >
            <CinematicImage
              src={title.posterPath || title.backdropPath}
              alt={title.title}
              fallbackTitle={title.title}
              fallbackSubtitle={String(title.releaseYear)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

            {/* Top Indicators */}
            <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-white/90">
                #{String(item.sequenceNumber).padStart(2, '0')}
              </span>
              {isCompleted && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                  <CheckCircle2 size={11} />
                </span>
              )}
              {isWatching && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center shadow font-bold text-[9px]">
                  <Clock size={11} />
                </span>
              )}
            </div>

            {/* Rating pill bottom-right */}
            <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-amber-400 font-mono flex items-center gap-0.5">
              <Star size={9} fill="currentColor" />
              <span>{title.rating.toFixed(1)}</span>
            </div>

            {/* Center hover play */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/90 text-doom-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <Play size={13} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          </div>

          {/* 2. Title & Metadata */}
          <div className="pt-2">
            <h4 
              onClick={() => onOpenTitleDetails(title)}
              className="text-xs sm:text-sm font-semibold text-white truncate cursor-pointer hover:text-emerald-300 transition-colors leading-tight"
              title={title.title}
            >
              {title.title}
            </h4>
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-0.5">
              <span>{title.releaseYear} • {title.mediaType === 'tv' ? 'Series' : `${title.runtime}m`}</span>
              {isEssential && (
                <span className="text-[9px] text-emerald-400/90 font-medium">Essential</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Compact Action & Status Controls */}
        <div className="pt-2 mt-1.5 border-t border-white/5 flex items-center gap-1.5">
          {streamUrl ? (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-all truncate"
              title={`Stream on ${streamInfo?.provider || 'Platform'}`}
            >
              <Play size={10} fill="currentColor" />
              <span className="truncate">Watch</span>
            </a>
          ) : (
            <button
              onClick={() => onOpenTitleDetails(title)}
              className="flex-1 py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[10px] sm:text-[11px] flex items-center justify-center gap-1 transition-all"
            >
              <Info size={10} />
              <span>Info</span>
            </button>
          )}

          {/* Quick Status Advance Button */}
          <button
            onClick={() => {
              const nextStatus = progress === 'not_started' ? 'in_progress' : progress === 'in_progress' ? 'completed' : 'not_started';
              updateWatchStatus(title.id, nextStatus);
            }}
            className={`p-1 rounded-md text-[10px] border transition-colors ${
              isCompleted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : isWatching
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={`Status: ${progress === 'completed' ? 'Watched' : progress === 'in_progress' ? 'Watching' : 'Not Started'}. Click to toggle`}
          >
            {isCompleted ? <CheckCircle2 size={13} /> : isWatching ? <Clock size={13} /> : <Check size={13} />}
          </button>

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenuTitleId(isMenuOpen ? null : title.id)}
              className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
              title="More options"
            >
              <MoreVertical size={13} />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 bottom-full mb-1 w-36 rounded-lg bg-doom-950 border border-white/20 shadow-2xl py-1 z-30 text-xs backdrop-blur-xl"
                onMouseLeave={() => setActiveMenuTitleId(null)}
              >
                <button
                  onClick={() => {
                    onOpenTitleDetails(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5"
                >
                  <Info size={11} />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => {
                    toggleTitlePriority(activeCol.id, title.id);
                    setActiveMenuTitleId(null);
                  }}
                  className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5"
                >
                  <Sparkles size={11} className={isEssential ? 'text-emerald-400' : ''} />
                  <span>{isEssential ? 'Optional' : 'Essential'}</span>
                </button>
                <button
                  onClick={() => {
                    setNotesModalTitle(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5"
                >
                  <FileText size={11} />
                  <span>Notes</span>
                </button>
                <button
                  onClick={() => {
                    setMoveModalTitle(title);
                    setActiveMenuTitleId(null);
                  }}
                  className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5"
                >
                  <Layers size={11} />
                  <span>Move</span>
                </button>
                <div className="my-0.5 border-t border-white/10" />
                <button
                  onClick={() => {
                    removeTitleFromCollection(activeCol.id, title.id);
                    setActiveMenuTitleId(null);
                  }}
                  className="w-full px-2.5 py-1 text-left text-red-400 hover:bg-red-950/50 flex items-center gap-1.5"
                >
                  <Trash2 size={11} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Collection Header Bar — Minimal, Subtle & Unboxed */}
      <div className="pb-3 border-b border-white/5 space-y-3">
        {/* Collection Switcher Pills & Action Tools */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {collections.map(col => {
              const isActive = col.id === activeCollectionId;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveCollectionId(col.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{col.name}</span>
                  <span className="text-[10px] font-mono opacity-70">({col.items.length})</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                setEditingColId(null);
                setColModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-full text-xs text-gray-400 hover:text-white border border-dashed border-white/20 hover:border-white/40 flex items-center gap-1 transition-all"
              title="Create a new collection"
            >
              <Plus size={11} />
              <span>New</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeCol?.isSystemCollection ? (
              <button
                onClick={() => resetCollectionToDefault(activeCol.id)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
                title="Reset to recommended order"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingColId(activeCol.id);
                    setColModalOpen(true);
                  }}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1"
                  title="Rename"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => deleteCollection(activeCol.id)}
                  className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}

            <button
              onClick={onNavigateDiscover}
              className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Title & Subtle Inline Progress */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-lg sm:text-xl font-medium text-white tracking-wide">
              {activeCol?.name}
            </h1>
            {activeCol?.isSystemCollection && (
              <span className="text-[10px] text-gray-400 font-mono">
                Curated Prep
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>{collectionCompletedCount}/{collectionTotalCount} watched</span>
            <span className="text-gray-600">•</span>
            <span className="text-emerald-400 font-medium">{collectionPercent}%</span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Sort Toolbar — Responsive & Minimal (No Clipping on Mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { val: 'all', label: 'All' },
            { val: 'in_progress', label: 'Watching' },
            { val: 'completed', label: 'Watched' },
            { val: 'not_started', label: 'Not Started' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setStatusFilter(opt.val as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === opt.val
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Media & Sorting Controls — 3 Equal Grid Cols on Mobile, Inline on Desktop */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
          {/* Media Filter */}
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">Series</option>
          </select>

          {/* Phase Filter */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="w-full sm:w-auto bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none truncate"
          >
            <option value="all">All Phases</option>
            {PHASE_ORDER.map(p => (
              <option key={p} value={p}>{p.split('—')[1]?.trim() || p}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto bg-black/60 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none"
          >
            <option value="phase">Phase Order</option>
            <option value="sequence">Sequence</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 3. Titles Display: 2-3 per row on Mobile, 5-6 on Desktop */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="rounded-2xl p-10 text-center space-y-3 border border-white/5 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
            <Film size={20} />
          </div>
          <h3 className="text-base font-semibold text-white">
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
            className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : phaseGroupSections ? (
        /* Phase-Wise Grouped Display */
        <div className="space-y-8">
          {phaseGroupSections.map((group) => {
            const groupWatchedCount = group.items.filter(
              i => watchProgress[i.movieId]?.status === 'completed'
            ).length;

            return (
              <section key={group.phaseName} className="space-y-3">
                {/* Phase Section Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <h2 className="text-sm sm:text-base font-medium text-white tracking-wide">
                      {group.displayName}
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">
                      ({group.items.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {groupWatchedCount}/{group.items.length} watched
                  </span>
                </div>

                {/* Grid: 2-3 movies per row on mobile, 4 on tablet, 5-6 on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
                  {group.items.map(item => renderCard(item))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Standard Sorted Grid: 2-3 movies per row on mobile, 5-6 on desktop */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
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
