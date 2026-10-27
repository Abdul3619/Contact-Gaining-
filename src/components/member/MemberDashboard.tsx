/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WhatsAppStatusNotice } from '../common/Disclaimers';
import {
  DownloadCloud,
  FileCheck2,
  Calendar,
  Users2,
  Shield,
  ArrowRight,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Clock,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { activeMember, setMemberScreen, t, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const config = mockDataService.getAllowanceConfig();
  const releases = mockDataService.getReleases();
  const latestRelease = releases[0];

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(`https://globalsphere.community/join?ref=${activeMember.referralCode}`);
    setCopied(true);
    addToast('Demonstration referral invitation link copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickDownload = (type: 'incremental' | 'full') => {
    setIsDownloading(true);
    setTimeout(() => {
      const res = mockDataService.simulateDownload(latestRelease.id, type);
      setIsDownloading(false);
      if (res.success) {
        addToast(
          `Generated sample ${type} .vcf file (${res.record?.contactCount} demo contacts). Check your downloads!`,
          'success'
        );
      } else {
        addToast(res.error || 'Download failed', 'error');
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashWelcome')}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-teal-700 font-medium">Free Pilot Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeMember.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
            <span>{activeMember.normalizedE164}</span>
            <span>·</span>
            <span>Country: {activeMember.countryCode}</span>
            <span>·</span>
            <Badge variant={activeMember.eligibility === 'eligible' ? 'success' : 'warning'}>
              {activeMember.eligibility}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMemberScreen('profile')}
          >
            Manage Consent
          </Button>
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setMemberScreen('downloads')}
            icon={<DownloadCloud className="w-4 h-4" />}
          >
            Download Centre
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Free Weekly Allowance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashWeeklyAllowance')}
              </span>
              <span className="text-xs text-teal-600 font-semibold">100% Free</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {config.freeWeeklyContactsPerMember}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              New contacts available to export this week
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Resets every {config.incrementalReleaseDay}</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* New Contacts Available */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashNewAvailable')}
              </span>
              <span className="text-xs text-emerald-600 font-semibold font-mono">
                +{latestRelease.incrementalNewContacts}
              </span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {latestRelease.incrementalNewContacts}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              In Release #{latestRelease.releaseNumber}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Deduplicated E.164</span>
            <FileCheck2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Total Directory Size */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Consented Cohort
              </span>
              <span className="text-xs text-slate-400 font-mono">Directory</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {latestRelease.totalEligibleContacts}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified opt-in members worldwide
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: {config.pilotMonetizationThreshold} for Phase 2</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Referrals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('dashReferralCount')}
              </span>
              <span className="text-xs text-teal-600 font-mono">{activeMember.referralCode}</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {activeMember.totalReferrals}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Colleagues registered via your code
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Invites rewarded in Phase 2</span>
            <Users2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Downloads & Release Cycle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Quick Download Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t('dashQuickDownload')}
                </h2>
                <p className="text-xs text-slate-500">
                  Export standard RFC 2426 vCard (.vcf) contacts directly into your phone.
                </p>
              </div>
              <Badge variant="pilot">VCF 3.0 Standard</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Incremental Download */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-900 uppercase">
                      Recommended
                    </span>
                    <span className="text-xs font-mono text-teal-700 font-semibold">
                      +{latestRelease.incrementalNewContacts} New
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Incremental Batch
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Download only the newly verified contacts added in Release #{latestRelease.releaseNumber}. Prevents duplicates on your phone.
                  </p>
                </div>

                <Button
                  variant="emerald"
                  isLoading={isDownloading}
                  onClick={() => handleQuickDownload('incremental')}
                  className="w-full"
                  icon={<DownloadCloud className="w-4 h-4" />}
                >
                  Download Incremental (.vcf)
                </Button>
              </div>

              {/* Full List Recovery */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      Archive Recovery
                    </span>
                    <span className="text-xs font-mono text-slate-700 font-semibold">
                      48 Sample Entries
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Full Directory Export
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Download the complete eligible directory. Ideal if you changed phones or need a full address book restore.
                  </p>
                </div>

                <Button
                  variant="outline"
                  isLoading={isDownloading}
                  onClick={() => handleQuickDownload('full')}
                  className="w-full"
                  icon={<Layers className="w-4 h-4" />}
                >
                  Download Full Cohort (.vcf)
                </Button>
              </div>
            </div>

            {/* Status notice */}
            <div className="mt-4">
              <WhatsAppStatusNotice />
            </div>
          </div>

          {/* Release History Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Releases</h3>
              <button
                onClick={() => setMemberScreen('downloads')}
                className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All In Download Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {releases.slice(0, 3).map(r => (
                <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">{r.releaseTitle}</span>
                    <span className="text-slate-400 text-[11px]">
                      Published {new Date(r.publishedAt).toLocaleDateString()} · {r.incrementalNewContacts} incremental contacts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">{(r.fileSizeBytes / 1024).toFixed(1)} KB</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Next Release + Referral Widget + Help */}
        <div className="space-y-6">
          {/* Next Release Countdown */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <Calendar className="w-4 h-4" />
              <span>{t('dashNextRelease')}</span>
            </div>
            <h3 className="text-xl font-bold">
              Release #05 Coming Friday
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every Friday at 18:00 UTC, newly verified voluntary members are bundled into the incremental distribution file.
            </p>
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs flex items-center justify-between">
              <span className="text-slate-400">Scheduled Time:</span>
              <span className="font-mono text-teal-300 font-semibold">Friday 18:00 UTC</span>
            </div>
          </div>

          {/* Personal Referral Link Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {t('dashReferralCardTitle')}
            </h3>
            <p className="text-xs text-slate-500">
              Share your link with fellow creators and businesses. In Phase 2, successful referrals unlock higher download allowances.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 truncate">
              <span className="truncate flex-1">
                globalsphere.community/join?ref={activeMember.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer shrink-0"
                title="Copy referral link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Need Assistance?
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setMemberScreen('referrals')}
                className="w-full text-left py-1 text-slate-600 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>How to import .vcf on Android / iPhone</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setMemberScreen('referrals')}
                className="w-full text-left py-1 text-slate-600 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>Report unsolicited spam / broadcast</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setMemberScreen('profile')}
                className="w-full text-left py-1 text-slate-600 hover:text-slate-900 flex items-center justify-between cursor-pointer"
              >
                <span>Withdraw consent &amp; remove number</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
