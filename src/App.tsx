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
    <div className="relative flex flex-col min-h-screen bg-doom-950 text-gray-100 font-sans selection:bg-doom-emerald selection:text-white overflow-x-hidden">
      {/* Ambient Glassmorphism Luminous Glow Orbs (Behind content) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-emerald-600/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-teal-500/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-emerald-800/[0.07] rounded-full blur-[150px]" />
      </div>

      {/* 1. Sticky Top Navigation Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Drawer (When Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 bg-doom-950 h-full p-4 border-r border-border doom-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-doom-emerald-dark to-doom-emerald flex items-center justify-center font-cinematic font-black text-xl text-white shadow-sm border border-emerald-400/40">
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
                { id: 'home' as NavTab, label: 'Home / Command' },
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
                      ? 'bg-gradient-to-r from-doom-emerald/20 to-transparent text-white border-l-2 border-doom-emerald font-bold' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Layout (Full Width Cinematic) */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Viewport Content */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 lg:px-12 py-6 max-w-7xl mx-auto w-full">
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
