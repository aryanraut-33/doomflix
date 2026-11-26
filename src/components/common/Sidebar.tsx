import React, { useState, useRef, useEffect } from 'react';

export type NavTab = 'home' | 'watchlist' | 'discover' | 'quiz' | 'profile' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth?: () => void;
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
  { id: 'profile', label: 'Profile' },
];

const PhosphorIcons: Record<string, { regular: React.ReactNode; fill: React.ReactNode }> = {
  home: {
    regular: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" aria-hidden="true">
        <path d="M213.66,101.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,112v96a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V112A8,8,0,0,0,213.66,101.66Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M218.83,103.77l-80-75.48a16,16,0,0,0-21.66,0l-80,75.48A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
      </svg>
    ),
  },
  watchlist: {
    regular: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" aria-hidden="true">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    ),
  },
  discover: {
    regular: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" aria-hidden="true">
        <circle cx="128" cy="128" r="96" />
        <polygon points="176 80 144 144 80 176 112 112 176 80" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,58.34-16,64a8,8,0,0,1-5.68,5.68l-64,16a8,8,0,0,1-9.66-9.66l16-64a8,8,0,0,1,5.68-5.68l64-16a8,8,0,0,1,9.66,9.66Z" />
      </svg>
    ),
  },
  quiz: {
    regular: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" aria-hidden="true">
        <circle cx="128" cy="128" r="96" />
        <circle cx="128" cy="180" r="10" fill="currentColor" stroke="none" />
        <path d="M128,144v-8a24,24,0,0,1,24-24,20,20,0,1,0-28-18.32" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm16,152a12,12,0,1,1-12-12A12,12,0,0,1,144,176Zm8-76c0,10.22-8.52,18.73-16,21.78V128a8,8,0,0,1-16,0v-8a8,8,0,0,1,8-8c8.82,0,16-5.38,16-12s-7.18-12-16-12-16,5.38-16,12a8,8,0,0,1-16,0c0-15.44,14.36-28,32-28S152,84.56,152,100Z" />
      </svg>
    ),
  },
  profile: {
    regular: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" aria-hidden="true">
        <circle cx="128" cy="96" r="48" />
        <path d="M32,216a96,96,0,0,1,192,0" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
      </svg>
    ),
  },
};

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearLeaveTimer();
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
      setHoveredId(null);
    }, 120);
  };

  const handleFocus = () => {
    clearLeaveTimer();
    setIsExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) {
      clearLeaveTimer();
      leaveTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        setFocusedId(null);
      }, 120);
    }
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setHoveredId(null);
        setFocusedId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="hidden lg:block fixed top-0 left-0 h-screen select-none z-50 transition-[width] duration-250 ease-[cubic-bezier(0.2,0,0,1)]"
      style={{ width: isExpanded ? '248px' : '88px' }}
    >
      <div
        className="absolute top-0 left-0 h-full w-[88px] hotstar-nav-scrim-collapsed pointer-events-none z-0 transition-opacity duration-200 ease-out"
        style={{ opacity: isExpanded ? 0 : 1 }}
      />
      <div
        className="absolute top-0 left-0 h-full w-[320px] hotstar-nav-scrim-expanded pointer-events-none z-0 transition-opacity duration-200 ease-out"
        style={{ opacity: isExpanded ? 1 : 0 }}
      />

      {/* Restrained Crest Mark */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('home');
        }}
        className="ui-press ui-press--on-dark ui-focus absolute top-[32px] left-[24px] w-[40px] h-[40px] rounded-[10px] z-20 flex items-center justify-center overflow-visible"
        aria-label="Doomflix Home"
      >
        <img
          src="/assets/image.png"
          alt="Doomflix"
          className="doom-crest-mark w-[40px] h-[40px] object-cover"
        />
      </a>

      <div
        className="absolute left-[76px] top-[32px] h-[40px] flex items-center pointer-events-none overflow-hidden transition-[opacity,transform] duration-200 ease-out"
        style={{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateX(0px)' : 'translateX(-6px)',
        }}
      >
        <span className="font-cinematic text-2xl font-bold tracking-wider text-white whitespace-nowrap">
          DOOM<span className="text-emerald-400">FLIX</span>
        </span>
      </div>

      {/* Primary Nav Items */}
      <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center gap-2 z-10 px-4 pointer-events-auto">
        {NAV_ITEMS.map((item, index) => {
          const isActive = currentTab === item.id;
          const isHovered = hoveredId === item.id;
          const isFocused = focusedId === item.id;
          const isLit = isActive || isHovered || isFocused;

          const labelStyle: React.CSSProperties = isExpanded
            ? {
                opacity: 1,
                transform: 'translateX(0px)',
                transition: `opacity 180ms cubic-bezier(0.2,0,0,1) ${40 + index * 20}ms, transform 180ms cubic-bezier(0.2,0,0,1) ${40 + index * 20}ms`,
              }
            : {
                opacity: 0,
                transform: 'translateX(-6px)',
                transition: 'opacity 100ms cubic-bezier(0.2,0,0,1) 0ms',
              };

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectTab(item.id);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setFocusedId(item.id)}
              onBlur={() => setFocusedId(null)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`ui-press ui-press--on-dark ui-focus relative h-11 rounded-xl flex items-center px-[17px] gap-4 ${
                isActive
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-emerald-400"
                />
              )}

              <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center pointer-events-none">
                {isLit ? PhosphorIcons[item.id]?.fill : PhosphorIcons[item.id]?.regular}
              </span>

              <span
                className="pointer-events-none overflow-hidden"
                style={labelStyle}
              >
                <span
                  data-label={item.label}
                  className={`nav-label ${
                    isLit ? 'font-semibold text-white' : 'font-medium text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
