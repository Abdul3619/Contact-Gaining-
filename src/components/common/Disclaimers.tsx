/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info, Smartphone, Users, RotateCcw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SampleDataBanner: React.FC = () => {
  const { t, resetDemonstrationData } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Demonstration Notice"
      className="bg-[#1C1915] text-[#F5F0E6] border-b border-[#2B261F] text-xs py-2 px-4 select-none relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15B] shrink-0" />
          <span className="text-[#C4BCAD] text-[11px] sm:text-xs">
            {t('sampleDataNotice')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemonstrationData}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A8A196] hover:text-[#F5F0E6] underline underline-offset-2 transition-colors cursor-pointer shrink-0"
            title="Reset sample records to initial state"
          >
            <RotateCcw className="w-3 h-3 text-[#C5A15B]" />
            <span>Reset sample data</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#81796D] hover:text-[#F5F0E6] p-0.5 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export const WhatsAppStatusNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <Info className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] mb-1">
            {t('statusDisclaimerTitle')}
          </h3>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
            {t('statusDisclaimerText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPermanenceNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <Smartphone className="w-4 h-4 text-[#6B6357] dark:text-[#A8A196] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] mb-1">
            {t('noRemoteWipeTitle')}
          </h3>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
            {t('noRemoteWipeText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CommunityInvitationNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors bg-[#FBF9F5] dark:bg-[#181612] border-[#E5DFD5] dark:border-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <Users className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B] shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] mb-1">
            Optional community announcement channel
          </h3>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
            {t('communityInviteNotice')}
          </p>
        </div>
      </div>
    </div>
  );
};
