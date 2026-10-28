/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { WhatsAppStatusNotice, ContactPermanenceNotice } from '../common/Disclaimers';
import {
  DownloadCloud,
  Smartphone,
  Apple,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  PlusCircle,
} from 'lucide-react';

export const DownloadCentre: React.FC = () => {
  const {
    activeMember,
    t,
    addToast,
    allocatedContacts,
    downloadAllocatedVcfFile,
    allocateNewContacts,
  } = useApp();

  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAllocating, setIsAllocating] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions_android' | 'instructions_ios'>('instructions_android');

  const releases = mockDataService.getReleases();
  const currentRelease = releases[0];

  const handleDownload = async () => {
    setDownloadState('loading');
    setDownloadProgress(25);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 85) return 85;
        return prev + 20;
      });
    }, 120);

    const res = await downloadAllocatedVcfFile();
    clearInterval(interval);

    if (res.success) {
      setDownloadProgress(100);
      setDownloadState('success');
    } else {
      setDownloadState('error');
      setErrorMessage(res.error || 'Download failed. Please try again.');
    }
  };

  const handleRequestAllocation = async () => {
    setIsAllocating(true);
    const res = await allocateNewContacts(20);
    setIsAllocating(false);

    if (res.error) {
      addToast(res.error, 'error');
    } else if (res.count === 0) {
      addToast('No new unallocated contacts are available in this batch. Check back as new members register!', 'info');
    } else {
      addToast(`Allocated ${res.count} new verified contacts to your directory.`, 'success');
    }
  };

  const handleResetState = () => {
    setDownloadState('idle');
    setDownloadProgress(0);
    setErrorMessage('');
  };

  // Contacts ready to export (excluding self)
  const eligibleCount = allocatedContacts.filter(
    c => c.normalizedE164 !== activeMember.normalizedE164 && c.eligibility === 'eligible' && c.consent.consentedToExport
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-[#1C1915] dark:text-[#F5F0E6]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9D7B43] dark:text-[#C5A15B] mb-1">
              Standard vCard (.vcf) format
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('dlTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1 max-w-2xl leading-relaxed">
              {t('dlSubhead')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isAllocating}
              onClick={handleRequestAllocation}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              {isAllocating ? 'Allocating...' : 'Request New Allocation'}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress / Status Indicators */}
      {downloadState === 'loading' && (
        <div className="rounded-2xl border p-6 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C5A15B] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-semibold text-sm text-[#1C1915] dark:text-[#F5F0E6]">
            Generating contact export file...
          </h3>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196]">
            Packaging verified member numbers and formatting vCard records.
          </p>
          <div className="w-full max-w-md mx-auto bg-[#F0ECE1] dark:bg-[#1D1A15] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#C5A15B] h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {downloadState === 'error' && (
        <div className="rounded-2xl border p-6 transition-colors bg-[#FDF2F2] dark:bg-[#1A1110] border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-rose-900 dark:text-rose-200">
                Unable to complete download
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                {errorMessage}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetState}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try again
          </Button>
        </div>
      )}

      {downloadState === 'success' && (
        <div className="rounded-2xl border p-6 transition-colors bg-[#F2F9F5] dark:bg-[#0E1712] border-emerald-200 dark:border-emerald-900/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">
                Download ready
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                The .vcf file has been generated and saved to your downloads. Open the file on your device to import contacts.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="gold"
            onClick={handleResetState}
          >
            Done
          </Button>
        </div>
      )}

      {/* Main Download Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allocated Active Contacts */}
        <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#9D7B43] dark:text-[#C5A15B] uppercase tracking-wider mb-1">
              Your Allocated Contacts
            </div>
            <h2 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              Verified Member File
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1 leading-relaxed">
              Download your allocated contacts who have currently given explicit consent. You can re-download this file anytime without consuming extra allocation allowance.
            </p>

            <div className="mt-5 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Eligible contacts:</span>
                <span className="font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6]">
                  {eligibleCount} members
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Format:</span>
                <span className="font-mono text-[#1C1915] dark:text-[#F5F0E6]">vCard 3.0 (.vcf)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Self-exclusion:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Your number is excluded</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="gold"
            isLoading={downloadState === 'loading'}
            onClick={handleDownload}
            icon={<DownloadCloud className="w-5 h-5 text-black" />}
          >
            Download Allocated Contacts ({eligibleCount})
          </Button>
        </div>

        {/* Directory Status Card */}
        <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196] uppercase tracking-wider mb-1">
              Active Batch
            </div>
            <h2 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              {currentRelease.releaseTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1 leading-relaxed">
              Contact releases occur in organized batches. All contacts are filtered to remove duplicates, exclude withdrawn profiles, and maintain mutual exchange standards.
            </p>

            <div className="mt-5 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Batch Release:</span>
                <span className="font-mono text-[#1C1915] dark:text-[#F5F0E6]">#{currentRelease.releaseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Re-export Policy:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Free re-exports anytime</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Consent Check:</span>
                <span className="text-[#1C1915] dark:text-[#F5F0E6]">Verified before each export</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="outline"
            disabled={isAllocating}
            onClick={handleRequestAllocation}
            icon={<UserCheck className="w-5 h-5" />}
          >
            {isAllocating ? 'Requesting...' : 'Request Next 20 Contacts'}
          </Button>
        </div>
      </div>

      {/* Device Import Guide */}
      <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#1C1915] dark:text-[#F5F0E6]">
            How to import contacts on your phone
          </h2>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-0.5">
            Follow these simple steps after downloading the .vcf file.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#E5DFD5] dark:border-[#2B261F] pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('instructions_android')}
            className={`pb-2 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-2.5 ${
              activeTab === 'instructions_android'
                ? 'border-[#9D7B43] dark:border-[#C5A15B] text-[#9D7B43] dark:text-[#C5A15B]'
                : 'border-transparent text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#F5F0E6]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android / Google Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions_ios')}
            className={`pb-2 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 -mb-2.5 ${
              activeTab === 'instructions_ios'
                ? 'border-[#9D7B43] dark:border-[#C5A15B] text-[#9D7B43] dark:text-[#C5A15B]'
                : 'border-transparent text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#F5F0E6]'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / Apple Contacts</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] text-xs sm:text-sm text-[#1C1915] dark:text-[#F5F0E6] leading-relaxed">
          {activeTab === 'instructions_android' ? (
            <div className="space-y-2">
              <p><strong>Step 1:</strong> Tap the downloaded file in your browser or Downloads folder.</p>
              <p><strong>Step 2:</strong> Choose to open with &quot;Contacts&quot; or &quot;Google Contacts&quot;.</p>
              <p><strong>Step 3:</strong> Select your Google account to save the contacts.</p>
              <p><strong>Step 4:</strong> Open WhatsApp, start a new chat, and tap the three dots at the top right to select &quot;Refresh&quot;.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Step 1:</strong> Open the downloaded file from Safari or the Files app.</p>
              <p><strong>Step 2:</strong> Tap &quot;Add All Contacts&quot; at the top of the contact preview.</p>
              <p><strong>Step 3:</strong> Open WhatsApp and pull down on your chat list to refresh your contacts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimers & Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WhatsAppStatusNotice />
        <ContactPermanenceNotice />
      </div>
    </div>
  );
};
