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
import { Modal } from '../common/Modal';
import {
  CalendarCheck,
  Plus,
  Layers,
  FileCheck2,
  CheckCircle2,
  DownloadCloud,
} from 'lucide-react';

export const ReleaseManagement: React.FC = () => {
  const { addToast } = useApp();
  const [releases, setReleases] = useState<ContactRelease[]>(mockDataService.getReleases());
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Release Form
  const [title, setTitle] = useState('');
  const [incrementalCount, setIncrementalCount] = useState(35);
  const [descEn, setDescEn] = useState('');
  const [descFr, setDescFr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newRelease = mockDataService.createRelease({
        releaseTitle: title || `Weekly Release #0${releases.length + 1} — November 2026`,
        incrementalNewContacts: Number(incrementalCount) || 30,
        descriptionEn: descEn || 'Sanitized incremental cohort with verified international contacts.',
        descriptionFr: descFr || 'Cohorte incrémentale assainie avec des contacts internationaux vérifiés.',
      });

      setReleases(mockDataService.getReleases());
      setIsSubmitting(false);
      setCreateModalOpen(false);
      setTitle('');
      addToast(`Published Contact Release #${newRelease.releaseNumber}!`, 'success');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            4. Contact Release Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish weekly sanitized contact bundles in RFC 2426 vCard format with deduplication.
          </p>
        </div>
        <Button
          variant="emerald"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Release Batch
        </Button>
      </div>

      {/* Release Cycle Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Releases</span>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {releases.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Scheduled weekly cycle</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Latest Published</span>
          <div className="text-sm font-bold text-teal-300 mt-1 truncate">
            {releases[0]?.releaseTitle}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            +{releases[0]?.incrementalNewContacts} incremental contacts
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Deduplication Invariant</span>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>0 Duplicate Numbers Allowed</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">E.164 unique primary key</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/50">
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Title &amp; Notes</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-right">Incremental</th>
                <th className="py-3 px-4 text-right">Total Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {releases.map(r => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">
                    #{r.releaseNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{r.releaseTitle}</span>
                    <span className="text-[11px] text-slate-400">{r.descriptionEn}</span>
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap text-slate-400">
                    {new Date(r.publishedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-teal-300">
                    +{r.incrementalNewContacts}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                    {r.totalEligibleContacts}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{r.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500">
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
        <form onSubmit={handleCreateRelease} className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Release Batch Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={`Weekly Release #0${releases.length + 1} — November 2026`}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Incremental New Contacts Count *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={incrementalCount}
              onChange={e => setIncrementalCount(Number(e.target.value))}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Automatically filters out duplicate phone numbers and withdrawn participants.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description (English)
            </label>
            <input
              type="text"
              value={descEn}
              onChange={e => setDescEn(e.target.value)}
              placeholder="e.g. 35 newly verified opt-in members from 10 countries"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description (Français)
            </label>
            <input
              type="text"
              value={descFr}
              onChange={e => setDescFr(e.target.value)}
              placeholder="ex: 35 nouveaux membres vérifiés de 10 pays"
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="sm" isLoading={isSubmitting}>
              Publish Release Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
