import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../services/store';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCollectionId?: string | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  editingCollectionId,
}) => {
  const { collections, createCollection, renameCollection } = useAppStore();
  const existingCol = editingCollectionId
    ? collections.find((c) => c.id === editingCollectionId)
    : null;

  const [name, setName] = useState(existingCol?.name || '');
  const [description, setDescription] = useState(existingCol?.description || '');

  useEffect(() => {
    if (isOpen) {
      setName(existingCol?.name || '');
      setDescription(existingCol?.description || '');
    }
  }, [isOpen, existingCol]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (existingCol) {
      renameCollection(existingCol.id, name.trim(), description.trim());
    } else {
      createCollection(name.trim(), description.trim());
    }
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
        aria-labelledby="collection-modal-title"
        className="ui-dialog-enter relative w-full max-w-md bg-[#101319] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="collection-modal-title" className="text-lg font-semibold text-white">
            {existingCol ? 'Rename Collection' : 'New Collection'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="collection-name" className="block text-xs font-medium text-slate-300 mb-1.5">
              Collection Name
            </label>
            <input
              id="collection-name"
              type="text"
              required
              placeholder="e.g. Mutant Saga Rewatch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ui-field w-full h-10 bg-[#090a0f] border border-white/14 rounded-xl px-3.5 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="collection-desc" className="block text-xs font-medium text-slate-300 mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="collection-desc"
              rows={3}
              placeholder="What belongs in this sequence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ui-field w-full bg-[#090a0f] border border-white/14 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 resize-none"
            />
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
              type="submit"
              className="ui-press ui-focus h-9 bg-white text-doom-950 px-5 rounded-lg text-xs font-semibold"
            >
              {existingCol ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
