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
  Filter, 
  Tv, 
  Film, 
  FileText, 
  ExternalLink,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Info,
  Star
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
    reorderCollectionTitles,
    toggleTitlePriority,
    resetCollectionToDefault,
    watchProgress,
    updateWatchStatus,
    episodeProgress,
    toggleEpisodeWatched,
    isEpisodeWatched,
    getSeriesEpisodeStats
  } = useAppStore();

  const activeCol = collections.find(c => c.id === activeCollectionId) || collections[0];

  // Modals state
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [notesModalTitle, setNotesModalTitle] = useState<MarvelTitle | null>(null);
  const [moveModalTitle, setMoveModalTitle] = useState<MarvelTitle | null>(null);

  // Filters & Sorting State
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'essential' | 'optional'>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sequence' | 'year' | 'rating' | 'title'>('sequence');

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
        if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
        if (mediaFilter !== 'all' && item.details.mediaType !== mediaFilter) return false;
        if (phaseFilter !== 'all' && (item.phaseGroup || item.details.defaultPhaseGroup) !== phaseFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'sequence') return a.sequenceNumber - b.sequenceNumber;
        if (sortBy === 'year') return a.details.releaseYear - b.details.releaseYear;
        if (sortBy === 'rating') return b.details.rating - a.details.rating;
        if (sortBy === 'title') return a.details.title.localeCompare(b.details.title);
        return 0;
      });
  }, [enrichedItems, statusFilter, priorityFilter, mediaFilter, phaseFilter, sortBy, watchProgress]);

  // Reorder Item Handlers
  const handleMoveUp = (index: number) => {
    if (index === 0 || !activeCol) return;
    const newItems = [...activeCol.items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    reorderCollectionTitles(activeCol.id, newItems);
  };

  const handleMoveDown = (index: number) => {
    if (!activeCol || index === activeCol.items.length - 1) return;
    const newItems = [...activeCol.items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    reorderCollectionTitles(activeCol.id, newItems);
  };

  const collectionCompletedCount = enrichedItems.filter(i => watchProgress[i.movieId]?.status === 'completed').length;
  const collectionTotalCount = enrichedItems.length;
  const collectionPercent = collectionTotalCount > 0 ? Math.round((collectionCompletedCount / collectionTotalCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Collection Header Bar with Switcher */}
      <div className="doom-glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-card">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Collection Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {collections.map(col => {
                const isActive = col.id === activeCollectionId;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollectionId(col.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-marvel tracking-wider uppercase transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-400/40'
                        : 'doom-glass text-gray-400 hover:text-white border border-white/10'
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
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold doom-glass border border-dashed border-emerald-400/40 hover:border-emerald-400 text-emerald-400 flex items-center gap-1 transition-all"
                title="Create a new collection"
              >
                <Plus size={13} />
                <span>New Collection</span>
              </button>
            </div>

            {/* Collection Title & Description */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinematic text-3xl md:text-5xl text-white uppercase tracking-wider">
                  {activeCol?.name}
                </h2>
                {activeCol?.isSystemCollection && (
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-marvel uppercase tracking-wider px-2.5 py-0.5 text-[10px] rounded-full font-bold shadow">
                    OFFICIAL CURATED PREP
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-1">
                {activeCol?.description}
              </p>
            </div>
          </div>

          {/* Right Action Tools for Active Collection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Progress Meter */}
            <div className="doom-glass p-4 rounded-2xl w-full sm:w-56 text-right border border-emerald-500/20">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-400">Watched</span>
                <span className="text-white font-bold">{collectionCompletedCount} / {collectionTotalCount}</span>
              </div>
              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${collectionPercent}%` }}
                />
              </div>
              <div className="text-[10px] bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mt-1 font-mono text-left font-bold">
                {collectionPercent}% Sequence Complete
              </div>
            </div>

            {/* Collection Actions */}
            <div className="flex flex-wrap gap-2">
              {activeCol?.isSystemCollection ? (
                <button
                  onClick={() => resetCollectionToDefault(activeCol.id)}
                  className="p-2.5 rounded-xl doom-glass hover:border-emerald-400 text-gray-300 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
                  title="Reset to recommended order"
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline">Reset Sequence</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingColId(activeCol.id);
                      setColModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl doom-glass hover:border-white text-gray-300 text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
                    title="Rename collection"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteCollection(activeCol.id)}
                    className="p-2.5 rounded-xl doom-glass hover:border-red-500 text-red-400 text-xs font-medium flex items-center gap-1 transition-colors border border-white/10"
                    title="Delete collection"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}

              <button
                onClick={onNavigateDiscover}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 hover:brightness-110 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border border-emerald-400/40 hover:scale-[1.02]"
              >
                <Plus size={14} />
                <span>Add Title</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Sort Toolbar */}
      <div className="doom-glass p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-marvel uppercase tracking-wider text-gray-400 font-bold mr-1">
            Status:
          </span>
          {[
            { val: 'all', label: 'All' },
            { val: 'not_started', label: 'Not Started' },
            { val: 'in_progress', label: 'Watching' },
            { val: 'completed', label: 'Watched' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setStatusFilter(opt.val as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === opt.val
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red"
          >
            <option value="all">All Priorities</option>
            <option value="essential">Essential Only</option>
            <option value="optional">Optional Only</option>
          </select>

          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value as any)}
            className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red"
          >
            <option value="all">Movies & TV</option>
            <option value="movie">Movies Only</option>
            <option value="tv">TV Series Only</option>
          </select>

          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red max-w-[170px] truncate"
          >
            <option value="all">All Phases</option>
            {PHASE_ORDER.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 pl-2 border-l border-doom-border">
            <ArrowUpDown size={13} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-doom-900 border border-doom-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-doom-red"
            >
              <option value="sequence">Sequence Order</option>
              <option value="year">Release Year</option>
              <option value="rating">TMDB Rating</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Titles List / Cards */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="metallic-card rounded-2xl p-12 text-center space-y-4 border border-doom-border">
          <div className="w-16 h-16 rounded-full bg-doom-800 text-gray-400 flex items-center justify-center mx-auto">
            <Film size={28} />
          </div>
          <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white">
            No Titles Match Criteria
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
            Adjust your active filters, reset the sequence, or add new movies and series from the Discover catalog.
          </p>
          <button
            onClick={onNavigateDiscover}
            className="bg-doom-red hover:bg-doom-red-bright text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Discover Titles to Add</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedItems.map((item, index) => {
            const title = item.details;
            const progress = watchProgress[title.id]?.status || 'not_started';
            const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
            const isExpanded = expandedSeriesId === title.id;
            const hasNotes = !!watchProgress[title.id]?.personalNotes;
            const streamInfo = title.streamingIndia?.[0];
            const streamUrl = streamInfo?.directUrl || streamInfo?.searchUrl;

            return (
              <div
                key={title.id}
                className={`doom-glass-card rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-card ${
                  progress === 'completed'
                    ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : progress === 'in_progress'
                    ? 'border-doom-gold/40 bg-amber-950/15 shadow-[0_0_20px_rgba(234,179,8,0.12)]'
                    : 'border-white/10'
                }`}
              >
                {/* 1. Card Poster / Backdrop Header */}
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

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="font-cinematic text-lg font-black text-white px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 shadow-sm">
                        #{String(item.sequenceNumber).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-marvel uppercase tracking-wider px-2 py-0.5 rounded-lg font-bold shadow-sm ${
                        item.priority === 'essential'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-400/40'
                          : 'bg-black/60 text-doom-gold border border-doom-gold/30'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-black/70 backdrop-blur-md text-gray-300 border border-white/10 px-2 py-0.5 rounded-lg font-mono">
                        {title.mediaType === 'tv' ? 'TV' : 'MOVIE'}
                      </span>
                      {sortBy === 'sequence' && (
                        <div className="flex items-center bg-black/70 rounded-lg p-0.5 border border-white/10" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20"
                            title="Move up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === filteredAndSortedItems.length - 1}
                            className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20"
                            title="Move down"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating pill */}
                  <div className="absolute bottom-2.5 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-doom-gold font-mono flex items-center gap-1 border border-white/10">
                    <Star size={10} fill="currentColor" />
                    <span>{title.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* 2. Card Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
                      <span>{title.releaseYear}</span>
                      <span className="truncate max-w-[140px] text-gray-500">
                        {title.defaultPhaseGroup?.split('—')[1]?.trim() || title.defaultPhaseGroup}
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenTitleDetails(title)}
                      className="font-marvel text-lg sm:text-xl font-bold text-white tracking-wide cursor-pointer hover:text-emerald-300 transition-colors line-clamp-1"
                    >
                      {title.title}
                    </h3>

                    <p className="text-xs text-gray-300 line-clamp-2 mt-1 font-sans leading-relaxed">
                      {title.whyItMatters || title.synopsis}
                    </p>

                    {/* TV Episode Progress bar & accordion trigger */}
                    {title.mediaType === 'tv' && epStats && (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <button
                            onClick={() => {
                              setExpandedSeriesId(isExpanded ? null : title.id);
                              if (title.seasons?.[0]) setSelectedSeasonNumber(title.seasons[0].seasonNumber);
                            }}
                            className="text-doom-gold hover:underline flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <span>Episodes ({epStats.watched}/{epStats.total})</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          <span className="text-[10px] text-emerald-400 font-bold">{epStats.percentage}%</span>
                        </div>
                        <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all"
                            style={{ width: `${epStats.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Actions: Direct Streaming + Watch Status Toggle + Controls */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    {/* Direct Streaming Button with Doom green gradient */}
                    {streamUrl && (
                      <a
                        href={streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all border border-emerald-400/40 hover:scale-[1.02]"
                      >
                        <Play size={12} fill="white" />
                        <span>{streamInfo.directUrl ? `Stream on ${streamInfo.provider}` : `Find on ${streamInfo.provider}`}</span>
                        <ExternalLink size={11} className="opacity-80" />
                      </a>
                    )}

                    {/* Status Toggle Bar */}
                    <div className="grid grid-cols-3 bg-black/50 p-0.5 rounded-xl border border-white/10 text-center text-xs">
                      <button
                        onClick={() => updateWatchStatus(title.id, 'not_started')}
                        className={`py-1 rounded-lg transition-colors font-medium ${
                          progress === 'not_started'
                            ? 'bg-white/20 text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateWatchStatus(title.id, 'in_progress')}
                        className={`py-1 rounded-lg transition-colors font-medium ${
                          progress === 'in_progress'
                            ? 'bg-doom-gold text-doom-950 font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Watching
                      </button>
                      <button
                        onClick={() => updateWatchStatus(title.id, 'completed')}
                        className={`py-1 rounded-lg transition-colors font-medium flex items-center justify-center gap-1 ${
                          progress === 'completed'
                            ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-bold shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 size={11} />
                        <span>Watched</span>
                      </button>
                    </div>

                    {/* Tool Buttons: View Info, Priority, Notes, Move, Delete */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      <button
                        onClick={() => onOpenTitleDetails(title)}
                        className="flex-1 py-1 px-2 rounded-lg text-xs font-semibold doom-glass hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <Info size={12} />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => toggleTitlePriority(activeCol.id, title.id)}
                        className="p-1.5 rounded-lg doom-glass hover:bg-white/10 text-gray-400 hover:text-emerald-300 transition-colors border border-white/10"
                        title={`Toggle priority (currently ${item.priority})`}
                      >
                        <Sparkles size={13} />
                      </button>

                      <button
                        onClick={() => setNotesModalTitle(title)}
                        className={`p-1.5 rounded-lg doom-glass hover:bg-white/10 transition-colors border ${
                          hasNotes ? 'border-emerald-400 text-emerald-400' : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                        title={hasNotes ? 'Edit personal notes' : 'Add personal notes'}
                      >
                        <FileText size={13} />
                      </button>

                      <button
                        onClick={() => setMoveModalTitle(title)}
                        className="p-1.5 rounded-lg doom-glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/10"
                        title="Add to another collection"
                      >
                        <Layers size={13} />
                      </button>

                      <button
                        onClick={() => removeTitleFromCollection(activeCol.id, title.id)}
                        className="p-1.5 rounded-lg doom-glass hover:bg-red-950/60 text-gray-400 hover:text-red-400 transition-colors border border-white/10"
                        title="Remove from collection"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Collapsible TV Series Episodes Breakdown inside Card */}
                {title.mediaType === 'tv' && isExpanded && title.seasons && (
                  <div className="border-t border-white/10 bg-black/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {title.seasons.map(s => (
                          <button
                            key={s.seasonNumber}
                            onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                              selectedSeasonNumber === s.seasonNumber
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            S{s.seasonNumber} ({s.episodeCount} eps)
                          </button>
                        ))}
                      </div>

                      {epStats?.nextUnwatched && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Next: S{epStats.nextUnwatched.season} E{epStats.nextUnwatched.episode}
                        </span>
                      )}
                    </div>

                    {title.seasons
                      .filter(s => s.seasonNumber === selectedSeasonNumber)
                      .map(season => (
                        <div key={season.seasonNumber} className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {season.episodes.map(ep => {
                            const watched = isEpisodeWatched(title.id, season.seasonNumber, ep.episodeNumber);
                            return (
                              <div
                                key={ep.episodeNumber}
                                onClick={() => toggleEpisodeWatched(title.id, season.seasonNumber, ep.episodeNumber)}
                                className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                                  watched
                                    ? 'bg-emerald-950/30 border-emerald-500/30 text-gray-400 line-through'
                                    : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                    watched ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                                  }`}>
                                    {watched && <CheckCircle2 size={11} />}
                                  </div>
                                  <span className="font-mono text-[10px] text-gray-400">E{ep.episodeNumber}</span>
                                  <span className="truncate">{ep.title}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono shrink-0">{ep.runtime}m</span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CollectionModal
        isOpen={colModalOpen}
        onClose={() => setColModalOpen(false)}
        editingCollectionId={editingColId}
      />

      <NotesModal
        isOpen={!!notesModalTitle}
        title={notesModalTitle}
        onClose={() => setNotesModalTitle(null)}
      />

      <MoveCollectionModal
        isOpen={!!moveModalTitle}
        title={moveModalTitle}
        onClose={() => setMoveModalTitle(null)}
      />
    </div>
  );
};
