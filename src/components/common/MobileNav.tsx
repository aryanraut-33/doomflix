import React from 'react';
import { Home, Film, Search, HelpCircle, Compass, User } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'watchlist' as NavTab, label: 'Watchlist', icon: Film },
    { id: 'discover' as NavTab, label: 'Discover', icon: Search },
    { id: 'quiz' as NavTab, label: 'Quiz', icon: HelpCircle },
    { id: 'multiverse' as NavTab, label: 'Explorer', icon: Compass },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-doom-950/95 backdrop-blur-xl border-t border-doom-border/90 px-2 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all ${
              isActive
                ? 'text-doom-emerald font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-doom-emerald' : ''} />
            <span className="text-[10px] mt-1 font-sans">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
