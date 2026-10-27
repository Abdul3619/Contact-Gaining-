/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Share2, Users, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReferralManagement: React.FC = () => {
  const { allMembers, addToast } = useApp();
  const [fraudFilterActive, setFraudFilterActive] = useState(true);

  // Sort members by total referrals descending
  const sortedReferrers = [...allMembers].sort((a, b) => b.totalReferrals - a.totalReferrals);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            7. Referral Program Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor member invitation channels, audit referral codes, and verify non-fraudulent growth.
          </p>
        </div>
        <Badge variant="neutral">Demonstration Audit</Badge>
      </div>

      {/* Rules & Fraud Guard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Top Community Advocate</span>
          <div className="text-base font-bold text-teal-300 mt-1 truncate">
            {sortedReferrers[0]?.displayName}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {sortedReferrers[0]?.totalReferrals} verified referrals ({sortedReferrers[0]?.referralCode})
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Anti-Fraud Guard</span>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Duplicate E.164 Disqualification</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Prevents artificial ring-looping</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">Phase 2 Reward Rule</span>
          <div className="text-sm font-bold text-white mt-1">
            Tier Unlock at 5 Invites
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">+25 incremental contacts/week</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Advocate Leaderboard &amp; Codes
          </h3>
          <span className="text-xs text-slate-500 font-mono">{sortedReferrers.length} participants tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/60">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-right">Attributed Referrals</th>
                <th className="py-3 px-4 text-center">Fraud Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedReferrers.map((m, idx) => (
                <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {m.displayName}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-300">
                    {m.referralCode}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {m.countryCode}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    {m.totalReferrals}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Clean</span>
                    </span>
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
