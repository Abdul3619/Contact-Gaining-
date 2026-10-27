/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { ContactRelease } from '../../types';
import { Button } from '../common/Button';
import { WhatsAppStatusNotice, ContactPermanenceNotice } from '../common/Disclaimers';
import {
  DownloadCloud,
  Smartphone,
  Apple,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

export const DownloadCentre: React.FC = () => {
  const { activeMember, t, addToast } = useApp();

  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulateErrorToggle, setSimulateErrorToggle] = useState(false);
  const [showDevOptions, setShowDevOptions] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'instructions_android' | 'instructions_ios'>('instructions_android');

  const releases = mockDataService.getReleases();
  const currentRelease = releases.find(r => r.id === selectedReleaseId) || releases[0];

  const handleDownload = (release: ContactRelease, type: 'full' | 'incremental') => {
    setSelectedReleaseId(release.id);
    setDownloadState('loading');
    setDownloadProgress(25);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);

      const res = mockDataService.simulateDownload(release.id, type, simulateErrorToggle);

      if (res.success) {
        setDownloadProgress(100);
        setDownloadState('success');
        addToast(
          'Contact file (.vcf) downloaded. Ready to import into your contacts.',
          'success'
        );
      } else {
        setDownloadState('error');
        setErrorMessage(res.error || 'Download failed. Please try again.');
      }
    }, 700);
  };

  const handleResetState = () => {
    setDownloadState('idle');
    setDownloadProgress(0);
    setErrorMessage('');
  };

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

          <button
            onClick={() => setShowDevOptions(!showDevOptions)}
            className="text-xs text-[#6B6357] dark:text-[#81796D] hover:text-[#1C1915] dark:hover:text-[#F5F0E6] flex items-center gap-1 cursor-pointer self-start md:self-auto"
          >
            <span>Preview options</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDevOptions ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Simulation Controls for Prototype Testing */}
        {showDevOptions && (
          <div className="mt-4 pt-4 border-t border-[#E5DFD5] dark:border-[#2B261F] flex flex-wrap items-center gap-4 text-xs text-[#6B6357] dark:text-[#A8A196]">
            <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">Test scenario:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateErrorToggle}
                onChange={e => setSimulateErrorToggle(e.target.checked)}
                className="rounded text-[#C5A15B] focus:ring-[#C5A15B]"
              />
              <span>Simulate connection error</span>
            </label>
            <button
              onClick={handleResetState}
              className="text-xs text-[#9D7B43] dark:text-[#C5A15B] hover:underline"
            >
              Reset download state
            </button>
          </div>
        )}
      </div>

      {/* Progress & Error States */}
      {downloadState === 'loading' && (
        <div className="rounded-2xl border p-6 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-center space-y-3">
          <h3 className="font-semibold text-sm text-[#1C1915] dark:text-[#F5F0E6]">
            Preparing your contact file...
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
                The .vcf file has been generated. Open the file on your device to import contacts.
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
        {/* Newly Added Members */}
        <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#9D7B43] dark:text-[#C5A15B] uppercase tracking-wider mb-1">
              Recommended
            </div>
            <h2 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              Newly joined members
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1 leading-relaxed">
              Download only members who have joined since the last release. Fast and easy to add without re-importing people you already have.
            </p>

            <div className="mt-5 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">New contacts in batch:</span>
                <span className="font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6]">
                  +{currentRelease?.incrementalNewContacts || 48}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">File format:</span>
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
            isLoading={downloadState === 'loading' && selectedReleaseId === currentRelease.id}
            onClick={() => handleDownload(currentRelease, 'incremental')}
            icon={<DownloadCloud className="w-5 h-5 text-black" />}
          >
            {t('dlIncrementalBtn')}
          </Button>
        </div>

        {/* Complete Directory */}
        <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#6B6357] dark:text-[#A8A196] uppercase tracking-wider mb-1">
              Full directory
            </div>
            <h2 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">
              All active community contacts
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1 leading-relaxed">
              A single archive with all active community members across all countries. Ideal if you are setting up a new phone or importing for the first time.
            </p>

            <div className="mt-5 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Total contacts:</span>
                <span className="font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6]">
                  {currentRelease?.totalEligibleContacts || 48}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Deduplication:</span>
                <span className="text-[#1C1915] dark:text-[#F5F0E6]">Zero duplicate numbers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6357] dark:text-[#A8A196]">Self-exclusion:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Your number is excluded</span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="outline"
            isLoading={downloadState === 'loading' && selectedReleaseId === currentRelease.id}
            onClick={() => handleDownload(currentRelease, 'full')}
            icon={<DownloadCloud className="w-5 h-5" />}
          >
            {t('dlFullBtn')}
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
