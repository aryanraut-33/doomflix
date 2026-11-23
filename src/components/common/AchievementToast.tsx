import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import { Achievement } from '../../data/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-sm w-full bg-doom-900 border-2 border-doom-gold rounded-xl p-4 shadow-glow-gold animate-bounce select-none">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-doom-gold to-doom-red flex items-center justify-center text-white shrink-0 shadow-md">
          <Award size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-marvel uppercase tracking-wider text-doom-gold font-bold">
              Achievement Unlocked!
            </span>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          </div>

          <h4 className="font-cinematic text-lg text-white tracking-wide truncate">
            {achievement.name}
          </h4>

          <p className="text-xs text-gray-300 line-clamp-2 mt-0.5 font-sans">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
};
