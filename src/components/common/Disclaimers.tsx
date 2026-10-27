/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, ShieldAlert, Users, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SampleDataBanner: React.FC = () => {
  const { t, resetDemonstrationData } = useApp();

  return (
    <aside aria-label="Demonstration Notice" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-teal-400 shrink-0">PHASE 1 PILOT DEMO</span>
          <span className="text-slate-400 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-slate-300">{t('sampleDataNotice')}</span>
        </div>
        <button
          onClick={resetDemonstrationData}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer shrink-0"
          title="Restore original sample records"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};

export const WhatsAppStatusNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900 text-xs sm:text-sm ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-950 mb-0.5">{t('statusDisclaimerTitle')}</h4>
          <p className="text-amber-800 leading-relaxed">{t('statusDisclaimerText')}</p>
        </div>
      </div>
    </div>
  );
};

export const ContactPermanenceNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 text-xs sm:text-sm ${className}`}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-slate-900 mb-0.5">{t('noRemoteWipeTitle')}</h4>
          <p className="text-slate-600 leading-relaxed">{t('noRemoteWipeText')}</p>
        </div>
      </div>
    </div>
  );
};

export const CommunityInvitationNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useApp();
  return (
    <div className={`rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-teal-900 text-xs sm:text-sm ${className}`}>
      <div className="flex items-start gap-3">
        <Users className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-teal-950 mb-0.5">WhatsApp Community vs Platform Consent</h4>
          <p className="text-teal-800 leading-relaxed">{t('communityInviteNotice')}</p>
        </div>
      </div>
    </div>
  );
};
