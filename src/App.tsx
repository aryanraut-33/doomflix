import React, { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './services/store';
import { initInteractionKit } from './lib/interactionKit';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { AuthModal } from './components/common/AuthModal';
import { AchievementToast } from './components/common/AchievementToast';
import { CommandCentre } from './components/home/CommandCentre';
import { WatchlistManager } from './components/watchlist/WatchlistManager';
import { DiscoverCatalog } from './components/discover/DiscoverCatalog';
import { KnowledgeArena } from './components/quiz/KnowledgeArena';
import { UserProfile } from './components/profile/UserProfile';
import { TitleDetailsModal } from './components/details/TitleDetailsModal';
import { MarvelTitle } from './data/marvelCatalogue';

const AppContent: React.FC = () => {
  const { newUnlockedToast, dismissAchievementToast } = useAppStore();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [detailsModalTitle, setDetailsModalTitle] = useState<MarvelTitle | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    return initInteractionKit(document);
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-doom-950 text-slate-50 font-sans selection:bg-doom-emerald selection:text-doom-950 overflow-x-hidden">
      {/* 1. Primary Fixed Sidebar (Desktop only, hidden on mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* 2. Main Content (pb-28 on mobile to float freely above the floating footer navbar) */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-28 lg:pb-0">
        {currentTab === 'home' && (
          <CommandCentre
            onSelectTab={handleSelectTab}
            onOpenTitleDetails={(t) => setDetailsModalTitle(t)}
          />
        )}

        {currentTab !== 'home' && (
          <main className="flex-1 px-4 sm:px-6 md:px-8 lg:pl-32 lg:pr-12 py-6 pt-8 lg:pt-10 max-w-7xl mx-auto w-full">
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

            {(currentTab === 'profile' || currentTab === 'settings') && (
              <UserProfile
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}
          </main>
        )}
      </div>

      {/* 3. Floating Mobile Footer Navbar (Mobile only, hidden on desktop) */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* 4. Global Modals */}
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
