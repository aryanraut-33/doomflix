import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
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

  if (!isOpen || !title) return null;

  const handleSave = () => {
    updatePersonalNotes(title.id, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-doom-900 border border-doom-border rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-doom-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-doom-red/20 text-doom-red border border-doom-red/40 flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-gold font-bold">
              Operative Debrief Notes
            </span>
            <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white truncate max-w-sm">
              {title.title}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-sans">
            Record personal theories, timeline connections, or viewing thoughts for this title.
          </p>

          <textarea
            rows={6}
            placeholder="e.g. Note the mid-credits scene with Clea; compare the Darkhold spells to WandaVision..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-doom-950 border border-doom-border rounded-xl p-3.5 text-sm text-gray-100 focus:outline-none focus:border-doom-red transition-colors resize-none leading-relaxed"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-doom-red hover:bg-doom-red-bright text-white px-5 py-2 rounded-lg text-xs font-bold transition-[background-color,transform] duration-150 ease-out active:scale-[0.96] shadow-sm flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Save Operative Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
