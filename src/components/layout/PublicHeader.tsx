/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Menu, X } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { locale, setLocale, t, setViewMode, setMemberScreen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToSection = (sectionId?: string) => {
    setViewMode('public');
    setMemberScreen('landing');
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 dark:bg-[#0B0A08]/90 backdrop-blur-md border-b border-[#E5DFD5] dark:border-[#2B261F] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">
        {/* Brand Wordmark */}
        <button
          onClick={() => navigateToSection()}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#15130F] dark:bg-[#1D1A15] border border-[#9D7B43]/50 dark:border-[#C5A15B]/50 text-[#C5A15B] flex items-center justify-center font-bold text-sm shadow-xs group-hover:border-[#C5A15B] transition-colors">
            CG
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-[#1C1915] dark:text-[#F5F0E6] block leading-tight">
              {t('brandName')}
            </span>
            <span className="text-[11px] text-[#6B6357] dark:text-[#A8A196] block font-normal">
              {t('brandTagline')}
            </span>
          </div>
        </button>

        {/* Clean Typography Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#6B6357] dark:text-[#A8A196]">
          <button
            onClick={() => navigateToSection()}
            className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => navigateToSection('how-it-works')}
            className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navHowItWorks')}
          </button>
          <button
            onClick={() => navigateToSection('privacy-sharing')}
            className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navConsent')}
          </button>
          <button
            onClick={() => navigateToSection('about-founder')}
            className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navFounder')}
          </button>
          <button
            onClick={() => navigateToSection('faq')}
            className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t('navFaq')}
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          {/* Clean Language Segmented Switcher */}
          <div className="flex items-center bg-[#F0ECE1] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                locale === 'en'
                  ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs'
                  : 'text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6]'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLocale('fr')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                locale === 'fr'
                  ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs'
                  : 'text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6]'
              }`}
              title="Français"
            >
              FR
            </button>
          </div>

          {/* Member Sign In (Desktop) */}
          <button
            onClick={() => {
              setViewMode('member');
              setMemberScreen('sign_in');
            }}
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#FFFFFF] rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] transition-colors cursor-pointer"
          >
            {t('navSignIn')}
          </button>

          {/* Join CTA */}
          <button
            onClick={() => {
              setViewMode('member');
              setMemberScreen('register');
            }}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B0A08] bg-[#C5A15B] hover:bg-[#D4B36D] active:bg-[#B38F49] rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            {t('navRegister')}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6] rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5DFD5] dark:border-[#2B261F] bg-[#FFFFFF]/95 dark:bg-[#0B0A08]/95 backdrop-blur-md px-4 py-4 space-y-2">
          <button
            onClick={() => navigateToSection()}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => navigateToSection('how-it-works')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
          >
            {t('navHowItWorks')}
          </button>
          <button
            onClick={() => navigateToSection('privacy-sharing')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
          >
            {t('navConsent')}
          </button>
          <button
            onClick={() => navigateToSection('about-founder')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
          >
            {t('navFounder')}
          </button>
          <button
            onClick={() => navigateToSection('faq')}
            className="w-full text-left py-2 px-3 text-sm font-medium rounded-lg hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
          >
            {t('navFaq')}
          </button>
          <div className="pt-2 border-t border-[#E5DFD5] dark:border-[#2B261F]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setViewMode('member');
                setMemberScreen('sign_in');
              }}
              className="w-full text-center py-2 px-3 text-sm font-semibold rounded-lg bg-[#F0ECE1] dark:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] cursor-pointer"
            >
              {t('navSignIn')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
