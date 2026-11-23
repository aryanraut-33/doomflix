import React, { useState } from 'react';
import { AppProvider, useAppStore } from './services/store';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { AuthModal } from './components/common/AuthModal';
import { AchievementToast } from './components/common/AchievementToast';
import { CommandCentre } from './components/home/CommandCentre';
import { WatchlistManager } from './components/watchlist/WatchlistManager';
import { DiscoverCatalog } from './components/discover/DiscoverCatalog';
import { KnowledgeArena } from './components/quiz/KnowledgeArena';
import { MultiverseExplorer } from './components/multiverse/MultiverseExplorer';
import { UserProfile } from './components/profile/UserProfile';
import { TitleDetailsModal } from './components/details/TitleDetailsModal';
import { MarvelTitle } from './data/marvelCatalogue';

const AppContent: React.FC = () => {
  const { newUnlockedToast, dismissAchievementToast } = useAppStore();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [detailsModalTitle, setDetailsModalTitle] = useState<MarvelTitle | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-doom-950 text-gray-100 font-sans selection:bg-doom-red selection:text-white">
      {/* 1. Desktop Persistent Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Mobile Drawer (When Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 bg-doom-950 h-full p-4 border-r border-doom-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-doom-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-doom-red flex items-center justify-center font-cinematic font-black text-xl text-white">
                  D
                </div>
                <span className="font-cinematic text-2xl text-white tracking-wider">DOOMFLIX</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 p-1">
                ✕
              </button>
            </div>

            <div className="space-y-1">
              {[
                { id: 'home' as NavTab, label: 'Command Centre' },
                { id: 'watchlist' as NavTab, label: 'My Watchlist' },
                { id: 'discover' as NavTab, label: 'Discover & Add' },
                { id: 'quiz' as NavTab, label: 'Knowledge Arena' },
                { id: 'multiverse' as NavTab, label: 'Multiverse Explorer' },
                { id: 'profile' as NavTab, label: 'Profile & Settings' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    currentTab === item.id 
                      ? 'bg-doom-red text-white' 
                      : 'text-gray-300 hover:bg-doom-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onSelectTab={handleSelectTab}
          onOpenAuth={() => setAuthModalOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Viewport Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 max-w-7xl mx-auto w-full">
          {currentTab === 'home' && (
            <CommandCentre
              onSelectTab={handleSelectTab}
              onOpenTitleDetails={(t) => setDetailsModalTitle(t)}
            />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistManager
              onOpenTitleDetails={(t) => setDetailsModalTitle(t)}
              onNavigateDiscover={() => handleSelectTab('discover')}
            />
          )}

          {currentTab === 'discover' && (
            <DiscoverCatalog
              onOpenTitleDetails={(t) => setDetailsModalTitle(t)}
            />
          )}

          {currentTab === 'quiz' && (
            <KnowledgeArena />
          )}

          {currentTab === 'multiverse' && (
            <MultiverseExplorer
              onOpenTitleDetails={(t) => setDetailsModalTitle(t)}
            />
          )}

          {(currentTab === 'profile' || currentTab === 'settings') && (
            <UserProfile
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Persistent Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* 4. Global Modals & Notifications */}
      <TitleDetailsModal
        isOpen={!!detailsModalTitle}
        title={detailsModalTitle}
        onClose={() => setDetailsModalTitle(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <AchievementToast
        achievement={newUnlockedToast}
        onDismiss={dismissAchievementToast}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
