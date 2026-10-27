/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe2, ShieldCheck, UserCheck, LayoutDashboard } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { locale, setLocale, t, setViewMode, setMemberScreen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setViewMode('public');
            setMemberScreen('landing');
          }}
          className="flex items-center gap-2.5 text-left text-slate-900 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-slate-800 transition-colors">
            GS
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
              {t('brandName')}
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
              International
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              setViewMode('public');
              setMemberScreen('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => {
              setViewMode('public');
              setMemberScreen('landing');
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navHowItWorks')}
          </button>
          <button
            onClick={() => {
              setViewMode('public');
              setMemberScreen('landing');
              document.getElementById('consent-privacy')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navConsent')}
          </button>
          <button
            onClick={() => {
              setViewMode('public');
              setMemberScreen('landing');
              document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navFaq')}
          </button>
        </nav>

        {/* Zone 3: Actions + Language Switcher + Admin Switch */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                locale === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                locale === 'fr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Français"
            >
              FR
            </button>
          </div>

          {/* Sign In button */}
          <button
            onClick={() => {
              setViewMode('member');
              setMemberScreen('sign_in');
            }}
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {t('navSignIn')}
          </button>

          {/* Primary Action: Register */}
          <button
            onClick={() => {
              setViewMode('member');
              setMemberScreen('register');
            }}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            {t('navRegister')}
          </button>

          {/* Admin Mode Quick Switch */}
          <button
            onClick={() => setViewMode('admin')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Switch to Admin Console (Demo)"
            aria-label="Admin Console"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
