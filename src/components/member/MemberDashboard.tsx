/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { WhatsAppStatusNotice } from '../common/Disclaimers';
import { FounderCard } from '../common/FounderCard';
import {
  DownloadCloud,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  Users2,
  Calendar,
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { activeMember, setMemberScreen, t, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const growthConfig = mockDataService.getGrowthConfig();
  const releases = mockDataService.getReleases();
  const latestRelease = releases[0];

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(`https://contactgaining.community/join?ref=${activeMember.referralCode}`);
    setCopied(true);
    addToast('Your invite link has been copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickDownload = (type: 'incremental' | 'full') => {
    setIsDownloading(true);
    setTimeout(() => {
      const res = mockDataService.simulateDownload(latestRelease.id, type);
      setIsDownloading(false);
      if (res.success) {
        addToast(
          'Contact file (.vcf) downloaded. Ready to import into your contacts.',
          'success'
        );
      } else {
        addToast(res.error || 'Unable to download file. Please try again.', 'error');
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Dismissible Founder Introduction Card */}
      <FounderCard variant="dashboard" />

      {/* Top Welcome Card */}
      <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-[#6B6357] dark:text-[#A8A196]">
            <span>{t('dashWelcome')}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Member
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight">
            {activeMember.displayName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#6B6357] dark:text-[#A8A196]">
            <span className="font-mono text-[#9D7B43] dark:text-[#C5A15B]">{activeMember.normalizedE164}</span>
            <span>·</span>
            <span>Based in {activeMember.countryCode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMemberScreen('profile')}
          >
            My details &amp; consent
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setMemberScreen('downloads')}
            icon={<DownloadCloud className="w-4 h-4 text-black" />}
          >
            Download contacts
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available New Contacts */}
        <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196]">
                {t('dashGrowthAllowance')}
              </span>
              <span className="text-xs text-[#9D7B43] dark:text-[#C5A15B] font-semibold">Open access</span>
            </div>
            <div className="text-3xl font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6] tabular-nums">
              +{latestRelease?.incrementalNewContacts || 48}
            </div>
          </div>
          <p className="text-[11px] text-[#6B6357] dark:text-[#A8A196] mt-3">
            {t('dashAllowanceRemaining')}
          </p>
        </div>

        {/* Directory Size */}
        <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196]">
                Total verified members
              </span>
              <Users2 className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B]" />
            </div>
            <div className="text-3xl font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6] tabular-nums">
              {latestRelease?.totalEligibleContacts || 48}
            </div>
          </div>
          <p className="text-[11px] text-[#6B6357] dark:text-[#A8A196] mt-3">
            Across 10 international regions
          </p>
        </div>

        {/* Next Scheduled Batch */}
        <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196]">
                {t('dashNextRelease')}
              </span>
              <Calendar className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B]" />
            </div>
            <div className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              {growthConfig.incrementalReleaseDay || 'Friday'}
            </div>
          </div>
          <p className="text-[11px] text-[#6B6357] dark:text-[#A8A196] mt-3 font-mono">
            {t('dashNextReleaseTime')}
          </p>
        </div>

        {/* Invite Count */}
        <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196]">
                Invited members
              </span>
              <span className="text-xs font-mono font-semibold text-[#9D7B43] dark:text-[#C5A15B]">
                {activeMember.referralCode}
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6] tabular-nums">
              {activeMember.totalReferrals}
            </div>
          </div>
          <p className="text-[11px] text-[#6B6357] dark:text-[#A8A196] mt-3">
            Members joined with your invite
          </p>
        </div>
      </div>

      {/* Two Column Layout: Quick Downloads & Invite Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Downloads */}
        <div className="rounded-2xl border p-6 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              {t('dashQuickDownload')}
            </h2>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-0.5">
              Get the latest member contacts in a clean .vcf file.
            </p>
          </div>

          <div className="space-y-3">
            {/* Newly Joined Contact Batch */}
            <div className="p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] block">
                  New members since your last download
                </span>
                <span className="text-[11px] text-[#6B6357] dark:text-[#A8A196]">
                  +{latestRelease?.incrementalNewContacts || 48} newly added contacts
                </span>
              </div>
              <Button
                size="sm"
                variant="gold"
                isLoading={isDownloading}
                onClick={() => handleQuickDownload('incremental')}
                icon={<DownloadCloud className="w-4 h-4 text-black" />}
              >
                Download (.vcf)
              </Button>
            </div>

            {/* Complete Directory */}
            <div className="p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] block">
                  Complete member directory
                </span>
                <span className="text-[11px] text-[#6B6357] dark:text-[#A8A196]">
                  {latestRelease?.totalEligibleContacts || 48} verified members
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                isLoading={isDownloading}
                onClick={() => handleQuickDownload('full')}
                icon={<DownloadCloud className="w-4 h-4" />}
              >
                Download all (.vcf)
              </Button>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => setMemberScreen('downloads')}
              className="text-xs font-semibold text-[#9D7B43] dark:text-[#C5A15B] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View download history &amp; device setup instructions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Invite Link Card */}
        <div className="rounded-2xl border p-6 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              {t('dashReferralCardTitle')}
            </h2>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-0.5">
              Share your link with colleagues and creators who want to join.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B6357] dark:text-[#A8A196]">
              <span>Your personal invite link</span>
              <span className="font-mono font-semibold text-[#9D7B43] dark:text-[#C5A15B]">
                Code: {activeMember.referralCode}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg p-2 font-mono text-xs">
              <span className="truncate flex-1 text-[#1C1915] dark:text-[#F5F0E6]">
                https://contactgaining.community/join?ref={activeMember.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#C5A15B] text-[#0B0A08] hover:bg-[#D4B36D] transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-[#6B6357] dark:text-[#A8A196] space-y-1">
            <p>• Only people who voluntarily sign up will appear in the directory.</p>
            <p>• You never receive your own number in download files.</p>
          </div>
        </div>
      </div>

      {/* Status views reminder */}
      <WhatsAppStatusNotice />
    </div>
  );
};
