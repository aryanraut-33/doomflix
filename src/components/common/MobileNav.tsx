import React from 'react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home' },
  { id: 'watchlist', label: 'My List' },
  { id: 'discover', label: 'Discover' },
  { id: 'quiz', label: 'Quiz' },
];

/* Phosphor Icon Geometries (256x256 scaled to 20x20) */
const PhosphorIcons: Record<string, { regular: React.ReactNode; fill: React.ReactNode }> = {
  home: {
    regular: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M213.66,101.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,112v96a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V112A8,8,0,0,0,213.66,101.66Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
        <path d="M218.83,103.77l-80-75.48a16,16,0,0,0-21.66,0l-80,75.48A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
      </svg>
    )
  },
  watchlist: {
    regular: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    )
  },
  discover: {
    regular: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="128" r="96" />
        <polygon points="176 80 144 144 80 176 112 112 176 80" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,58.34-16,64a8,8,0,0,1-5.68,5.68l-64,16a8,8,0,0,1-9.66-9.66l16-64a8,8,0,0,1,5.68-5.68l64-16a8,8,0,0,1,9.66,9.66Z" />
      </svg>
    )
  },
  quiz: {
    regular: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="128" r="96" />
        <circle cx="128" cy="180" r="10" fill="currentColor" stroke="none" />
        <path d="M128,144v-8a24,24,0,0,1,24-24,20,20,0,1,0-28-18.32" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm16,152a12,12,0,1,1-12-12A12,12,0,0,1,144,176Zm8-76c0,10.22-8.52,18.73-16,21.78V128a8,8,0,0,1-16,0v-8a8,8,0,0,1,8-8c8.82,0,16-5.38,16-12s-7.18-12-16-12-16,5.38-16,12a8,8,0,0,1-16,0c0-15.44,14.36-28,32-28S152,84.56,152,100Z" />
      </svg>
    )
  }
};

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center rounded-full p-1.5 bg-[#12161f]/92 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.15)] transition-all"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentTab === item.id;
        const iconConfig = PhosphorIcons[item.id];

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center transition-all duration-200 select-none ${
              isActive
                ? 'bg-zinc-900 border border-emerald-500/40 text-white rounded-full px-4 sm:px-5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.6),0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-gray-400 hover:text-white px-3.5 sm:px-4 py-1.5 rounded-full'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {isActive ? iconConfig?.fill : iconConfig?.regular}
            </div>
            <span className={`text-[10px] sm:text-[11px] font-sans mt-0.5 tracking-tight ${isActive ? 'font-semibold text-white' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
