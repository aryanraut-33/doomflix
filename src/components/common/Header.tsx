import React from 'react';
import { Sidebar, NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  return <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} onOpenAuth={onOpenAuth} />;
};
