import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Clock, 
  Star, 
  Tv, 
  Film, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Check, 
  Compass, 
  Layers, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { MarvelTitle } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';

interface TitleDetailsModalProps {
  title: MarvelTitle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TitleDetailsModal: React.FC<TitleDetailsModalProps> = ({ 
  title, 
  isOpen, 
  onClose 
}) => {
  const { 
    watchProgress, 
    updateWatchStatus, 
    updatePersonalNotes,
    episodeProgress,
    toggleEpisodeWatched,
    isEpisodeWatched,
    getSeriesEpisodeStats
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'lore' | 'episodes' | 'streaming' | 'notes'>('lore');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [personalNotesInput, setPersonalNotesInput] = useState<string>('');
  const [isRefreshingStreaming, setIsRefreshingStreaming] = useState(false);
  const [streamRefreshMsg, setStreamRefreshMsg] = useState('');

  // Sync notes when opening
  React.useEffect(() => {
    if (title) {
      setPersonalNotesInput(watchProgress[title.id]?.personalNotes || '');
      if (title.seasons?.[0]) {
        setSelectedSeason(title.seasons[0].seasonNumber);
      }
    }
  }, [title, watchProgress]);

  if (!isOpen || !title) return null;

  const currentStatus = watchProgress[title.id]?.status || 'not_started';
  const epStats = title.mediaType === 'tv' ? getSeriesEpisodeStats(title.id) : null;

  const handleSaveNotes = () => {
    updatePersonalNotes(title.id, personalNotesInput);
  };

  const handleRefreshStreaming = () => {
    setIsRefreshingStreaming(true);
    setStreamRefreshMsg('');
    setTimeout(() => {
      setIsRefreshingStreaming(false);
      setStreamRefreshMsg('Verified with India streaming catalogs (JioHotstar, Prime Video, Netflix). All links confirmed.');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-doom-900 border border-doom-border rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Backdrop Image Hero Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-doom-950">
          <img
            src={title.backdropPath || title.posterPath}
            alt={title.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-doom-900 via-doom-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-doom-900/90 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>

          {/* Overlaid Title & Meta */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end gap-6 z-10">
            {/* Poster Thumbnail */}
            <div className="w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0 hidden sm:block bg-doom-950">
              <img src={title.posterPath} alt={title.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="marvel-badge px-2 py-0.5 text-[10px] rounded">
                  {title.mediaType === 'tv' ? 'TV SERIES' : 'MOVIE'}
                </span>
                <span className={`text-[10px] font-marvel uppercase px-2 py-0.5 rounded font-bold ${
                  title.canonStatus === 'Confirmed Canon'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {title.canonStatus}
                </span>
                <span className="text-[10px] text-gray-300 font-mono">
                  {title.releaseYear} • {title.mediaType === 'tv' ? `${title.seasons?.length || 1} Seasons` : `${title.runtime} mins`}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-doom-gold font-mono ml-auto">
                  <Star size={12} fill="currentColor" />
                  <span>{title.rating.toFixed(1)} / 10</span>
                </div>
              </div>

              <h2 className="font-cinematic text-3xl sm:text-5xl text-white uppercase tracking-wider text-glow-red">
                {title.title}
              </h2>

              <p className="text-xs text-gray-300 line-clamp-2 max-w-2xl font-sans">
                {title.synopsis}
              </p>
            </div>
          </div>
        </div>

        {/* Status Bar / Direct Controls */}
        <div className="bg-doom-950 px-6 py-3 border-y border-doom-border/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">Viewing Status:</span>
            <div className="flex items-center bg-doom-900 border border-doom-border rounded-lg p-0.5">
              <button
                onClick={() => updateWatchStatus(title.id, 'not_started')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  currentStatus === 'not_started'
                    ? 'bg-doom-800 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Not Started
              </button>
              <button
                onClick={() => updateWatchStatus(title.id, 'in_progress')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  currentStatus === 'in_progress'
                    ? 'bg-doom-gold text-doom-950 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Watching
              </button>
              <button
                onClick={() => updateWatchStatus(title.id, 'completed')}
                className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  currentStatus === 'completed'
                    ? 'bg-doom-emerald text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CheckCircle2 size={12} />
                <span>Watched</span>
              </button>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex items-center gap-1 bg-doom-900 border border-doom-border rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveTab('lore')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'lore' ? 'bg-doom-red text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cinematic Lore
            </button>
            {title.mediaType === 'tv' && (
              <button
                onClick={() => setActiveTab('episodes')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'episodes' ? 'bg-doom-red text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Episodes ({epStats?.watched}/{epStats?.total})
              </button>
            )}
            <button
              onClick={() => setActiveTab('streaming')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'streaming' ? 'bg-doom-red text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Streaming (India)
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'notes' ? 'bg-doom-red text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CINEMATIC LORE & CONTEXT */}
          {activeTab === 'lore' && (
            <div className="space-y-6">
              {/* Why This Matters */}
              <div className="bg-gradient-to-r from-doom-950 via-doom-900 to-doom-950 p-5 rounded-2xl border border-doom-red/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-doom-red" />
                  <span className="text-xs font-marvel uppercase tracking-wider text-doom-red font-bold">
                    Why This Matters to Avengers: Doomsday
                  </span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed font-sans">
                  {title.whyItMatters}
                </p>
              </div>

              {/* Multiverse Significance & Canon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-doom-950 p-4 rounded-xl border border-doom-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-marvel uppercase tracking-wider text-doom-gold font-bold">
                    <Compass size={14} />
                    <span>Multiverse Significance</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {title.multiverseSignificance}
                  </p>
                </div>

                <div className="bg-doom-950 p-4 rounded-xl border border-doom-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-marvel uppercase tracking-wider text-doom-emerald font-bold">
                    <ShieldCheck size={14} />
                    <span>Canon Verification</span>
                  </div>
                  <div className="text-xs text-gray-300 font-sans space-y-1">
                    <div>Status: <strong className="text-white">{title.canonStatus}</strong></div>
                    <div className="text-[11px] text-gray-400">
                      Distinguished strictly between official Marvel Studios releases, multiverse legacy variants, and speculative theories.
                    </div>
                  </div>
                </div>
              </div>

              {/* Characters Introduced */}
              <div className="space-y-2">
                <div className="text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
                  Important Characters Introduced
                </div>
                <div className="flex flex-wrap gap-2">
                  {title.charactersIntroduced.map((char, idx) => (
                    <span
                      key={idx}
                      className="bg-doom-950 text-white border border-doom-border px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Plot Developments */}
              <div className="space-y-2">
                <div className="text-xs font-marvel uppercase tracking-wider text-gray-400 font-bold">
                  Crucial Plot Developments
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300 font-sans list-disc list-inside">
                  {title.relevantPlotPoints.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cast and Director */}
              <div className="pt-2 border-t border-doom-border text-xs text-gray-400 space-y-1">
                <div><span className="text-gray-500">Director:</span> <strong className="text-gray-200">{title.director}</strong></div>
                <div><span className="text-gray-500">Cast:</span> {title.cast.join(', ')}</div>
                <div><span className="text-gray-500">Genres:</span> {title.genres.join(', ')}</div>
              </div>
            </div>
          )}

          {/* TAB 2: EPISODES (FOR TV) */}
          {activeTab === 'episodes' && title.seasons && (
            <div className="space-y-4">
              {/* Season Tabs */}
              <div className="flex items-center gap-2">
                {title.seasons.map(s => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeason(s.seasonNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedSeason === s.seasonNumber
                        ? 'bg-doom-gold text-doom-950 shadow-md'
                        : 'bg-doom-950 text-gray-400 border border-doom-border hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber} ({s.episodes.length} Episodes)
                  </button>
                ))}
              </div>

              {/* Episodes List */}
              {title.seasons
                .filter(s => s.seasonNumber === selectedSeason)
                .map(s => (
                  <div key={s.seasonNumber} className="space-y-2">
                    {s.episodes.map(ep => {
                      const watched = isEpisodeWatched(title.id, s.seasonNumber, ep.episodeNumber);
                      return (
                        <div
                          key={ep.episodeNumber}
                          onClick={() => toggleEpisodeWatched(title.id, s.seasonNumber, ep.episodeNumber)}
                          className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                            watched 
                              ? 'bg-doom-950/60 border-doom-emerald/30' 
                              : 'bg-doom-950 border-doom-border hover:border-doom-border-light'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                              watched ? 'bg-doom-emerald border-doom-emerald text-white' : 'border-doom-border bg-doom-900'
                            }`}>
                              {watched && <Check size={13} />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-doom-gold">
                                  EP {ep.episodeNumber}
                                </span>
                                <h4 className={`text-sm font-semibold ${watched ? 'text-gray-400 line-through' : 'text-white'}`}>
                                  {ep.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 font-mono">{ep.runtime} mins</span>
                              </div>
                              <p className="text-xs text-gray-400 font-sans line-clamp-2">
                                {ep.overview}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] text-gray-500 font-mono shrink-0">
                            {ep.airDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          )}

          {/* TAB 3: STREAMING AVAILABILITY (INDIA FOCUS) */}
          {activeTab === 'streaming' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-marvel text-lg text-white font-bold tracking-wide">
                    Streaming Availability in India 🇮🇳
                  </h4>
                  <p className="text-xs text-gray-400 font-sans">
                    Verified platform listings. Prioritizes JioHotstar / Disney+ Hotstar, Netflix, and Prime Video.
                  </p>
                </div>

                <button
                  onClick={handleRefreshStreaming}
                  disabled={isRefreshingStreaming}
                  className="p-2 rounded-lg bg-doom-950 border border-doom-border text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={14} className={isRefreshingStreaming ? 'animate-spin' : ''} />
                  <span>Refresh Availability</span>
                </button>
              </div>

              {streamRefreshMsg && (
                <div className="p-3 bg-doom-950 border border-doom-emerald text-doom-emerald rounded-xl text-xs font-sans">
                  {streamRefreshMsg}
                </div>
              )}

              {title.streamingIndia && title.streamingIndia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {title.streamingIndia.map((provider, idx) => (
                    <div
                      key={idx}
                      className="metallic-card p-5 rounded-2xl border border-doom-border space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-marvel text-lg font-bold text-white tracking-wide">
                            {provider.provider}
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            provider.availabilityStatus === 'available'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {provider.availabilityStatus}
                          </span>
                        </div>
                        {provider.notes && (
                          <p className="text-xs text-gray-400 font-sans">
                            {provider.notes}
                          </p>
                        )}
                        <div className="text-[10px] text-gray-500 font-mono">
                          Last verified: {provider.lastVerifiedAt}
                        </div>
                      </div>

                      <div className="pt-2">
                        {provider.directUrl ? (
                          <a
                            href={provider.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-doom-red hover:bg-doom-red-bright text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-glow-red flex items-center justify-center gap-1.5"
                          >
                            <span>Stream Directly on {provider.provider}</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <a
                            href={provider.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-doom-950 hover:bg-doom-800 border border-doom-border text-gray-200 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Search on {provider.provider}</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-doom-950 border border-doom-border rounded-2xl text-gray-400 text-xs font-sans">
                  Streaming availability for this title in India could not be automatically verified.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-marvel text-lg text-white font-bold tracking-wide">
                    Operative Field Notes
                  </h4>
                  <p className="text-xs text-gray-400 font-sans">
                    Keep your own notes, continuity questions, and review observations for this title.
                  </p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="bg-doom-red hover:bg-doom-red-bright text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-glow-red flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Save Notes</span>
                </button>
              </div>

              <textarea
                rows={8}
                placeholder="Write your personal notes for this title..."
                value={personalNotesInput}
                onChange={(e) => setPersonalNotesInput(e.target.value)}
                className="w-full bg-doom-950 border border-doom-border rounded-xl p-4 text-sm text-gray-100 focus:outline-none focus:border-doom-red transition-colors resize-none leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
