import React from 'react';
import { Search, Bell, Shield, LogIn, Sliders, Menu, X } from 'lucide-react';
import { DoomsdayCountdown } from './DoomsdayCountdown';
import { useAppStore } from '../../services/store';
import { NavTab } from './Sidebar';

interface HeaderProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSelectTab, 
  onOpenAuth, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const { user } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-doom-950/85 backdrop-blur-md border-b border-doom-border/80 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Brand & Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-doom-900 border border-doom-border text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div 
          onClick={() => onSelectTab('home')}
          className="lg:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-doom-red flex items-center justify-center font-cinematic font-black text-lg text-white">
            D
          </div>
          <span className="font-cinematic text-xl text-white tracking-wider">DOOMFLIX</span>
        </div>

        {/* Global Quick Search Button */}
        <button
          onClick={() => onSelectTab('discover')}
          className="hidden sm:flex items-center gap-2 bg-doom-900/90 border border-doom-border hover:border-doom-border-light text-gray-400 hover:text-gray-200 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all w-56 md:w-72"
        >
          <Search size={14} className="text-gray-400" />
          <span className="truncate">Search movies, series, characters...</span>
          <kbd className="hidden md:inline-block ml-auto text-[9px] bg-doom-800 text-gray-400 px-1.5 py-0.5 rounded border border-white/5 font-mono">
            /
          </kbd>
        </button>
      </div>

      {/* Right: Doomsday Countdown Pill & User Profile Trigger */}
      <div className="flex items-center gap-3">
        {/* Doomsday countdown header pill */}
        <div className="hidden md:block">
          <DoomsdayCountdown variant="header" />
        </div>

        {/* Account / Sync Status Pill */}
        {user.isGuest ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-doom-red hover:bg-doom-red-bright text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all"
          >
            <LogIn size={13} />
            <span>Sign In / Sync</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-doom-900 hover:bg-doom-850 border border-doom-border px-3 py-1.5 rounded-md text-xs text-white transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-doom-red flex items-center justify-center text-[10px] font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium hidden sm:inline">{user.username}</span>
            <Sliders size={12} className="text-gray-400" />
          </button>
        )}
      </div>
    </header>
  );
};
