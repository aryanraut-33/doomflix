import React from 'react';
import { Search, Bell, Shield, LogIn, Sliders, Menu, X } from 'lucide-react';
import { DoomsdayCountdown } from './DoomsdayCountdown';
import { useAppStore } from '../../services/store';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab,
  onSelectTab, 
  onOpenAuth, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) => {
  const { user } = useAppStore();

  const navLinks = [
    { id: 'home' as NavTab, label: 'Home' },
    { id: 'watchlist' as NavTab, label: 'Watchlist' },
    { id: 'discover' as NavTab, label: 'Discover' },
    { id: 'quiz' as NavTab, label: 'Knowledge Arena' },
    { id: 'multiverse' as NavTab, label: 'Multiverse' },
    { id: 'profile' as NavTab, label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 doom-glass-header px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Brand Logo & Navigation Links */}
      <div className="flex items-center gap-6 lg:gap-8">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-doom-900 border border-white/10 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-doom-emerald-dark via-doom-emerald to-teal-400 flex items-center justify-center font-cinematic font-black text-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform border border-emerald-400/40">
            D
          </div>
          <span className="font-cinematic text-2xl sm:text-3xl text-white tracking-wider font-black">
            DOOM<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">FLIX</span>
          </span>
        </div>

        {/* Desktop Sticky Header Navbar */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-doom-emerald-dark via-doom-emerald to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] font-bold border border-emerald-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, Doomsday Target Pill, Account */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search Button */}
        <button
          onClick={() => onSelectTab('discover')}
          className="hidden sm:flex items-center gap-2 doom-glass-card hover:border-emerald-500/40 text-gray-400 hover:text-gray-200 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all w-48 md:w-60"
        >
          <Search size={14} className="text-gray-400" />
          <span className="truncate">Search movies, series...</span>
          <kbd className="hidden md:inline-block ml-auto text-[9px] bg-doom-950/80 text-gray-400 px-1.5 py-0.5 rounded border border-white/10 font-mono">
            /
          </kbd>
        </button>

        {/* Doomsday countdown header pill */}
        <div className="hidden xl:block">
          <DoomsdayCountdown variant="header" />
        </div>

        {/* Account / Sync Status Pill */}
        {user.isGuest ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-gradient-to-r from-doom-emerald-dark to-doom-emerald hover:brightness-110 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all border border-doom-emerald/40 hover:scale-[1.02]"
          >
            <LogIn size={13} />
            <span>Sign In / Sync</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 doom-glass-card hover:border-doom-emerald/50 px-3 py-1.5 rounded-xl text-xs text-white transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-doom-emerald-dark to-doom-emerald flex items-center justify-center text-[10px] font-bold shadow-sm">
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
