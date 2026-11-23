import React, { useState } from 'react';
import { X, FolderPlus, Edit3, Trash2 } from 'lucide-react';
import { useAppStore } from '../../services/store';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCollectionId?: string | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ 
  isOpen, 
  onClose, 
  editingCollectionId 
}) => {
  const { collections, createCollection, renameCollection } = useAppStore();
  const existingCol = editingCollectionId ? collections.find(c => c.id === editingCollectionId) : null;

  const [name, setName] = useState(existingCol?.name || '');
  const [description, setDescription] = useState(existingCol?.description || '');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-doom-900 border border-doom-border rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-doom-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-doom-gold/20 text-doom-gold border border-doom-gold/40 flex items-center justify-center">
            {existingCol ? <Edit3 size={20} /> : <FolderPlus size={20} />}
          </div>
          <div>
            <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white">
              {existingCol ? 'Edit Collection' : 'Create Custom Collection'}
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Organise movies and series into curated watchlists.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Collection Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Road to Secret Wars, Mutant Saga..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Describe the viewing purpose or theme of this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-doom-red hover:bg-doom-red-bright text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              {existingCol ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
