/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, MemberScreen } from '../../context/AppContext';
import {
  LayoutDashboard,
  DownloadCloud,
  User,
  Users2,
  Globe2,
  ChevronDown,
  Shield,
  ArrowLeft,
  Settings,
  HelpCircle,
  ExternalLink,
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
    { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'downloads', label: t('navDownloads'), icon: <DownloadCloud className="w-5 h-5" /> },
    { id: 'referrals', label: t('navReferrals'), icon: <Users2 className="w-5 h-5" /> },
    { id: 'profile', label: t('navProfile'), icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-20 md:pb-6">
      <SampleDataBanner />

      {/* Member Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
          {/* Brand + Screen info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setViewMode('public');
                setMemberScreen('landing');
              }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-sm shadow-xs">
                GS
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900 hidden sm:inline">
                {t('brandName')}
              </span>
            </button>

            <span className="text-slate-300 hidden md:inline" aria-hidden="true">/</span>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = memberScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMemberScreen(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Switch Demo Account + Language + Admin Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Account Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer max-w-[190px] sm:max-w-xs truncate"
                title="Switch demonstration member account"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                <span className="truncate">{activeMember.displayName.split('(')[0].trim()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Simulate Member Account
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {allMembers.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          switchActiveMember(m.id);
                          setAccountMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-slate-50 rounded-lg transition-colors ${
                          m.id === activeMember.id ? 'bg-teal-50 text-teal-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate font-semibold">{m.displayName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {m.normalizedE164} · {m.countryCode} · {m.eligibility}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLocale('en')}
                className={`px-1.5 py-1 rounded transition-colors cursor-pointer ${
                  locale === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('fr')}
                className={`px-1.5 py-1 rounded transition-colors cursor-pointer ${
                  locale === 'fr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                FR
              </button>
            </div>

            {/* Switch to Admin Mode */}
            <button
              onClick={() => setViewMode('admin')}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {t('switchModeAdmin')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {navItems.map(item => {
            const isActive = memberScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMemberScreen(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                  isActive ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={isActive ? 'text-teal-600' : ''}>{item.icon}</span>
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
