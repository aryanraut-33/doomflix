import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  RefreshCw,
  Lock,
  Database,
  HelpCircle,
  LogOut,
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
    logout,
  } = useAppStore();

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const isAchievementUnlocked = (id: string) =>
    unlockedAchievements.some((a) => a.achievementId === id);

  const getUnlockedDate = (id: string) => {
    const found = unlockedAchievements.find((a) => a.achievementId === id);
    if (!found) return null;
    return new Date(found.unlockedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalQuizzes = quizAttempts.length;
  const avgAccuracy =
    totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes)
      : 0;
  const bestScore =
    totalQuizzes > 0 ? Math.max(...quizAttempts.map((q) => q.percentage)) : 0;

  const handleManualSync = async () => {
    setSyncLoading(true);
    setSyncMessage('');
    const res = await migrateGuestData();
    setSyncMessage(res.message || 'Progress synchronized with your account.');
    setSyncLoading(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* 1. Operative Identity Header */}
      <section className="bg-[#0f131b] rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-cinematic font-bold text-2xl shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-cinematic text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none">
                  {user.username}
                </h1>
                {user.isGuest ? (
                  <span className="text-[11px] bg-white/[0.06] text-slate-300 border border-white/12 px-2.5 py-0.5 rounded-full font-mono whitespace-nowrap shrink-0">
                    Guest Account
                  </span>
                ) : (
                  <span className="text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 px-2.5 py-0.5 rounded-full font-mono inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                    <CheckCircle2 size={11} aria-hidden="true" />
                    <span>Synced</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {user.isGuest ? 'Saved locally in this browser' : user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!user.isGuest ? (
              <>
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={syncLoading}
                  className="ui-press ui-press--on-dark ui-focus h-9 px-4 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] border border-white/14 text-white inline-flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <RefreshCw size={13} className={syncLoading ? 'animate-spin' : ''} aria-hidden="true" />
                  <span>{syncLoading ? 'Syncing...' : 'Sync Progress'}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="ui-press ui-press--on-dark ui-focus h-9 px-4 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <LogOut size={13} aria-hidden="true" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="ui-press ui-focus h-9 px-4 rounded-xl text-xs font-semibold bg-white text-doom-950 inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Database size={14} aria-hidden="true" />
                  <span>Sign in / Sync Progress</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="ui-press ui-press--on-dark ui-focus h-9 px-3.5 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/12 text-slate-300 hover:text-white inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  title="Reset session"
                >
                  <LogOut size={13} aria-hidden="true" />
                  <span>Reset Guest</span>
                </button>
              </>
            )}
          </div>
        </div>

        {syncMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs"
          >
            {syncMessage}
          </div>
        )}
      </section>

      {/* 2. Doomsday Readiness Bar + Keylined Ledger (Replaces 4-Card Admin Grid) */}
      <section className="bg-[#0f131b] rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Primary Readiness Progress */}
          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-slate-400">
                Doomsday Watchlist Completion
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-300">
                {overallStats.completedCount} / {overallStats.totalTitles} titles
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-cinematic text-4xl sm:text-5xl text-white leading-none tabular-nums">
                {overallStats.completionPercentage}%
              </span>
              <div className="flex-1 bg-white/[0.08] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${overallStats.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Divided Ledger Metrics */}
          <div className="lg:col-span-6 grid grid-cols-3 divide-x divide-white/10 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
            <div className="pr-3 flex flex-col gap-1">
              <div className="text-xs text-slate-400">Movies</div>
              <div className="font-cinematic text-3xl text-white leading-none tabular-nums">
                {overallStats.moviesWatched}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Watched</div>
            </div>

            <div className="px-3 flex flex-col gap-1">
              <div className="text-xs text-slate-400">Series</div>
              <div className="font-cinematic text-3xl text-white leading-none tabular-nums">
                {overallStats.seriesCompleted}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Completed</div>
            </div>

            <div className="pl-3 flex flex-col gap-1">
              <div className="text-xs text-slate-400">Watchlists</div>
              <div className="font-cinematic text-3xl text-white leading-none tabular-nums">
                {collections.length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Operative Badges & Achievements */}
      <section className="bg-[#0f131b] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
            <Award size={19} className="text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Operative Badges & Achievements</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-semibold tabular-nums shrink-0">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = isAchievementUnlocked(ach.id);
            const unlockedDate = getUnlockedDate(ach.id);

            let cardTone = 'border-white/[0.08] bg-white/[0.02] text-slate-400';
            if (unlocked) {
              if (ach.badgeColor === 'red')
                cardTone = 'border-rose-500/35 bg-rose-500/10 text-rose-300';
              else if (ach.badgeColor === 'gold')
                cardTone = 'border-amber-500/35 bg-amber-500/10 text-amber-300';
              else if (ach.badgeColor === 'blue')
                cardTone = 'border-sky-500/35 bg-sky-500/10 text-sky-300';
              else
                cardTone = 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300';
            }

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${cardTone}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        unlocked
                          ? 'bg-black/40 border-current'
                          : 'bg-black/30 border-white/10 text-slate-500'
                      }`}
                    >
                      {unlocked ? (
                        <Award size={16} aria-hidden="true" />
                      ) : (
                        <Lock size={14} aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-black/40 border border-white/[0.08] text-slate-300">
                      {ach.rarity}
                    </span>
                  </div>

                  <h3
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      unlocked ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {ach.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {ach.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono mt-3 pt-2 border-t border-white/[0.07] truncate">
                  {unlocked ? (
                    <span className="text-emerald-400 inline-flex items-center gap-1">
                      <CheckCircle2 size={11} aria-hidden="true" />
                      <span className="truncate">{unlockedDate}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 truncate block" title={ach.unlockCondition}>
                      {ach.unlockCondition}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Lore Battle Diagnostics */}
      <section className="bg-[#0f131b] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <HelpCircle size={17} className="text-amber-400 shrink-0" aria-hidden="true" />
            <span>Lore Battle Diagnostics</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {totalQuizzes} {totalQuizzes === 1 ? 'Attempt' : 'Attempts'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] text-center flex flex-col justify-center">
            <div className="text-[11px] text-slate-400 truncate">Avg Accuracy</div>
            <div className="text-xl sm:text-2xl font-bold text-white tabular-nums mt-1">
              {avgAccuracy}%
            </div>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] text-center flex flex-col justify-center">
            <div className="text-[11px] text-slate-400 truncate">Top Score</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 tabular-nums mt-1">
              {bestScore}%
            </div>
          </div>

          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] text-center flex flex-col justify-center">
            <div className="text-[11px] text-slate-400 truncate">Lore Tier</div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase mt-1.5 truncate">
              {avgAccuracy >= 80 ? 'Nexus Master' : avgAccuracy >= 50 ? 'Field Agent' : 'Recruit'}
            </div>
          </div>
        </div>

        {quizAttempts.length > 0 && quizAttempts[0].weakTopics.length > 0 && (
          <div className="px-3.5 py-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] text-xs text-slate-300 flex items-center gap-2 flex-wrap">
            <span className="text-amber-400 font-medium">Review Topics:</span>
            <span>{quizAttempts[0].weakTopics.join(', ')}</span>
          </div>
        )}
      </section>
    </div>
  );
};
