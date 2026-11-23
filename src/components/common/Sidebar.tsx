import React from 'react';
import { 
  Compass, 
  Film, 
  HelpCircle, 
  Home, 
  Layers, 
  Search, 
  ShieldAlert, 
  Sliders, 
  User as UserIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../services/store';

export type NavTab = 'home' | 'watchlist' | 'discover' | 'quiz' | 'multiverse' | 'profile' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { collections, activeCollectionId, setActiveCollectionId, overallStats, user } = useAppStore();

  const navItems = [
    { id: 'home' as NavTab, label: 'Command Centre', icon: Home, badge: null },
    { id: 'watchlist' as NavTab, label: 'My Watchlist', icon: Film, badge: `${overallStats.completedCount}/${overallStats.totalTitles}` },
    { id: 'discover' as NavTab, label: 'Discover & Add', icon: Search, badge: null },
    { id: 'quiz' as NavTab, label: 'Knowledge Arena', icon: HelpCircle, badge: 'QUIZ' },
    { id: 'multiverse' as NavTab, label: 'Multiverse Explorer', icon: Compass, badge: '3D' },
    { id: 'profile' as NavTab, label: 'Profile & Badges', icon: UserIcon, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-doom-950 border-r border-doom-border/80 h-screen sticky top-0 z-40 select-none">
      {/* Brand Identity */}
      <div className="p-6 border-b border-doom-border/60">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
          <div className="w-9 h-9 rounded-lg bg-doom-red flex items-center justify-center font-cinematic font-black text-2xl text-white shadow-glow-red tracking-wider">
            D
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinematic text-2xl tracking-widest text-white uppercase font-black">
                DOOMFLIX
              </span>
              <span className="text-[9px] bg-doom-red/20 text-doom-red border border-doom-red/40 px-1 py-0.2 rounded font-mono font-bold">
                MCU
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide">
              Your Universe. Your Countdown.
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-marvel uppercase tracking-wider text-gray-400 px-3 pb-2 font-bold">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-doom-red/20 to-doom-red/5 text-white border-l-2 border-doom-red shadow-inner'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-doom-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-doom-red' : 'text-gray-400'} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-doom-red text-white' : 'bg-doom-800 text-gray-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Collections Section */}
        <div className="pt-6 pb-2">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] font-marvel uppercase tracking-wider text-gray-400 font-bold">
              Collections ({collections.length})
            </span>
            <button
              onClick={() => onSelectTab('watchlist')}
              className="text-[10px] text-doom-gold hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-1">
            {collections.map(col => {
              const isColActive = currentTab === 'watchlist' && activeCollectionId === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => {
                    setActiveCollectionId(col.id);
                    onSelectTab('watchlist');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs truncate transition-colors flex items-center gap-2 ${
                    isColActive 
                      ? 'bg-doom-800 text-doom-gold font-semibold border-l-2 border-doom-gold' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-doom-900/40'
                  }`}
                  title={col.name}
                >
                  <Layers size={13} className={col.isSystemCollection ? 'text-doom-red' : 'text-gray-400'} />
                  <span className="truncate">{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overall Progress Mini Meter */}
      <div className="p-4 border-t border-doom-border/60 bg-doom-900/50">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-400 font-sans">Multiverse Prep</span>
          <span className="text-white font-mono font-bold">{overallStats.completionPercentage}%</span>
        </div>
        <div className="w-full bg-doom-950 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-doom-red to-doom-gold transition-all duration-500 rounded-full"
            style={{ width: `${overallStats.completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>{overallStats.completedCount} Watched</span>
          <span>{overallStats.totalTitles - overallStats.completedCount} Remaining</span>
        </div>
      </div>

      {/* User / Guest Footer */}
      <div className="p-3 border-t border-doom-border/60 flex items-center justify-between bg-doom-950">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-doom-800 border border-doom-border flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
              <span>{user.username}</span>
              {user.isGuest ? (
                <span className="text-[9px] bg-doom-800 text-gray-400 px-1 rounded font-mono">Guest</span>
              ) : (
                <CheckCircle2 size={11} className="text-doom-emerald" />
              )}
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              {user.isGuest ? 'Local storage only' : user.email}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="text-xs text-gray-400 hover:text-white p-1.5 rounded hover:bg-doom-800 transition-colors"
          title={user.isGuest ? 'Sign In / Register to sync across devices' : 'Account Settings'}
        >
          <Sliders size={15} />
        </button>
      </div>
    </aside>
  );
};
