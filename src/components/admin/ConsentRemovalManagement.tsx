/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { supabaseService } from '../../services/supabaseService';
import { Badge } from '../common/Badge';
import { CheckCircle2, Database, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

export const ConsentRemovalManagement: React.FC = () => {
  const { allMembers, refreshData, addToast, isBackendConfigured } = useApp();
  const [liveWithdrawals, setLiveWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    if (isBackendConfigured) {
      const records = await supabaseService.getConsentWithdrawalRecords();
      setLiveWithdrawals(records);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [isBackendConfigured]);

  const removalRequests = (liveWithdrawals.length > 0)
    ? liveWithdrawals.map(w => ({
        id: w.memberId,
        displayName: `Member ${w.memberId.slice(0, 8)}`,
        normalizedE164: 'Hidden (Withdrawn)',
        consent: w,
      }))
    : allMembers.filter(
        m => !m.consent.consentedToExport || m.eligibility === 'withdrawn'
      );

  const handleReactivate = async (memberId: string) => {
    if (isBackendConfigured) {
      await supabaseService.recordConsentChange(memberId, true, undefined);
    }
    mockDataService.toggleMemberEligibility(memberId, 'eligible');
    const idx = allMembers.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      allMembers[idx].consent.consentedToExport = true;
      allMembers[idx].consent.revokedAt = undefined;
    }
    refreshData();
    fetchWithdrawals();
    addToast('Member consent reinstated to eligible status.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
          Consent &amp; Removal Requests
        </h1>
        <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
          Review queue of participants requesting contact withdrawal or removal from future release distributions.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Total Withdrawn</span>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {removalRequests.length}
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Excluded from all future exports</span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Export Sanitization</span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Automated Scrub Active</span>
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Withdrawn numbers purged at generation</span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Compliance Standard</span>
          <div className="text-sm font-bold text-[#9D7B43] dark:text-[#C5A15B] mt-2">
            GDPR &amp; International Opt-Out
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Immutable audit log maintained</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Phone (E.164)</th>
                <th className="py-3 px-4">Reason for Withdrawal</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Exclusion Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6]">
              {removalRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#736C61] dark:text-[#81796D]">
                    No active removal or withdrawal requests.
                  </td>
                </tr>
              ) : (
                removalRequests.map(m => (
                  <tr key={m.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#25221D] dark:text-[#F5F0E6]">
                      {m.displayName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#9D7B43] dark:text-[#C5A15B]">
                      {m.normalizedE164}
                    </td>
                    <td className="py-3 px-4 text-[#736C61] dark:text-[#A89F91]">
                      {m.consent.revocationReason || 'Voluntary removal requested via profile'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#736C61] dark:text-[#81796D]">
                      {m.consent.revokedAt ? new Date(m.consent.revokedAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="danger">Excluded from Releases</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReactivate(m.id)}
                        className="px-2.5 py-1 text-xs rounded-md bg-[#EDE8DE] dark:bg-[#1D1A15] hover:bg-[#DFD7C8] dark:hover:bg-[#2B261F] text-[#9D7B43] dark:text-[#C5A15B] border border-[#DFD7C8] dark:border-[#2B261F] transition-colors cursor-pointer font-medium"
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
