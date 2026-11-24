import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Film, 
  Tv, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  Layers, 
  Database,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/achievements';
import { useAppStore } from '../../services/store';

interface UserProfileProps {
  onOpenAuth: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenAuth }) => {
  const { 
    user, 
    overallStats, 
    unlockedAchievements, 
    quizAttempts, 
    collections,
    migrateGuestData,
    logout
  } = useAppStore();

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const isAchievementUnlocked = (id: string) => {
    return unlockedAchievements.some(a => a.achievementId === id);
  };

  const getUnlockedDate = (id: string) => {
    const found = unlockedAchievements.find(a => a.achievementId === id);
    if (!found) return null;
    return new Date(found.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Quiz Stats
  const totalQuizzes = quizAttempts.length;
  const avgAccuracy = totalQuizzes > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0
    ? Math.max(...quizAttempts.map(q => q.percentage))
    : 0;

  const handleManualSync = async () => {
    setSyncLoading(true);
    setSyncMessage('');
    const res = await migrateGuestData();
    setSyncMessage(res.message || 'Data synchronized successfully with your cloud account!');
    setSyncLoading(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* 1. Profile Header Card */}
      <div className="doom-glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white font-cinematic font-black text-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/20">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinematic text-2xl md:text-3xl text-white uppercase tracking-wider">
                  {user.username}
                </h2>
                {user.isGuest ? (
                  <span className="text-[10px] bg-white/10 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full font-mono">
                    Guest Account
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <CheckCircle2 size={10} /> Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {user.isGuest ? 'Local browser storage active' : user.email}
              </p>
            </div>
          </div>

          {/* Account Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {!user.isGuest ? (
              <>
                <button
                  onClick={handleManualSync}
                  disabled={syncLoading}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCw size={13} className={syncLoading ? 'animate-spin' : ''} />
                  <span>Sync Progress</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  title="Sign out of your account"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <Database size={14} />
                  <span>Sign in / Sync Progress</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  title="Reset session"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {syncMessage && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-sans">
            {syncMessage}
          </div>
        )}
      </div>

      {/* 2. Overall Tracking Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="doom-metallic-card p-5 rounded-2xl border border-border space-y-1 shadow-card">
          <div className="text-gray-400 text-xs font-marvel uppercase tracking-wider flex items-center justify-between">
            <span>Overall Progress</span>
            <Sparkles size={14} className="text-doom-emerald" />
          </div>
          <div className="font-cinematic text-4xl text-white font-black tracking-wider">
            {overallStats.completionPercentage}%
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {overallStats.completedCount} of {overallStats.totalTitles} titles watched
          </div>
        </div>

        <div className="doom-metallic-card p-5 rounded-2xl border border-border space-y-1 shadow-card">
          <div className="text-gray-400 text-xs font-marvel uppercase tracking-wider flex items-center justify-between">
            <span>Movies Tracked</span>
            <Film size={14} className="text-doom-emerald" />
          </div>
          <div className="font-cinematic text-4xl text-white font-black tracking-wider">
            {overallStats.moviesWatched}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Feature-length films
          </div>
        </div>

        <div className="doom-metallic-card p-5 rounded-2xl border border-border space-y-1 shadow-card">
          <div className="text-gray-400 text-xs font-marvel uppercase tracking-wider flex items-center justify-between">
            <span>Series Complete</span>
            <Tv size={14} className="text-doom-emerald" />
          </div>
          <div className="font-cinematic text-4xl text-white font-black tracking-wider">
            {overallStats.seriesCompleted}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Loki & Multiverse TV
          </div>
        </div>

        <div className="doom-metallic-card p-5 rounded-2xl border border-border space-y-1 shadow-card">
          <div className="text-gray-400 text-xs font-marvel uppercase tracking-wider flex items-center justify-between">
            <span>Collections</span>
            <Layers size={14} className="text-doom-gold" />
          </div>
          <div className="font-cinematic text-4xl text-white font-black tracking-wider">
            {collections.length}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            Active curated lists
          </div>
        </div>
      </div>

      {/* 3. Original Achievement Badges Gallery */}
      <div className="doom-metallic-card rounded-2xl p-4 sm:p-6 border border-border space-y-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Award size={22} className="text-emerald-400" />
              <span>Operative Badges & Achievements</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Original emblems unlocked through confirmed movie-watching, series completion, and Knowledge Arena battles.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-semibold shrink-0">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </div>
        </div>

        {/* Responsive Grid: 2-3 Badges per row on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = isAchievementUnlocked(ach.id);
            const unlockedDate = getUnlockedDate(ach.id);

            let borderGlow = 'border-white/5 bg-white/[0.02] text-gray-500';
            if (unlocked) {
              if (ach.badgeColor === 'red') borderGlow = 'border-rose-500/30 bg-rose-950/20 text-rose-400 shadow-sm';
              else if (ach.badgeColor === 'gold') borderGlow = 'border-amber-500/30 bg-amber-950/20 text-amber-400 shadow-sm';
              else if (ach.badgeColor === 'emerald') borderGlow = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 shadow-sm';
              else if (ach.badgeColor === 'blue') borderGlow = 'border-sky-500/30 bg-sky-950/20 text-sky-400 shadow-sm';
              else borderGlow = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
            }

            return (
              <div
                key={ach.id}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col justify-between ${borderGlow}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      unlocked
                        ? 'bg-black/50 border-current shadow'
                        : 'bg-black/30 border-white/10 text-gray-600'
                    }`}>
                      {unlocked ? <Award size={18} /> : <Lock size={15} />}
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/50 border border-white/5 text-gray-400">
                      {ach.rarity}
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-semibold tracking-wide truncate ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {ach.name}
                  </h4>

                  <p className="text-[10px] sm:text-[11px] text-gray-400 font-sans line-clamp-2 mt-1 leading-tight">
                    {ach.description}
                  </p>
                </div>

                <div className="text-[9px] sm:text-[10px] font-mono mt-2.5 pt-1.5 border-t border-white/5 truncate">
                  {unlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      <span className="truncate">{unlockedDate}</span>
                    </span>
                  ) : (
                    <span className="text-gray-600 truncate block" title={ach.unlockCondition}>
                      {ach.unlockCondition}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Lore Battle Diagnostics (Minimal & Compact) */}
      <div className="doom-metallic-card rounded-2xl p-4 sm:p-5 border border-border space-y-3 shadow-card">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-amber-400/90" />
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
              Lore Battle Diagnostics
            </h3>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            {totalQuizzes} Attempt{totalQuizzes === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center">
            <div className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider truncate">
              Avg Accuracy
            </div>
            <div className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {avgAccuracy}%
            </div>
          </div>

          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center">
            <div className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider truncate">
              Top Score
            </div>
            <div className="text-lg sm:text-2xl font-bold text-amber-400 tracking-tight mt-0.5">
              {bestScore}%
            </div>
          </div>

          <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center">
            <div className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider truncate">
              Lore Tier
            </div>
            <div className="text-[10.5px] sm:text-sm font-bold text-rose-400 tracking-normal uppercase mt-1 truncate">
              {avgAccuracy >= 80 ? 'NEXUS MASTER' : avgAccuracy >= 50 ? 'FIELD AGENT' : 'RECRUIT'}
            </div>
          </div>
        </div>

        {quizAttempts.length > 0 && quizAttempts[0].weakTopics.length > 0 && (
          <div className="px-3 py-2 bg-white/[0.02] rounded-xl border border-white/5 text-[11px] sm:text-xs text-gray-300 flex items-center gap-1.5 flex-wrap">
            <span className="text-amber-400/90 font-medium">Priority Review:</span>
            <span className="text-gray-300">{quizAttempts[0].weakTopics.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
