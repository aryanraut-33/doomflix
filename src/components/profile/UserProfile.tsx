import React, { useState } from 'react';
import { 
  Award, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  Layers, 
  Sliders, 
  UserCheck, 
  Check, 
  Database,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ACHIEVEMENTS, Achievement } from '../../data/achievements';
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
    doomsdayDate,
    setDoomsdayDate
  } = useAppStore();

  const [inputDate, setInputDate] = useState(doomsdayDate.split('T')[0]);
  const [dateSaved, setDateSaved] = useState(false);
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

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputDate) {
      setDoomsdayDate(`${inputDate}T00:00:00`);
      setDateSaved(true);
      setTimeout(() => setDateSaved(false), 2000);
    }
  };

  const handleManualSync = async () => {
    setSyncLoading(true);
    setSyncMessage('');
    const res = await migrateGuestData();
    setSyncMessage(res.message || 'Data synchronized successfully with your cloud account!');
    setSyncLoading(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
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
            {user.isGuest ? (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Database size={14} />
                <span>Sign in / Sync Progress</span>
              </button>
            ) : (
              <button
                onClick={handleManualSync}
                disabled={syncLoading}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} className={syncLoading ? 'animate-spin' : ''} />
                <span>Sync Progress</span>
              </button>
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
      <div className="doom-metallic-card rounded-3xl p-6 md:p-8 border border-border space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-doom-border/80 pb-4">
          <div>
            <h3 className="font-cinematic text-3xl uppercase tracking-wider text-white flex items-center gap-2">
              <Award size={24} className="text-doom-gold" />
              <span>Operative Badges & Achievements</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Original emblems unlocked through confirmed movie-watching, series completion, and Knowledge Arena battles.
            </p>
          </div>
          <div className="text-xs font-mono text-doom-gold font-bold">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = isAchievementUnlocked(ach.id);
            const unlockedDate = getUnlockedDate(ach.id);

            let borderGlow = 'border-doom-border/60 bg-doom-950/40 text-gray-500';
            if (unlocked) {
              if (ach.badgeColor === 'red') borderGlow = 'border-doom-red bg-doom-950 shadow-sm text-doom-red';
              else if (ach.badgeColor === 'gold') borderGlow = 'border-doom-gold bg-doom-950 shadow-sm text-doom-gold';
              else if (ach.badgeColor === 'emerald') borderGlow = 'border-doom-emerald bg-doom-950 shadow-sm text-doom-emerald';
              else if (ach.badgeColor === 'blue') borderGlow = 'border-doom-blue bg-doom-950 shadow-sm text-doom-blue';
              else borderGlow = 'border-doom-gold bg-doom-950 text-doom-gold';
            }

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${borderGlow}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  unlocked
                    ? 'bg-doom-900 border-current shadow-md'
                    : 'bg-doom-950 border-doom-border text-gray-600'
                }`}>
                  {unlocked ? <Award size={24} /> : <Lock size={20} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`font-marvel text-base font-bold tracking-wide truncate ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {ach.name}
                    </h4>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-doom-900 border border-white/5">
                      {ach.rarity}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans line-clamp-2 mt-0.5">
                    {ach.description}
                  </p>

                  <div className="text-[10px] font-mono mt-2">
                    {unlocked ? (
                      <span className="text-doom-emerald">Unlocked on {unlockedDate}</span>
                    ) : (
                      <span className="text-gray-600">Locked • {ach.unlockCondition}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Knowledge Arena History & Diagnostics */}
      <div className="metallic-card rounded-3xl p-6 md:p-8 border border-doom-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white flex items-center gap-2">
            <HelpCircle size={20} className="text-doom-gold" />
            <span>Lore Battle Diagnostics</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {totalQuizzes} Attempt{totalQuizzes === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-doom-950 p-4 rounded-xl border border-doom-border text-center">
            <div className="text-xs text-gray-400 font-mono">Average Accuracy</div>
            <div className="font-cinematic text-3xl text-white font-bold tracking-wider mt-1">
              {avgAccuracy}%
            </div>
          </div>

          <div className="bg-doom-950 p-4 rounded-xl border border-doom-border text-center">
            <div className="text-xs text-gray-400 font-mono">Highest Score</div>
            <div className="font-cinematic text-3xl text-doom-gold font-bold tracking-wider mt-1">
              {bestScore}%
            </div>
          </div>

          <div className="bg-doom-950 p-4 rounded-xl border border-doom-border text-center">
            <div className="text-xs text-gray-400 font-mono">Operative Lore Tier</div>
            <div className="font-cinematic text-3xl text-doom-red font-bold tracking-wider mt-1">
              {avgAccuracy >= 80 ? 'NEXUS MASTER' : avgAccuracy >= 50 ? 'FIELD AGENT' : 'RECRUIT'}
            </div>
          </div>
        </div>

        {quizAttempts.length > 0 && quizAttempts[0].weakTopics.length > 0 && (
          <div className="p-3 bg-doom-950 rounded-xl border border-doom-border text-xs text-gray-300">
            <span className="text-doom-gold font-bold">Priority Review Areas: </span>
            {quizAttempts[0].weakTopics.join(', ')}
          </div>
        )}
      </div>

      {/* 5. Platform Settings & Doomsday Configurator */}
      <div className="doom-metallic-card rounded-3xl p-6 md:p-8 border border-border space-y-6 shadow-card">
        <h3 className="font-cinematic text-2xl uppercase tracking-wider text-white flex items-center gap-2">
          <Sliders size={20} className="text-doom-emerald" />
          <span>Platform Settings & Timeline Target</span>
        </h3>

        {/* Configurable Avengers: Doomsday Release Date */}
        <form onSubmit={handleSaveDate} className="space-y-3 bg-doom-950 p-5 rounded-2xl border border-border">
          <div>
            <label className="block text-xs font-marvel uppercase tracking-wider text-gray-300 font-bold mb-1">
              Avengers: Doomsday Release Countdown Target
            </label>
            <p className="text-xs text-gray-400 font-sans mb-3">
              Per product specification, Doomflix allows configuring the target release date rather than hardcoding an unverified date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="bg-doom-900 border border-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-doom-emerald"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border border-doom-emerald/40"
            >
              <Check size={14} />
              <span>Save Release Date</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputDate('2026-12-18');
                setDoomsdayDate('2026-12-18T00:00:00');
              }}
              className="text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              Reset to Default (Dec 18, 2026)
            </button>

            {dateSaved && (
              <span className="text-xs text-doom-emerald font-mono">Target date updated!</span>
            )}
          </div>
        </form>

        {/* TMDB Integration Attribution & Info */}
        <div className="p-4 bg-doom-950/60 rounded-2xl border border-doom-border text-xs text-gray-400 font-sans space-y-2">
          <div className="flex items-center gap-2 font-marvel uppercase tracking-wider text-white font-bold">
            <Database size={14} className="text-doom-red" />
            <span>TMDB Attribution & Infrastructure</span>
          </div>
          <p>
            Movie and TV series metadata, high-resolution official posters, and backdrop artwork are catalogued via The Movie Database (TMDB). This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </div>
  );
};
