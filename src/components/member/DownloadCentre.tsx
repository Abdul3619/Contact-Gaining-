/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { ContactRelease } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WhatsAppStatusNotice, ContactPermanenceNotice } from '../common/Disclaimers';
import {
  DownloadCloud,
  FileText,
  Smartphone,
  Apple,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const DownloadCentre: React.FC = () => {
  const { activeMember, t, addToast } = useApp();

  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulateErrorToggle, setSimulateErrorToggle] = useState(false);
  const [simulateEmptyToggle, setSimulateEmptyToggle] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'instructions_android' | 'instructions_ios'>('instructions_android');

  const releases = mockDataService.getReleases();
  const currentRelease = releases.find(r => r.id === selectedReleaseId) || releases[0];

  const handleDownload = (release: ContactRelease, type: 'full' | 'incremental') => {
    setSelectedReleaseId(release.id);
    setDownloadState('loading');
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);

      const res = mockDataService.simulateDownload(release.id, type, simulateErrorToggle);

      if (res.success) {
        setDownloadProgress(100);
        setDownloadState('success');
        addToast(
          `Export complete: ${release.releaseTitle} (${res.record?.contactCount} demo contacts).`,
          'success'
        );
      } else {
        setDownloadState('error');
        setErrorMessage(res.error || 'Simulated download error occurred.');
      }
    }, 900);
  };

  const handleResetState = () => {
    setDownloadState('idle');
    setDownloadProgress(0);
    setErrorMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Standard RFC 2426 vCard 3.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('dlTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {t('dlSubhead')}
            </p>
          </div>

          {/* Test State Controls */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Test States:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateErrorToggle}
                onChange={e => setSimulateErrorToggle(e.target.checked)}
                className="rounded border-slate-300 text-rose-600"
              />
              <span>Force Error</span>
            </label>
            <span className="text-slate-300">|</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateEmptyToggle}
                onChange={e => setSimulateEmptyToggle(e.target.checked)}
                className="rounded border-slate-300 text-slate-600"
              />
              <span>Empty List</span>
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Download Feedback States */}
      {downloadState === 'loading' && (
        <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-md text-center space-y-4 animate-in fade-in duration-150">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <DownloadCloud className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Generating Contact Archive...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Building sanitized vCard 3.0 records for {currentRelease.releaseTitle}
            </p>
          </div>
          <div className="max-w-md mx-auto w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-teal-600 h-2.5 transition-all duration-200"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400">{downloadProgress}% completed</span>
        </div>
      )}

      {downloadState === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-950 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">Download Error Simulated</h3>
              <p className="text-xs text-rose-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Button size="sm" variant="danger" onClick={handleResetState}>
              Dismiss &amp; Retry
            </Button>
            <span className="text-[11px] text-rose-700">
              Tip: Uncheck "Force Error" in test controls to test successful completion.
            </span>
          </div>
        </div>
      )}

      {downloadState === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-950 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold">{t('dlSuccessToast')}</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Safe demonstration .vcf file was dispatched to your browser downloads.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleResetState}>
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Simulated Empty State */}
      {simulateEmptyToggle ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Releases Currently Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All contacts in your queue have already been exported, or the next weekly release has not yet been finalized.
          </p>
          <Button size="sm" variant="secondary" onClick={() => setSimulateEmptyToggle(false)}>
            Clear Empty Filter
          </Button>
        </div>
      ) : (
        /* Primary Download Action Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Incremental Download */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  Recommended Cadence
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {(currentRelease.fileSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Download Incremental Contacts
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Contains only the <strong>{currentRelease.incrementalNewContacts} new participants</strong> added in {currentRelease.releaseTitle}. Importing this file will avoid duplicate contact entries in your phone.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-600 space-y-1 mb-6">
                <div className="flex justify-between">
                  <span>Release Batch:</span>
                  <span className="font-semibold text-slate-900">#{currentRelease.releaseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Published:</span>
                  <span>{new Date(currentRelease.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checksum:</span>
                  <span className="text-[10px] text-slate-400">{currentRelease.hashChecksum}</span>
                </div>
              </div>
            </div>

            <Button
              variant="emerald"
              size="lg"
              className="w-full"
              isLoading={downloadState === 'loading'}
              onClick={() => handleDownload(currentRelease, 'incremental')}
              icon={<DownloadCloud className="w-5 h-5" />}
            >
              {t('dlIncrementalBtn')}
            </Button>
          </div>

          {/* Full List Archive Download */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Archive Restore
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {((currentRelease.totalEligibleContacts * 1250) / 1024).toFixed(1)} KB
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Download Full Eligible Cohort
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Exports all <strong>{currentRelease.totalEligibleContacts} verified opt-in members</strong> currently in the directory. Use this if you are a brand new member or setting up a replacement phone.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono text-slate-600 space-y-1 mb-6">
                <div className="flex justify-between">
                  <span>Scope:</span>
                  <span className="font-semibold text-slate-900">Worldwide (All Regions)</span>
                </div>
                <div className="flex justify-between">
                  <span>Deduplication:</span>
                  <span className="text-emerald-700 font-semibold">100% Unique E.164</span>
                </div>
                <div className="flex justify-between">
                  <span>Demonstration Limit:</span>
                  <span>48 Sample Cards</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              isLoading={downloadState === 'loading'}
              onClick={() => handleDownload(currentRelease, 'full')}
              icon={<Layers className="w-5 h-5" />}
            >
              {t('dlFullBtn')}
            </Button>
          </div>
        </div>
      )}

      {/* Disclaimers Strip */}
      <WhatsAppStatusNotice />

      {/* Step-by-Step VCF Import Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          How to Import .VCF Contact Files into Your Phone
        </h3>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-sm mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('instructions_android')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'instructions_android' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android (Samsung / Tecno / Pixel)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('instructions_ios')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'instructions_ios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-900" />
            <span>iPhone (iOS)</span>
          </button>
        </div>

        {activeTab === 'instructions_android' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">1</span>
              <strong className="block text-slate-900 font-semibold mb-1">Open Downloaded File</strong>
              <p className="text-slate-600 leading-relaxed">
                Swipe down to open notification drawer or open Chrome "Downloads", then tap the downloaded <code>.vcf</code> file.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">2</span>
              <strong className="block text-slate-900 font-semibold mb-1">Select Contacts App</strong>
              <p className="text-slate-600 leading-relaxed">
                When prompted, select <strong>Contacts</strong> or <strong>Google Contacts</strong>. Choose your Google account as the save destination.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">3</span>
              <strong className="block text-slate-900 font-semibold mb-1">Refresh WhatsApp</strong>
              <p className="text-slate-600 leading-relaxed">
                Open WhatsApp, tap the new chat icon (speech bubble at bottom right), tap the 3 dots at top right, and choose <strong>Refresh</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">1</span>
              <strong className="block text-slate-900 font-semibold mb-1">Open in Safari or Files</strong>
              <p className="text-slate-600 leading-relaxed">
                Once downloaded in Safari, tap the download arrow in the address bar and select the <code>.vcf</code> contact card package.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">2</span>
              <strong className="block text-slate-900 font-semibold mb-1">Tap "Add All Contacts"</strong>
              <p className="text-slate-600 leading-relaxed">
                iOS will show the contact bundle preview. Tap <strong>Add All [X] Contacts</strong> at the top of the screen to save them to iCloud/iPhone.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">3</span>
              <strong className="block text-slate-900 font-semibold mb-1">Sync With WhatsApp</strong>
              <p className="text-slate-600 leading-relaxed">
                Open WhatsApp &gt; Chats &gt; New Chat. iOS automatically indexes the new contacts within seconds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Historical Release Archive Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          All Published Release Batches
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Batch</th>
                <th className="py-3 px-3">Release Title</th>
                <th className="py-3 px-3">Published Date</th>
                <th className="py-3 px-3 text-right">New Contacts</th>
                <th className="py-3 px-3 text-right">Total Eligible</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {releases.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                    #{r.releaseNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{r.releaseTitle}</span>
                    <span className="text-[11px] text-slate-400">{r.descriptionEn}</span>
                  </td>
                  <td className="py-3 px-3 font-mono whitespace-nowrap">
                    {new Date(r.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-teal-700">
                    +{r.incrementalNewContacts}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {r.totalEligibleContacts}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(r, 'incremental')}
                    >
                      Export .vcf
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
