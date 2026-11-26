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
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-full bg-[#10141d] border border-emerald-500/35 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.8)] animate-slide-in-up select-none"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <Award size={18} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-emerald-400">
              Badge Unlocked
            </span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss notification"
              className="ui-press ui-press--on-dark ui-focus w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center shrink-0"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>

          <h4 className="text-sm font-semibold text-white truncate mt-0.5">
            {achievement.name}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-snug">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
};
