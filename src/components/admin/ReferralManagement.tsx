/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Share2, Users, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReferralManagement: React.FC = () => {
  const { allMembers } = useApp();
  const [fraudFilterActive] = useState(true);

  // Sort members by total referrals descending
  const sortedReferrers = [...allMembers].sort((a, b) => b.totalReferrals - a.totalReferrals);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
            Referral Program Operations
          </h1>
          <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
            Monitor member invitation channels, audit referral codes, and verify non-fraudulent growth.
          </p>
        </div>
        <Badge variant="gold">Demonstration Audit</Badge>
      </div>

      {/* Rules & Fraud Guard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Top Community Advocate</span>
          <div className="text-base font-bold text-[#9D7B43] dark:text-[#C5A15B] mt-1 truncate">
            {sortedReferrers[0]?.displayName}
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] font-mono mt-1 block">
            {sortedReferrers[0]?.totalReferrals} verified referrals ({sortedReferrers[0]?.referralCode})
          </span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Anti-Fraud Guard</span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Duplicate E.164 Disqualification</span>
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Prevents artificial ring-looping</span>
        </div>

        <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-[#736C61] dark:text-[#81796D] uppercase">Future Milestone Incentive</span>
          <div className="text-sm font-bold text-[#25221D] dark:text-[#F5F0E6] mt-1">
            Tier Recognition at 5 Invites
          </div>
          <span className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1 block">Priority community badge</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[#DFD7C8] dark:border-[#2B261F] bg-[#EDE8DE]/40 dark:bg-[#1D1A15]/40 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#736C61] dark:text-[#A89F91]">
            Advocate Leaderboard &amp; Codes
          </h3>
          <span className="text-xs text-[#736C61] dark:text-[#81796D] font-mono">{sortedReferrers.length} participants tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-right">Attributed Referrals</th>
                <th className="py-3 px-4 text-center">Fraud Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6]">
              {sortedReferrers.map((m, idx) => (
                <tr key={m.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#736C61] dark:text-[#81796D]">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#25221D] dark:text-[#F5F0E6]">
                    {m.displayName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#9D7B43] dark:text-[#C5A15B]">
                    {m.referralCode}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#736C61] dark:text-[#A89F91]">
                    {m.countryCode}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#25221D] dark:text-[#F5F0E6] tabular-nums">
                    {m.totalReferrals}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
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
