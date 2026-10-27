/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, MemberScreen } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard,
  DownloadCloud,
  User,
  Users2,
  ChevronDown,
} from 'lucide-react';
import { SampleDataBanner } from '../common/Disclaimers';

export const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    memberScreen,
    setMemberScreen,
    setViewMode,
    activeMember,
    allMembers,
    switchActiveMember,
    locale,
    setLocale,
    t,
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navItems: { id: MemberScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'downloads', label: t('navDownloads'), icon: <DownloadCloud className="w-4 h-4" /> },
    { id: 'referrals', label: t('navReferrals'), icon: <Users2 className="w-4 h-4" /> },
    { id: 'profile', label: t('navProfile'), icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col text-[#1C1915] dark:text-[#F5F0E6] pb-24 md:pb-8 relative z-10 transition-colors">
      <SampleDataBanner />

      {/* Member Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 dark:bg-[#0B0A08]/90 backdrop-blur-md border-b border-[#E5DFD5] dark:border-[#2B261F] transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
          {/* Brand + Screen Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setViewMode('public');
                setMemberScreen('landing');
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#15130F] dark:bg-[#1D1A15] border border-[#9D7B43]/50 dark:border-[#C5A15B]/50 text-[#C5A15B] flex items-center justify-center font-bold text-xs shadow-xs group-hover:border-[#C5A15B] transition-colors">
                CG
              </div>
              <span className="text-sm font-bold tracking-tight text-[#1C1915] dark:text-[#F5F0E6] hidden sm:inline">
                {t('brandName')}
              </span>
            </button>

            <span className="text-[#E5DFD5] dark:text-[#2B261F] hidden md:inline" aria-hidden="true">/</span>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map(item => {
                const isActive = memberScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMemberScreen(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] shadow-xs'
                        : 'text-[#6B6357] hover:text-[#1C1915] hover:bg-[#F0ECE1] dark:text-[#A8A196] dark:hover:text-[#FFFFFF] dark:hover:bg-[#1D1A15]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Theme Toggle + Profile Selector + Language */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            {/* Account Switcher Dropdown (With discreet admin entry point inside) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E5DFD5] dark:border-[#2B261F] bg-[#FFFFFF] dark:bg-[#15130F] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-xs font-medium text-[#1C1915] dark:text-[#F5F0E6] transition-colors cursor-pointer max-w-[170px] sm:max-w-xs truncate"
                title="Switch preview profile"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B] shrink-0" aria-hidden="true" />
                <span className="truncate">{activeMember.displayName.split('(')[0].trim()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B6357] dark:text-[#81796D] shrink-0" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-[#FFFFFF] dark:bg-[#15130F] rounded-xl shadow-xl border border-[#E5DFD5] dark:border-[#2B261F] p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#6B6357] dark:text-[#81796D] uppercase tracking-wider">
                    Preview as another member
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#E5DFD5]/50 dark:divide-[#2B261F]/60">
                    {allMembers.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          switchActiveMember(m.id);
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 rounded-lg transition-colors cursor-pointer ${
                          m.id === activeMember.id
                            ? 'bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B] font-semibold'
                            : 'text-[#1C1915] dark:text-[#C4BCAD] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
                        }`}
                      >
                        <span className="truncate font-medium">{m.displayName}</span>
                        <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] font-mono">
                          {m.normalizedE164} · {m.countryCode}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Discreet Admin Entry */}
                  <div className="pt-2 mt-2 border-t border-[#E5DFD5] dark:border-[#2B261F]">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('admin');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-[#6B6357] hover:text-[#1C1915] dark:text-[#81796D] dark:hover:text-[#F5F0E6] rounded-md hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] transition-colors cursor-pointer"
                    >
                      Community management console
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-[#F0ECE1] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLocale('en')}
                className={`px-1.5 py-1 rounded-md transition-colors cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs'
                    : 'text-[#6B6357] hover:text-[#1C1915] dark:text-[#81796D] dark:hover:text-[#F5F0E6]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('fr')}
                className={`px-1.5 py-1 rounded-md transition-colors cursor-pointer ${
                  locale === 'fr'
                    ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs'
                    : 'text-[#6B6357] hover:text-[#1C1915] dark:text-[#81796D] dark:hover:text-[#F5F0E6]'
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#0B0A08]/95 backdrop-blur-md border-t border-[#E5DFD5] dark:border-[#2B261F] shadow-lg transition-colors"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {navItems.map(item => {
            const isActive = memberScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMemberScreen(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'text-[#9D7B43] dark:text-[#C5A15B] font-bold'
                    : 'text-[#6B6357] dark:text-[#81796D] hover:text-[#1C1915] dark:hover:text-[#C4BCAD]'
                }`}
              >
                <span className={isActive ? 'text-[#9D7B43] dark:text-[#C5A15B]' : ''}>{item.icon}</span>
                <span className="text-[10px] tracking-tight mt-1 truncate max-w-[70px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
