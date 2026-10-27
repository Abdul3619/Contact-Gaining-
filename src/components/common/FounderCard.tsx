/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, X } from 'lucide-react';

interface FounderCardProps {
  variant?: 'dashboard' | 'section';
  className?: string;
}

const FOUNDER_PORTFOLIO_URL = 'https://abdulwahab-portfolio-tau.vercel.app/';

export const FounderCard: React.FC<FounderCardProps> = ({ variant = 'section', className = '' }) => {
  const { t } = useApp();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (variant === 'dashboard') {
      try {
        return localStorage.getItem('contact_gaining_founder_dismissed') === 'true';
      } catch {}
    }
    return false;
  });

  if (dismissed && variant === 'dashboard') {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('contact_gaining_founder_dismissed', 'true');
    } catch {}
  };

  // Dashboard variant: Dismissible warm note
  if (variant === 'dashboard') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-[#1C1915] dark:text-[#F5F0E6] ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#15130F] dark:bg-[#1D1A15] border border-[#9D7B43]/40 dark:border-[#C5A15B]/40 text-[#C5A15B] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              AW
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs text-[#6B6357] dark:text-[#A8A196]">
                <span className="font-semibold text-[#9D7B43] dark:text-[#C5A15B]">
                  {t('founderRole')}
                </span>
                <span>·</span>
                <span>{t('founderCardTitle')}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] leading-relaxed max-w-2xl">
                {t('founderIntro')}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6] p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label={t('founderCardDismiss')}
            title="Dismiss note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E5DFD5] dark:border-[#2B261F] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#6B6357] dark:text-[#A8A196]">
            Every connection is built on mutual opt-in and clear privacy.
          </span>
          <a
            href={FOUNDER_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#9D7B43] dark:text-[#C5A15B] hover:underline transition-colors"
          >
            <span>{t('founderPortfolioCta')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Section variant for Landing Page
  return (
    <section className={`relative max-w-4xl mx-auto px-4 ${className}`}>
      <div className="relative overflow-hidden rounded-3xl border p-7 sm:p-10 transition-all bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#15130F] dark:bg-[#1D1A15] text-[#C5A15B] border border-[#9D7B43]/40 dark:border-[#C5A15B]/40 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            AW
          </div>

          <div className="flex-1 space-y-3.5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9D7B43] dark:text-[#C5A15B] mb-1">
                {t('founderRole')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight">
                {t('founderHeading')}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#1C1915] dark:text-[#F5F0E6] leading-relaxed">
              {t('founderIntro')}
            </p>

            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              {t('founderMission')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={FOUNDER_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm text-[#0B0A08] bg-[#C5A15B] hover:bg-[#D4B36D] transition-colors shadow-xs cursor-pointer"
              >
                <span>{t('founderPortfolioCta')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={FOUNDER_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] bg-[#F0ECE1] dark:bg-[#1D1A15] hover:bg-[#E5DFD5] dark:hover:bg-[#25221D] border border-[#E5DFD5] dark:border-[#2B261F] transition-colors cursor-pointer"
              >
                <span>{t('founderWorkTogetherCta')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
