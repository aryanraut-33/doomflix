import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '../../services/store';
import { MarvelTitle } from '../../data/marvelCatalogue';

interface MoveCollectionModalProps {
  title: MarvelTitle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MoveCollectionModal: React.FC<MoveCollectionModalProps> = ({
  title,
  isOpen,
  onClose,
}) => {
  const { collections, addTitleToCollection } = useAppStore();
  const [selectedColId, setSelectedColId] = useState(collections[0]?.id || '');
  const [priority, setPriority] = useState<'essential' | 'optional'>('essential');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedColId(collections[0]?.id || '');
      setMessage('');
      setIsError(false);
    }
  }, [isOpen, collections]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !title) return null;

  const handleAdd = () => {
    const success = addTitleToCollection(selectedColId, title.id, priority);
    if (!success) {
      setIsError(true);
      setMessage('Already in that collection.');
    } else {
      setIsError(false);
      setMessage('Added to collection.');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 650);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-modal-title"
        className="ui-dialog-enter relative w-full max-w-md bg-[#101319] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="move-modal-title" className="text-lg font-semibold text-white truncate">
              Add to Collection · {title.title}
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

        {message && (
          <div
            role={isError ? 'alert' : 'status'}
            className={`p-3 rounded-xl text-xs border ${
              isError
                ? 'bg-amber-500/10 border-amber-500/35 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/35 text-emerald-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="dest-collection" className="block text-xs font-medium text-slate-300 mb-1.5">
              Destination Collection
            </label>
            <select
              id="dest-collection"
              value={selectedColId}
              onChange={(e) => setSelectedColId(e.target.value)}
              className="doom-select ui-field w-full h-10 bg-[#090a0f] border border-white/14 rounded-xl px-3.5 text-sm text-white"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.items.length} titles)
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300 mb-1.5">Priority</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority('essential')}
                aria-pressed={priority === 'essential'}
                className={`ui-press ui-press--on-dark ui-focus h-9 rounded-xl text-xs font-semibold border ${
                  priority === 'essential'
                    ? 'bg-emerald-500 text-doom-950 border-emerald-400'
                    : 'bg-[#090a0f] text-slate-300 border-white/14 hover:text-white'
                }`}
              >
                Essential
              </button>
              <button
                type="button"
                onClick={() => setPriority('optional')}
                aria-pressed={priority === 'optional'}
                className={`ui-press ui-press--on-dark ui-focus h-9 rounded-xl text-xs font-semibold border ${
                  priority === 'optional'
                    ? 'bg-white text-doom-950 border-white'
                    : 'bg-[#090a0f] text-slate-300 border-white/14 hover:text-white'
                }`}
              >
                Optional
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="ui-press ui-press--on-dark ui-focus h-9 px-4 text-xs font-medium text-slate-300 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="ui-press ui-focus h-9 bg-white text-doom-950 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Add Title</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
