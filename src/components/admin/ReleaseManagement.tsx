/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { supabaseService } from '../../services/supabaseService';
import { ContactRelease } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Plus,
  Layers,
  FileCheck2,
  CheckCircle2,
  DownloadCloud,
} from 'lucide-react';

export const ReleaseManagement: React.FC = () => {
  const { addToast, isBackendConfigured } = useApp();
  const [releases, setReleases] = useState<ContactRelease[]>(mockDataService.getReleases());
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Release Form
  const [title, setTitle] = useState('');
  const [incrementalCount, setIncrementalCount] = useState(48);
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReleases = async () => {
    if (isBackendConfigured) {
      const liveReleases = await supabaseService.getReleases();
      if (liveReleases.length > 0) {
        setReleases(liveReleases);
      }
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [isBackendConfigured]);

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const count = Number(incrementalCount) || 48;
    if (isBackendConfigured) {
      const res = await supabaseService.createReleaseBatch(count, 'published');
      if (!res.success) {
        addToast(`Database notice: ${res.error}. Batch registered in session.`, 'warning');
      }
    }

    const newRelease = mockDataService.createRelease({
      releaseTitle: title || `Cohort Release #0${releases.length + 1} — Community Exchange`,
      incrementalNewContacts: count,
      descriptionEn: descEn || 'Sanitized incremental cohort with verified international contacts.',
      descriptionFr: descFr || 'Cohorte incrémentale assainie avec des contacts internationaux vérifiés.',
    });

    setReleases(mockDataService.getReleases());
    fetchReleases();
    setIsSubmitting(false);
    setCreateModalOpen(false);
    setTitle('');
    addToast(`Published Contact Release #${newRelease.releaseNumber}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
            Contact Release Management
          </h1>
          <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
            Publish weekly sanitized contact bundles in RFC 2426 vCard format with deduplication.
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Release Batch
        </Button>
      </div>

      {/* Release Cycle Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Total Releases</span>
          <div className="text-2xl font-bold font-mono text-[#25221D] dark:text-[#F5F0E6] mt-1 tabular-nums">
            {releases.length}
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Scheduled cohort cycle</span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Latest Published</span>
          <div className="text-sm font-bold text-[#9D7B43] dark:text-[#C5A15B] mt-1 truncate">
            {releases[0]?.releaseTitle}
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">
            +{releases[0]?.incrementalNewContacts} incremental contacts
          </span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Deduplication Invariant</span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>0 Duplicate Numbers Allowed</span>
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">E.164 unique primary key</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Title &amp; Notes</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-right">Incremental</th>
                <th className="py-3 px-4 text-right">Total Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6]">
              {releases.map(r => (
                <tr key={r.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#9D7B43] dark:text-[#C5A15B]">
                    #{r.releaseNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block">{r.releaseTitle}</span>
                    <span className="text-[11px] text-[#736C61] dark:text-[#A89F91]">{r.descriptionEn}</span>
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap text-[#736C61] dark:text-[#A89F91]">
                    {new Date(r.publishedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[#9D7B43] dark:text-[#C5A15B]">
                    +{r.incrementalNewContacts}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[#736C61] dark:text-[#A89F91]">
                    {r.totalEligibleContacts}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="gold">{r.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-[#736C61] dark:text-[#81796D]">
                    {r.hashChecksum}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Release */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publish New Contact Release Batch"
        description="Bundle newly consented participants into standard vCard export format."
      >
        <form onSubmit={handleCreateRelease} className="space-y-4 text-xs text-[#25221D] dark:text-[#F5F0E6]">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Release Batch Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`Cohort Release #0${releases.length + 1} — Community Exchange`}
              className="w-full p-2.5 text-xs bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden focus:border-[#C5A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Incremental New Contacts Count *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={incrementalCount}
              onChange={e => setIncrementalCount(Number(e.target.value))}
              className="w-full p-2.5 text-xs bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden font-mono focus:border-[#C5A15B]"
            />
            <p className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1">
              Automatically filters out duplicate phone numbers and withdrawn participants.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Description (English)
            </label>
            <input
              type="text"
              value={descEn}
              onChange={e => setDescEn(e.target.value)}
              placeholder="e.g. 48 newly verified opt-in members from 10 countries"
              className="w-full p-2.5 text-xs bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden focus:border-[#C5A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Description (Français)
            </label>
            <input
              type="text"
              value={descFr}
              onChange={e => setDescFr(e.target.value)}
              placeholder="ex: 48 nouveaux membres vérifiés de 10 pays"
              className="w-full p-2.5 text-xs bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden focus:border-[#C5A15B]"
            />
          </div>

          <div className="pt-3 border-t border-[#DFD7C8] dark:border-[#2B261F] flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSubmitting}>
              Publish Release Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
