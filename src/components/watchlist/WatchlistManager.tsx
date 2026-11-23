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
  Info
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
      <div className="metallic-card rounded-3xl p-6 md:p-8 border border-doom-border/90 bg-gradient-to-r from-doom-900 via-doom-850 to-doom-950">
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-marvel tracking-wider uppercase transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-doom-red text-white font-bold shadow-sm'
                        : 'bg-doom-950/80 text-gray-400 hover:text-white border border-doom-border'
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
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-doom-950 border border-dashed border-doom-border hover:border-doom-gold text-doom-gold flex items-center gap-1 transition-all"
                title="Create a new collection"
              >
                <Plus size={13} />
                <span>New Collection</span>
              </button>
            </div>

            {/* Collection Title & Description */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinematic text-3xl md:text-4xl text-white uppercase tracking-wider">
                  {activeCol?.name}
                </h2>
                {activeCol?.isSystemCollection && (
                  <span className="marvel-badge px-2 py-0.5 text-[10px] rounded">
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
            <div className="bg-doom-950/90 border border-doom-border p-4 rounded-2xl w-full sm:w-56 text-right">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-400">Watched</span>
                <span className="text-white font-bold">{collectionCompletedCount} / {collectionTotalCount}</span>
              </div>
              <div className="w-full bg-doom-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-doom-red to-doom-gold rounded-full transition-all duration-500"
                  style={{ width: `${collectionPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-doom-gold mt-1 font-mono text-left">
                {collectionPercent}% Sequence Complete
              </div>
            </div>

            {/* Collection Actions */}
            <div className="flex flex-wrap gap-2">
              {activeCol?.isSystemCollection ? (
                <button
                  onClick={() => resetCollectionToDefault(activeCol.id)}
                  className="p-2.5 rounded-xl bg-doom-950 border border-doom-border hover:border-doom-gold text-gray-400 hover:text-doom-gold text-xs font-medium flex items-center gap-1.5 transition-colors"
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
                    className="p-2.5 rounded-xl bg-doom-950 border border-doom-border hover:border-white text-gray-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Rename collection"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteCollection(activeCol.id)}
                    className="p-2.5 rounded-xl bg-doom-950 border border-doom-border hover:border-red-500 text-red-400 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}

              <button
                onClick={onNavigateDiscover}
                className="bg-doom-red hover:bg-doom-red-bright text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Title</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Sort Toolbar */}
      <div className="bg-doom-950/80 border border-doom-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
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
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === opt.val
                  ? 'bg-doom-red text-white font-semibold shadow-sm'
                  : 'bg-doom-900 text-gray-400 hover:text-white border border-doom-border'
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
        <div className="space-y-4">
          {filteredAndSortedItems.map((item, index) => {
            const title = item.details;
            const progress = watchProgress[title.id]?.status || 'not_started';
            const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;
            const isExpanded = expandedSeriesId === title.id;
            const hasNotes = !!watchProgress[title.id]?.personalNotes;

            return (
              <div
                key={title.id}
                className={`metallic-card rounded-2xl border transition-all overflow-hidden ${
                  progress === 'completed'
                    ? 'border-doom-border/50 bg-doom-950/60'
                    : progress === 'in_progress'
                    ? 'border-doom-gold/40'
                    : 'border-doom-border/80'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Left: Sequence + Poster + Details */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Sequence Badge + Reorder buttons */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className="font-cinematic text-2xl sm:text-3xl font-black text-gray-400 tracking-wider">
                        #{String(item.sequenceNumber).padStart(2, '0')}
                      </span>
                      {sortBy === 'sequence' && (
                        <div className="flex flex-col gap-0.5 mt-1">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === filteredAndSortedItems.length - 1}
                            className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Poster Thumbnail */}
                    <div 
                      onClick={() => onOpenTitleDetails(title)}
                      className="w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden bg-doom-950 shrink-0 border border-doom-border relative group cursor-pointer shadow-md"
                    >
                      <CinematicImage
                        src={title.posterPath}
                        alt={title.title}
                        fallbackTitle={title.title}
                        fallbackSubtitle={String(title.releaseYear)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Info size={16} />
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-marvel uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                          item.priority === 'essential'
                            ? 'bg-doom-red text-white'
                            : 'bg-doom-800 text-doom-gold border border-doom-gold/30'
                        }`}>
                          {item.priority}
                        </span>

                        <span className="text-[10px] bg-doom-950 text-gray-400 border border-doom-border px-2 py-0.5 rounded font-mono">
                          {title.mediaType === 'tv' ? 'TV SERIES' : 'MOVIE'} • {title.releaseYear}
                        </span>

                        {title.defaultPhaseGroup && (
                          <span className="hidden sm:inline-block text-[10px] text-gray-400 font-mono truncate">
                            {title.defaultPhaseGroup.split('—')[1]?.trim() || title.defaultPhaseGroup}
                          </span>
                        )}
                      </div>

                      <h3 
                        onClick={() => onOpenTitleDetails(title)}
                        className={`font-marvel text-lg sm:text-xl font-bold tracking-wide truncate cursor-pointer hover:text-doom-red transition-colors ${
                          progress === 'completed' ? 'text-gray-300 line-through' : 'text-white'
                        }`}
                      >
                        {title.title}
                      </h3>

                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-sans">
                        {title.whyItMatters || title.synopsis}
                      </p>

                      {/* TV Episode Progress Mini Bar */}
                      {title.mediaType === 'tv' && epStats && (
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => {
                              setExpandedSeriesId(isExpanded ? null : title.id);
                              if (title.seasons?.[0]) setSelectedSeasonNumber(title.seasons[0].seasonNumber);
                            }}
                            className="text-xs text-doom-gold hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>Episodes ({epStats.watched}/{epStats.total})</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          <div className="w-28 bg-doom-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-doom-gold rounded-full transition-all"
                              style={{ width: `${epStats.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Status Controls & Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                    <div className="flex items-center bg-doom-950 border border-doom-border rounded-lg p-0.5">
                      <button
                        onClick={() => updateWatchStatus(title.id, 'not_started')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          progress === 'not_started'
                            ? 'bg-doom-800 text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateWatchStatus(title.id, 'in_progress')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          progress === 'in_progress'
                            ? 'bg-doom-gold text-doom-950 font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Watching
                      </button>
                      <button
                        onClick={() => updateWatchStatus(title.id, 'completed')}
                        className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                          progress === 'completed'
                            ? 'bg-doom-emerald text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        <span>Watched</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleTitlePriority(activeCol.id, title.id)}
                      className="p-2 rounded-lg bg-doom-950 border border-doom-border text-gray-400 hover:text-doom-gold transition-colors"
                      title={`Toggle priority (currently ${item.priority})`}
                    >
                      <Sparkles size={14} />
                    </button>

                    <button
                      onClick={() => setNotesModalTitle(title)}
                      className={`p-2 rounded-lg bg-doom-950 border transition-colors ${
                        hasNotes
                          ? 'border-doom-gold text-doom-gold'
                          : 'border-doom-border text-gray-400 hover:text-white'
                      }`}
                      title={hasNotes ? 'Edit personal debrief notes' : 'Add personal notes'}
                    >
                      <FileText size={14} />
                    </button>

                    <button
                      onClick={() => setMoveModalTitle(title)}
                      className="p-2 rounded-lg bg-doom-950 border border-doom-border text-gray-400 hover:text-white transition-colors"
                      title="Add to another collection"
                    >
                      <Layers size={14} />
                    </button>

                    <button
                      onClick={() => removeTitleFromCollection(activeCol.id, title.id)}
                      className="p-2 rounded-lg bg-doom-950 border border-doom-border text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove from this collection"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* TV Series Episode Breakdown */}
                {title.mediaType === 'tv' && isExpanded && title.seasons && (
                  <div className="border-t border-doom-border/80 bg-doom-950/90 p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {title.seasons.map(s => (
                          <button
                            key={s.seasonNumber}
                            onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                              selectedSeasonNumber === s.seasonNumber
                                ? 'bg-doom-gold text-doom-950 font-bold shadow-md'
                                : 'bg-doom-900 text-gray-400 border border-doom-border hover:text-white'
                            }`}
                          >
                            Season {s.seasonNumber} ({s.episodeCount} eps)
                          </button>
                        ))}
                      </div>

                      {epStats?.nextUnwatched && (
                        <span className="text-xs text-doom-gold font-mono">
                          Resume: Season {epStats.nextUnwatched.season}, Episode {epStats.nextUnwatched.episode}
                        </span>
                      )}
                    </div>

                    {title.seasons
                      .filter(s => s.seasonNumber === selectedSeasonNumber)
                      .map(season => (
                        <div key={season.seasonNumber} className="space-y-2">
                          {season.episodes.map(ep => {
                            const watched = isEpisodeWatched(title.id, season.seasonNumber, ep.episodeNumber);
                            return (
                              <div
                                key={ep.episodeNumber}
                                onClick={() => toggleEpisodeWatched(title.id, season.seasonNumber, ep.episodeNumber)}
                                className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  watched
                                    ? 'bg-doom-900/40 border-doom-emerald/30'
                                    : 'bg-doom-900/80 border-doom-border hover:border-doom-border-light'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="pt-0.5">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                      watched
                                        ? 'bg-doom-emerald border-doom-emerald text-white'
                                        : 'border-doom-border bg-doom-950 text-transparent'
                                    }`}>
                                      <CheckCircle2 size={13} fill="currentColor" />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono font-bold text-gray-400">
                                        EP {ep.episodeNumber}
                                      </span>
                                      <h5 className={`text-xs sm:text-sm font-semibold tracking-wide ${
                                        watched ? 'text-gray-400 line-through' : 'text-white'
                                      }`}>
                                        {ep.title}
                                      </h5>
                                      <span className="text-[10px] text-gray-500 font-mono">
                                        {ep.runtime}m
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5 font-sans">
                                      {ep.overview}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-[11px] text-gray-500 font-mono shrink-0">
                                  {ep.airDate}
                                </div>
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
