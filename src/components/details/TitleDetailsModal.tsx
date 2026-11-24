import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  Plus, 
  Check, 
  Sparkles,
  Bookmark,
  Tv,
  Film
} from 'lucide-react';
import { MarvelTitle } from '../../data/marvelCatalogue';
import { useAppStore } from '../../services/store';
import { CinematicImage } from '../common/CinematicImage';

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
    toggleEpisodeWatched,
    isEpisodeWatched,
  } = useAppStore();

  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [personalNotesInput, setPersonalNotesInput] = useState<string>('');

  // Sync state on open
  React.useEffect(() => {
    if (title) {
      setPersonalNotesInput(watchProgress[title.id]?.personalNotes || '');
      if (title.seasons?.[0]) {
        setSelectedSeason(title.seasons[0].seasonNumber);
      }
    }
  }, [title, watchProgress]);

  // Support closing modal with Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !title) return null;

  const currentStatus = watchProgress[title.id]?.status || 'not_started';
  const primaryStream = title.streamingIndia?.[0];
  const streamUrl = primaryStream?.directUrl || primaryStream?.searchUrl;

  const handleSaveNotes = () => {
    updatePersonalNotes(title.id, personalNotesInput);
    setShowNotes(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto no-scrollbar"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0e1219] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Image Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0 bg-doom-950">
          <CinematicImage
            src={title.backdropPath || title.posterPath}
            alt={title.title}
            fallbackTitle={title.title}
            fallbackSubtitle={title.releaseYear?.toString()}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1219] via-[#0e1219]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1219]/80 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>

          {/* Overlaid Title & Essential Info */}
          <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/10 text-white">
                {title.mediaType === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className="text-xs text-gray-300 font-mono">
                {title.releaseYear} • {title.mediaType === 'tv' ? `${title.seasons?.length || 1} Seasons` : `${title.runtime} min`}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-medium ml-auto">
                <Star size={13} fill="currentColor" />
                <span>{title.rating.toFixed(1)}</span>
              </div>
            </div>

            <h2 className="font-cinematic text-2xl sm:text-4xl text-white uppercase tracking-wider drop-shadow-md">
              {title.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 no-scrollbar">
          {/* Action Bar: Direct Streaming & Watchlist Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              {streamUrl && (
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Watch on {primaryStream?.provider || 'Platform'}</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              )}

              {/* Status Toggle Buttons */}
              <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 shrink-0">
                <button
                  onClick={() => updateWatchStatus(title.id, 'not_started')}
                  className={`px-2.5 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                    currentStatus === 'not_started'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Not Started
                </button>
                <button
                  onClick={() => updateWatchStatus(title.id, 'in_progress')}
                  className={`px-2.5 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                    currentStatus === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Watching
                </button>
                <button
                  onClick={() => updateWatchStatus(title.id, 'completed')}
                  className={`px-2.5 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1 ${
                    currentStatus === 'completed'
                      ? 'bg-emerald-500 text-white font-semibold shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 size={12} />
                  <span>Watched</span>
                </button>
              </div>
            </div>

            {primaryStream && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Streaming in India 🇮🇳</span>
              </span>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              {title.synopsis}
            </p>
          </div>

          {/* Essential Context (Why it matters) — Clean Minimal Callout */}
          {title.whyItMatters && (
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 space-y-1">
              <span className="text-gray-400 font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles size={12} className="text-emerald-400/80" />
                <span>Road to Doomsday</span>
              </span>
              <p className="leading-relaxed text-gray-300 font-sans">
                {title.whyItMatters}
              </p>
            </div>
          )}

          {/* Cast & Details in a Clean Row */}
          <div className="text-xs text-gray-400 space-y-1.5 pt-2">
            <div>
              <span className="text-gray-500">Director: </span>
              <span className="text-gray-200 font-medium">{title.director}</span>
            </div>
            <div>
              <span className="text-gray-500">Cast: </span>
              <span className="text-gray-300">{title.cast.join(', ')}</span>
            </div>
            <div>
              <span className="text-gray-500">Genres: </span>
              <span className="text-gray-400">{title.genres.join(', ')}</span>
            </div>
          </div>

          {/* TV Episodes List (if series) — Clean & Compact */}
          {title.mediaType === 'tv' && title.seasons && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Episodes</h4>
                {title.seasons.length > 1 && (
                  <div className="flex items-center gap-1">
                    {title.seasons.map(s => (
                      <button
                        key={s.seasonNumber}
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                          selectedSeason === s.seasonNumber
                            ? 'bg-white text-black font-semibold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        S{s.seasonNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {title.seasons
                .filter(s => s.seasonNumber === selectedSeason)
                .map(s => (
                  <div key={s.seasonNumber} className="space-y-1.5">
                    {s.episodes.map(ep => {
                      const watched = isEpisodeWatched(title.id, s.seasonNumber, ep.episodeNumber);
                      return (
                        <div
                          key={ep.episodeNumber}
                          onClick={() => toggleEpisodeWatched(title.id, s.seasonNumber, ep.episodeNumber)}
                          className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            watched 
                              ? 'bg-emerald-950/15 border-emerald-500/30' 
                              : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              watched ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                            }`}>
                              {watched && <Check size={11} />}
                            </div>
                            <span className="text-xs text-gray-400 font-mono shrink-0">E{ep.episodeNumber}</span>
                            <span className={`text-xs font-medium truncate ${watched ? 'text-gray-400 line-through' : 'text-white'}`}>
                              {ep.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono shrink-0">{ep.runtime}m</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          )}

          {/* Minimal Notes Toggle */}
          <div className="pt-2">
            {!showNotes ? (
              <button
                onClick={() => setShowNotes(true)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                {personalNotesInput ? 'Edit personal notes' : '+ Add personal notes'}
              </button>
            ) : (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  placeholder="Add personal notes..."
                  value={personalNotesInput}
                  onChange={(e) => setPersonalNotesInput(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-gray-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowNotes(false)}
                    className="px-3 py-1 rounded text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded text-xs font-medium bg-emerald-500 text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
