import React, { useState } from 'react';
import { X, Layers, Plus, Check } from 'lucide-react';
import { useAppStore } from '../../services/store';
import { MarvelTitle } from '../../data/marvelCatalogue';

interface MoveCollectionModalProps {
  title: MarvelTitle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MoveCollectionModal: React.FC<MoveCollectionModalProps> = ({ title, isOpen, onClose }) => {
  const { collections, addTitleToCollection } = useAppStore();
  const [selectedColId, setSelectedColId] = useState(collections[0]?.id || '');
  const [priority, setPriority] = useState<'essential' | 'optional'>('essential');
  const [message, setMessage] = useState('');

  if (!isOpen || !title) return null;

  const handleAdd = () => {
    const success = addTitleToCollection(selectedColId, title.id, priority);
    if (!success) {
      setMessage('This title is already present in that collection.');
    } else {
      setMessage('Added successfully!');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 800);
    }
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-doom-red/20 text-doom-red border border-doom-red/40 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-red font-bold">
              Add to Collection
            </span>
            <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white truncate max-w-xs">
              {title.title}
            </h3>
          </div>
        </div>

        {message && (
          <div className="mb-3 p-2.5 rounded-lg text-xs bg-doom-950 border border-doom-gold text-doom-gold">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Select Destination Collection</label>
            <select
              value={selectedColId}
              onChange={(e) => setSelectedColId(e.target.value)}
              className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors"
            >
              {collections.map(col => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.items.length} titles)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Priority Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPriority('essential')}
                className={`py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all ${
                  priority === 'essential'
                    ? 'bg-doom-red text-white border-doom-red shadow-glow-red'
                    : 'bg-doom-950 text-gray-400 border-doom-border hover:text-white'
                }`}
              >
                Essential
              </button>
              <button
                type="button"
                onClick={() => setPriority('optional')}
                className={`py-2 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all ${
                  priority === 'optional'
                    ? 'bg-doom-gold text-doom-950 border-doom-gold shadow-glow-gold'
                    : 'bg-doom-950 text-gray-400 border-doom-border hover:text-white'
                }`}
              >
                Optional
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="bg-doom-red hover:bg-doom-red-bright text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-glow-red flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Title</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
