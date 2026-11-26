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

/* Phosphor Icon Geometries (256x256 scaled to 24x24, 1.5px stroke weight look) */
const PhosphorIcons: Record<string, { regular: React.ReactNode; fill: React.ReactNode }> = {
  home: {
    regular: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M213.66,101.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,112v96a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V112A8,8,0,0,0,213.66,101.66Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
        <path d="M218.83,103.77l-80-75.48a16,16,0,0,0-21.66,0l-80,75.48A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
      </svg>
    )
  },
  watchlist: {
    regular: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
        <path d="M192,24H64A16,16,0,0,0,48,40V224a8,8,0,0,0,12.65,6.51L128,183.13l67.35,47.38A8,8,0,0,0,208,224V40A16,16,0,0,0,192,24Z" />
      </svg>
    )
  },
  discover: {
    regular: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="128" r="96" />
        <polygon points="176 80 144 144 80 176 112 112 176 80" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,58.34-16,64a8,8,0,0,1-5.68,5.68l-64,16a8,8,0,0,1-9.66-9.66l16-64a8,8,0,0,1,5.68-5.68l64-16a8,8,0,0,1,9.66,9.66Z" />
      </svg>
    )
  },
  quiz: {
    regular: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="128" r="96" />
        <circle cx="128" cy="180" r="10" fill="currentColor" stroke="none" />
        <path d="M128,144v-8a24,24,0,0,1,24-24,20,20,0,1,0-28-18.32" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm16,152a12,12,0,1,1-12-12A12,12,0,0,1,144,176Zm8-76c0,10.22-8.52,18.73-16,21.78V128a8,8,0,0,1-16,0v-8a8,8,0,0,1,8-8c8.82,0,16-5.38,16-12s-7.18-12-16-12-16,5.38-16,12a8,8,0,0,1-16,0c0-15.44,14.36-28,32-28S152,84.56,152,100Z" />
      </svg>
    )
  },
  profile: {
    regular: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
        <circle cx="128" cy="96" r="48" />
        <path d="M32,216a96,96,0,0,1,192,0" />
      </svg>
    ),
    fill: (
      <svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
      </svg>
    )
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  // Expand when pointer enters nav
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsExpanded(true);
  };

  // 120ms leave delay to avoid flicker
  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
      setHoveredId(null);
    }, 120);
  };

  // Keyboard focus-within expands the nav
  const handleFocus = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        setFocusedId(null);
      }, 120);
    }
  };

  // Touch devices: first tap expands rail; tapping outside collapses
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setHoveredId(null);
        setFocusedId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
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
      className="hidden lg:block fixed top-0 left-0 h-screen select-none z-50 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        width: isExpanded ? '280px' : '96px',
      }}
    >
      {/* 1. Collapsed Faint Scrim Background across 96px */}
      <div
        className="absolute top-0 left-0 h-full w-[96px] hotstar-nav-scrim-collapsed pointer-events-none z-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ opacity: isExpanded ? 0 : 1 }}
      />

      {/* 2. Expanded 420px Seamless Gradient Scrim with Soft Fadeout */}
      <div
        className="absolute top-0 left-0 h-full w-[420px] hotstar-nav-scrim-expanded pointer-events-none z-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ opacity: isExpanded ? 1 : 0 }}
      />

      {/* 3. Top Logo Slot: 40x40 Doctor Doom Mask with Doom Green Smoke & Flame Aura */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('home');
        }}
        className="absolute top-[36px] left-[48px] -translate-x-1/2 w-[40px] h-[40px] doom-flame-container cursor-pointer z-20 transition-transform active:scale-[0.96] select-none"
        aria-label="Doomflix Home"
      >
        {/* Doom Green Smoke & Flame Layers */}
        <div className="doom-flame-smoke" />
        <div className="doom-flame-smoke-layer2" />

        {/* Doctor Doom Mask Logo Image */}
        <img
          src="/assets/image.png"
          alt="Doomflix"
          className="doom-logo-img w-[40px] h-[40px] object-cover"
        />
      </a>

      {/* Expanded Sidebar Brand Name 'Doomflix' on the right side of the logo */}
      <div
        className="absolute left-[78px] top-[36px] h-[40px] flex items-center pointer-events-none overflow-hidden"
        style={{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateX(0px)' : 'translateX(-8px)',
          transition: isExpanded
            ? 'opacity 220ms cubic-bezier(0.4, 0, 0.2, 1) 40ms, transform 220ms cubic-bezier(0.4, 0, 0.2, 1) 40ms'
            : 'opacity 120ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 120ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
      >
        <span className="font-cinematic text-2xl font-black tracking-wider text-white select-none whitespace-nowrap">
          DOOM<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">FLIX</span>
        </span>
      </div>

      {/* 4. Item List: Vertically Centered in Viewport, Pitch 52px (44px height + 8px gap) */}
      <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center gap-[8px] z-10 pointer-events-auto">
        {NAV_ITEMS.map((item, index) => {
          const isActive = currentTab === item.id;
          const isHovered = hoveredId === item.id;
          const isFocused = focusedId === item.id;
          const isItemActiveOrHovered = isActive || isHovered || isFocused;

          // Staggered entrance for labels on expand; instant unified exit on collapse
          const labelStyle: React.CSSProperties = isExpanded
            ? {
              opacity: 1,
              transform: 'translateX(0px)',
              transition: `opacity 220ms cubic-bezier(0.4, 0, 0.2, 1) ${60 + index * 30}ms, transform 220ms cubic-bezier(0.4, 0, 0.2, 1) ${60 + index * 30}ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1)`
            }
            : {
              opacity: 0,
              transform: 'translateX(-8px)',
              transition: 'opacity 120ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 150ms cubic-bezier(0.4, 0, 0.2, 1)'
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
              className="relative w-full h-[44px] flex items-center select-none active:scale-[0.96] transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset rounded-[8px]"
            >
              {/* Active Route Soft Glow Halo (64x64 circle centered on icon at x=48px, y=22px) */}
              <div
                className="absolute w-[64px] h-[64px] rounded-full pointer-events-none transition-opacity duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  left: '48px',
                  top: '22px',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0) 70%)',
                  opacity: isActive ? 1 : 0
                }}
              />

              {/* 24x24 Icon Box centered at x = 48px (left: 36px to 60px) */}
              <div className="absolute left-[36px] w-[24px] h-[24px] flex items-center justify-center pointer-events-none">
                {/* Outline Icon Variant */}
                <span
                  className="absolute inset-0 flex items-center justify-center text-[rgba(255,255,255,0.62)] transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ opacity: isItemActiveOrHovered ? 0 : 1 }}
                >
                  {PhosphorIcons[item.id]?.regular}
                </span>

                {/* Fill Icon Variant */}
                <span
                  className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ opacity: isItemActiveOrHovered ? 1 : 0 }}
                >
                  {PhosphorIcons[item.id]?.fill}
                </span>
              </div>

              {/* Label starting at x = 78px (18px gap from icon box right edge at 60px) */}
              <div
                className="absolute left-[78px] pointer-events-none overflow-hidden"
                style={labelStyle}
              >
                <span
                  data-label={item.label}
                  className={`nav-label ${isItemActiveOrHovered
                    ? 'font-bold text-white'
                    : 'font-medium text-[rgba(255,255,255,0.62)]'
                    }`}
                >
                  {item.label}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
