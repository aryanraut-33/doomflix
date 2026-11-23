import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../services/store';

export const DoomsdayCountdown: React.FC<{ variant?: 'hero' | 'compact' | 'header' }> = ({ variant = 'hero' }) => {
  const { doomsdayDate, setDoomsdayDate } = useAppStore();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isPast: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [inputDate, setInputDate] = useState(doomsdayDate.split('T')[0]);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(doomsdayDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [doomsdayDate]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputDate) {
      setDoomsdayDate(`${inputDate}T00:00:00`);
      setIsEditing(false);
    }
  };

  // Header compact pill
  if (variant === 'header') {
    return (
      <div className="flex items-center gap-2 bg-doom-900 border border-doom-border hover:border-doom-red/50 transition-colors px-3 py-1.5 rounded-md text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-doom-red animate-pulse" />
        <span className="text-gray-400 font-sans uppercase tracking-wider text-[10px]">Doomsday:</span>
        <span className="text-white font-semibold">
          {timeLeft.isPast ? 'IN THEATRES' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
        </span>
      </div>
    );
  }

  // Compact card variant
  if (variant === 'compact') {
    return (
      <div className="metallic-card p-4 rounded-xl border border-doom-border relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-doom-red animate-ping" />
            <span className="text-xs uppercase font-marvel tracking-wider text-doom-red font-bold">
              Avengers: Doomsday Countdown
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
            title="Configure release date"
          >
            <Edit2 size={12} />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveDate} className="flex gap-2">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="bg-doom-950 border border-doom-border rounded px-2 py-1 text-xs text-white"
            />
            <button type="submit" className="bg-doom-red text-white px-2 py-1 rounded text-xs">
              <Check size={12} />
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { val: timeLeft.days, label: 'DAYS' },
              { val: timeLeft.hours, label: 'HOURS' },
              { val: timeLeft.minutes, label: 'MINS' },
              { val: timeLeft.seconds, label: 'SECS' },
            ].map((unit, idx) => (
              <div key={idx} className="bg-doom-950/80 p-2 rounded border border-white/5">
                <div className="font-cinematic text-2xl text-white tracking-wider font-bold">
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div className="text-[9px] text-gray-400 tracking-wider font-mono">{unit.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Hero Full Display Variant
  return (
    <div className="relative group">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-doom-900/90 via-doom-850/95 to-doom-900/90 border border-doom-red/30 p-6 md:p-8 rounded-2xl shadow-glow-red backdrop-blur-md">
        {/* Left Side Info */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="marvel-badge px-2.5 py-0.5 text-xs rounded-sm shadow-md">
              OFFICIAL COUNTDOWN
            </span>
            <span className="text-doom-gold text-xs font-mono uppercase tracking-widest flex items-center gap-1">
              <Clock size={12} /> Phase Six Nexus
            </span>
          </div>

          <h2 className="font-cinematic text-3xl md:text-5xl text-white tracking-wider uppercase text-glow-red">
            Avengers: Doomsday
          </h2>

          <p className="text-gray-400 text-xs md:text-sm max-w-md font-sans">
            Victor Von Doom rises across colliding realities. Track and complete your preparation sequence before the Multiverse collapses.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-1 text-xs text-gray-400">
            <Calendar size={13} className="text-doom-red" />
            <span>Target Release: <strong className="text-white">{new Date(doomsdayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-doom-gold ml-2 underline flex items-center gap-1 transition-colors"
              title="Change release date"
            >
              <Edit2 size={11} /> Config Date
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSaveDate} className="flex items-center gap-2 pt-2">
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="bg-doom-950 border border-doom-red/50 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-doom-red"
              />
              <button
                type="submit"
                className="bg-doom-red hover:bg-doom-red-bright text-white text-xs px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1"
              >
                <Check size={12} /> Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-400 hover:text-white px-2"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Right Side Digital Grid HUD */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 w-full md:w-auto">
          {[
            { val: timeLeft.days, label: 'DAYS' },
            { val: timeLeft.hours, label: 'HOURS' },
            { val: timeLeft.minutes, label: 'MINUTES' },
            { val: timeLeft.seconds, label: 'SECONDS' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-center bg-doom-950/90 border border-doom-border hover:border-doom-red/50 transition-all p-3 md:p-4 rounded-xl min-w-[65px] md:min-w-[85px] shadow-inner"
            >
              <div className="font-cinematic text-3xl md:text-5xl font-black text-white tracking-widest">
                {String(item.val).padStart(2, '0')}
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 font-mono tracking-widest mt-1">
                {item.label}
              </div>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-doom-red/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
