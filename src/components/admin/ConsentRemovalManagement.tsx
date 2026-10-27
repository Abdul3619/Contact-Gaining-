/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FileCheck2,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ConsentRemovalManagement: React.FC = () => {
  const { allMembers, refreshData, addToast } = useApp();

  const removalRequests = allMembers.filter(
    m => !m.consent.consentedToExport || m.eligibility === 'withdrawn'
  );

  const handleReactivate = (memberId: string) => {
    mockDataService.toggleMemberEligibility(memberId, 'eligible');
    const idx = allMembers.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      allMembers[idx].consent.consentedToExport = true;
      allMembers[idx].consent.revokedAt = undefined;
    }
    refreshData();
    addToast('Member consent reinstated to eligible status.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          3. Consent &amp; Removal Requests
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review queue of participants requesting contact withdrawal or removal from future release distributions.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Withdrawn</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
            {removalRequests.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Excluded from all future exports</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Export Sanitization</span>
          <div className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Automated Scrub Active</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Withdrawn numbers purged at generation</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Compliance Standard</span>
          <div className="text-sm font-bold text-teal-300 mt-2">
            GDPR &amp; International Opt-Out
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Immutable audit log maintained</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/50">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Phone (E.164)</th>
                <th className="py-3 px-4">Reason for Withdrawal</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Exclusion Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {removalRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No active removal or withdrawal requests.
                  </td>
                </tr>
              ) : (
                removalRequests.map(m => (
                  <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {m.displayName}
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-300">
                      {m.normalizedE164}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {m.consent.revocationReason || 'Voluntary removal requested via profile'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {m.consent.revokedAt ? new Date(m.consent.revokedAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="danger">Excluded from Releases</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReactivate(m.id)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-teal-300 transition-colors cursor-pointer"
                      >
                        Reinstate Consent
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
