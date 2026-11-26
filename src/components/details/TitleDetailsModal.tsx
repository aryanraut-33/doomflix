import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Star,
  ExternalLink,
  Check,
  Sparkles,
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
  onClose,
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

  React.useEffect(() => {
    if (title) {
      setPersonalNotesInput(watchProgress[title.id]?.personalNotes || '');
      if (title.seasons?.[0]) {
        setSelectedSeason(title.seasons[0].seasonNumber);
      }
      setShowNotes(false);
    }
  }, [title, watchProgress]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-modal-title"
        className="ui-dialog-enter relative w-full max-w-2xl bg-[#101319] border border-white/12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0 bg-doom-950">
          <CinematicImage
            src={title.backdropPath || title.posterPath}
            alt={title.title}
            fallbackTitle={title.title}
            fallbackSubtitle={title.releaseYear?.toString()}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-[#101319]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101319]/85 via-transparent to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close title details"
            className="ui-press ui-press--on-dark ui-focus absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center"
          >
            <X size={17} aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-white/12 text-white">
                {title.mediaType === 'tv' ? 'Series' : 'Movie'}
              </span>
              <span className="text-xs text-slate-300 font-mono tabular-nums">
                {title.releaseYear} ·{' '}
                {title.mediaType === 'tv'
                  ? `${title.seasons?.length || 1} Seasons`
                  : `${title.runtime} min`}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-medium ml-auto">
                <Star size={13} fill="currentColor" aria-hidden="true" />
                <span className="tabular-nums">{title.rating.toFixed(1)}</span>
              </div>
            </div>

            <h2
              id="details-modal-title"
              className="font-cinematic text-3xl sm:text-4xl text-white uppercase tracking-wider leading-[0.95]"
            >
              {title.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 no-scrollbar">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2.5">
              {streamUrl && (
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-press ui-focus h-9 inline-flex items-center justify-center gap-2 bg-white text-doom-950 px-4 rounded-lg font-semibold text-xs sm:text-sm shrink-0"
                >
                  <Play size={13} fill="currentColor" className="ml-px" aria-hidden="true" />
                  <span>Watch on {primaryStream?.provider || 'Platform'}</span>
                  <ExternalLink size={12} className="opacity-70" aria-hidden="true" />
                </a>
              )}

              <div
                role="group"
                aria-label="Watch status"
                className="inline-flex items-center h-9 bg-white/[0.05] border border-white/12 rounded-lg p-1 gap-1 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => updateWatchStatus(title.id, 'not_started')}
                  aria-pressed={currentStatus === 'not_started'}
                  className={`ui-press ui-press--on-dark ui-focus h-7 px-2.5 rounded-md text-xs whitespace-nowrap ${
                    currentStatus === 'not_started'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Not Started
                </button>
                <button
                  type="button"
                  onClick={() => updateWatchStatus(title.id, 'in_progress')}
                  aria-pressed={currentStatus === 'in_progress'}
                  className={`ui-press ui-press--on-dark ui-focus h-7 px-2.5 rounded-md text-xs whitespace-nowrap ${
                    currentStatus === 'in_progress'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Watching
                </button>
                <button
                  type="button"
                  onClick={() => updateWatchStatus(title.id, 'completed')}
                  aria-pressed={currentStatus === 'completed'}
                  className={`ui-press ui-press--on-dark ui-focus h-7 px-2.5 rounded-md text-xs whitespace-nowrap flex items-center gap-1.5 ${
                    currentStatus === 'completed'
                      ? 'bg-emerald-500 text-doom-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 size={12} aria-hidden="true" />
                  <span>Watched</span>
                </button>
              </div>
            </div>

            {primaryStream && (
              <span className="text-xs text-slate-400 shrink-0">
                Available in India
              </span>
            )}
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{title.synopsis}</p>

          {title.whyItMatters && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-400" aria-hidden="true" />
                <span>Road to Doomsday</span>
              </div>
              <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
                {title.whyItMatters}
              </p>
            </div>
          )}

          <dl className="grid grid-cols-1 gap-1.5 text-xs pt-1">
            <div className="flex gap-2">
              <dt className="text-slate-400 w-16 shrink-0">Director</dt>
              <dd className="text-slate-100 font-medium">{title.director}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-400 w-16 shrink-0">Cast</dt>
              <dd className="text-slate-300">{title.cast.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-400 w-16 shrink-0">Genres</dt>
              <dd className="text-slate-400">{title.genres.join(', ')}</dd>
            </div>
          </dl>

          {/* Episodes List */}
          {title.mediaType === 'tv' && title.seasons && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Episodes</h4>
                {title.seasons.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {title.seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        type="button"
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                        aria-pressed={selectedSeason === s.seasonNumber}
                        className={`ui-press ui-press--on-dark ui-focus h-7 px-2.5 rounded-md text-xs font-mono tabular-nums ${
                          selectedSeason === s.seasonNumber
                            ? 'bg-white text-doom-950 font-semibold'
                            : 'text-slate-400 hover:text-white bg-white/[0.04]'
                        }`}
                      >
                        S{s.seasonNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {title.seasons
                .filter((s) => s.seasonNumber === selectedSeason)
                .map((s) => (
                  <div key={s.seasonNumber} className="space-y-1.5">
                    {s.episodes.map((ep) => {
                      const watched = isEpisodeWatched(
                        title.id,
                        s.seasonNumber,
                        ep.episodeNumber
                      );
                      return (
                        <button
                          key={ep.episodeNumber}
                          type="button"
                          onClick={() =>
                            toggleEpisodeWatched(title.id, s.seasonNumber, ep.episodeNumber)
                          }
                          aria-pressed={watched}
                          className={`ui-press ui-press--surface ui-press--on-dark ui-focus w-full flex items-center justify-between gap-3 p-2.5 rounded-xl border text-left ${
                            watched
                              ? 'bg-emerald-500/10 border-emerald-500/35'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                watched
                                  ? 'bg-emerald-500 border-emerald-500 text-doom-950'
                                  : 'border-white/25'
                              }`}
                            >
                              {watched && <Check size={11} strokeWidth={2.5} aria-hidden="true" />}
                            </span>
                            <span className="text-xs text-slate-400 font-mono tabular-nums shrink-0">
                              E{ep.episodeNumber}
                            </span>
                            <span
                              className={`text-xs font-medium truncate ${
                                watched ? 'text-slate-400 line-through' : 'text-white'
                              }`}
                            >
                              {ep.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0 tabular-nums">
                            {ep.runtime}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>
          )}

          {/* Notes */}
          <div className="pt-2 border-t border-white/[0.07]">
            {!showNotes ? (
              <button
                type="button"
                onClick={() => setShowNotes(true)}
                className="ui-dim ui-focus text-xs text-slate-300 hover:text-white py-1"
              >
                {personalNotesInput ? 'Edit personal notes' : '+ Add personal notes'}
              </button>
            ) : (
              <div className="space-y-2.5 pt-1">
                <label htmlFor="details-notes" className="sr-only">
                  Personal notes
                </label>
                <textarea
                  id="details-notes"
                  rows={3}
                  placeholder="Write timeline theories or rewatch notes..."
                  value={personalNotesInput}
                  onChange={(e) => setPersonalNotesInput(e.target.value)}
                  className="ui-field w-full bg-[#090a0f] border border-white/14 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 resize-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNotes(false)}
                    className="ui-press ui-press--on-dark ui-focus h-8 px-3 rounded-lg text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="ui-press ui-focus h-8 px-3.5 rounded-lg text-xs font-semibold bg-white text-doom-950"
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
