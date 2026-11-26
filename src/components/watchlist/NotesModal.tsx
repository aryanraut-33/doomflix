import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useAppStore } from '../../services/store';
import { MarvelTitle } from '../../data/marvelCatalogue';

interface NotesModalProps {
  title: MarvelTitle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ title, isOpen, onClose }) => {
  const { watchProgress, updatePersonalNotes } = useAppStore();
  const currentNotes = title ? watchProgress[title.id]?.personalNotes || '' : '';
  const [notes, setNotes] = useState(currentNotes);

  useEffect(() => {
    if (isOpen && title) {
      setNotes(watchProgress[title.id]?.personalNotes || '');
    }
  }, [isOpen, title, watchProgress]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !title) return null;

  const handleSave = () => {
    updatePersonalNotes(title.id, notes);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-modal-title"
        className="ui-dialog-enter relative w-full max-w-lg bg-[#101319] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="notes-modal-title" className="text-lg font-semibold text-white truncate">
              Notes · {title.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white flex items-center justify-center shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title-notes-input" className="sr-only">
              Personal notes for {title.title}
            </label>
            <textarea
              id="title-notes-input"
              rows={6}
              placeholder="Write timeline connections, mid-credits takeaways, or rewatch thoughts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="ui-field w-full bg-[#090a0f] border border-white/14 rounded-xl p-3.5 text-sm text-white placeholder:text-slate-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="ui-press ui-press--on-dark ui-focus h-9 px-4 text-xs font-medium text-slate-300 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="ui-press ui-focus h-9 bg-white text-doom-950 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Check size={14} aria-hidden="true" />
              <span>Save Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
