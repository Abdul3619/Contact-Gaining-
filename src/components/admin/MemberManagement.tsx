/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Member, MemberEligibility } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  MoreVertical,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const MemberManagement: React.FC = () => {
  const { allMembers, refreshData, addToast } = useApp();

  const [query, setQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | MemberEligibility>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = allMembers.filter(m => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      m.displayName.toLowerCase().includes(q) ||
      m.countryCode.toLowerCase().includes(q) ||
      m.normalizedE164.includes(q) ||
      m.referralCode.toLowerCase().includes(q);

    const matchesFilter = eligibilityFilter === 'all' || m.eligibility === eligibilityFilter;
    return matchesQuery && matchesFilter;
  });

  const handleStatusChange = (member: Member, newStatus: MemberEligibility) => {
    mockDataService.toggleMemberEligibility(member.id, newStatus);
    refreshData();
    if (selectedMember && selectedMember.id === member.id) {
      setSelectedMember({ ...selectedMember, eligibility: newStatus });
    }
    addToast(`Updated ${member.displayName} to "${newStatus}".`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
            Member Management
          </h1>
          <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
            Search, inspect consent records, and toggle eligibility status across voluntary community participants.
          </p>
        </div>
        <Badge variant="gold">Demonstration Directory</Badge>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#FFFCF6] dark:bg-[#15130F] p-3 rounded-xl border border-[#DFD7C8] dark:border-[#2B261F] shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#736C61] dark:text-[#81796D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, country, normalized phone, or referral code..."
            className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg pl-9 pr-3 py-2 text-xs text-[#25221D] dark:text-[#F5F0E6] placeholder:text-[#81796D] outline-hidden focus:border-[#C5A15B] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#736C61] dark:text-[#81796D] shrink-0" />
          <select
            value={eligibilityFilter}
            onChange={e => setEligibilityFilter(e.target.value as any)}
            className="bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg px-3 py-2 text-xs text-[#25221D] dark:text-[#F5F0E6] outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses ({allMembers.length})</option>
            <option value="eligible">Eligible Only</option>
            <option value="under_review">Under Review</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Normalized Phone (E.164)</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4">Eligibility</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#736C61] dark:text-[#81796D]">
                    No matching members found in sample dataset.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block">{m.displayName}</span>
                      <span className="text-[10px] text-[#736C61] dark:text-[#81796D] font-mono">Ref: {m.referralCode}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[#736C61] dark:text-[#A89F91]">{m.countryCode}</span>
                    </td>
                    <td className="py-3 px-4 font-mono whitespace-nowrap text-[#9D7B43] dark:text-[#C5A15B]">
                      {m.normalizedE164}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {m.consent.consentedToExport ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">✓ Consented</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-medium text-[11px]">✗ Withdrawn</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          m.eligibility === 'eligible'
                            ? 'gold'
                            : m.eligibility === 'withdrawn'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {m.eligibility}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-[#736C61] dark:text-[#A89F91]">
                      {m.downloadCount}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedMember(m)}
                        className="px-2.5 py-1 rounded-md bg-[#EDE8DE] dark:bg-[#1D1A15] hover:bg-[#DFD7C8] dark:hover:bg-[#2B261F] text-[#9D7B43] dark:text-[#C5A15B] border border-[#DFD7C8] dark:border-[#2B261F] transition-colors cursor-pointer text-xs font-medium"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title={`Member Audit: ${selectedMember.displayName}`}
          description={`Registered ID: ${selectedMember.id}`}
        >
          <div className="space-y-4 text-xs text-[#25221D] dark:text-[#F5F0E6]">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#EDE8DE] dark:bg-[#1D1A15] rounded-xl border border-[#DFD7C8] dark:border-[#2B261F]">
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Residence Country:</span>
                <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6]">{selectedMember.countryCode}</span>
              </div>
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Normalized WhatsApp:</span>
                <span className="font-mono font-semibold text-[#9D7B43] dark:text-[#C5A15B]">{selectedMember.normalizedE164}</span>
              </div>
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Registered Date:</span>
                <span className="text-[#25221D] dark:text-[#F5F0E6]">{new Date(selectedMember.registeredAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Language:</span>
                <span className="uppercase text-[#25221D] dark:text-[#F5F0E6]">{selectedMember.preferredLanguage}</span>
              </div>
            </div>

            <div className="p-3 bg-[#EDE8DE] dark:bg-[#1D1A15] rounded-xl border border-[#DFD7C8] dark:border-[#2B261F] space-y-2">
              <h4 className="font-bold text-[#25221D] dark:text-[#F5F0E6]">Consent Ledger Record</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#736C61] dark:text-[#A89F91]">Export Consent:</span>
                  <span className="font-semibold">
                    {selectedMember.consent.consentedToExport ? 'Active' : 'Revoked'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736C61] dark:text-[#A89F91]">Remote Wipe Acknowledged:</span>
                  <span>{selectedMember.consent.acknowledgedNoRemoteWipe ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736C61] dark:text-[#A89F91]">Terms Version:</span>
                  <span className="font-mono">{selectedMember.consent.termsVersion}</span>
                </div>
                {selectedMember.consent.revocationReason && (
                  <div className="pt-1 text-rose-600 dark:text-rose-400">
                    <strong>Revocation Reason:</strong> {selectedMember.consent.revocationReason}
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Status Controls */}
            <div className="pt-2 border-t border-[#DFD7C8] dark:border-[#2B261F]">
              <span className="font-semibold block mb-2 text-[#25221D] dark:text-[#F5F0E6]">Change Eligibility Status:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedMember.eligibility === 'eligible' ? 'gold' : 'outline'}
                  onClick={() => handleStatusChange(selectedMember, 'eligible')}
                >
                  Mark Eligible
                </Button>
                <Button
                  size="sm"
                  variant={selectedMember.eligibility === 'under_review' ? 'secondary' : 'outline'}
                  onClick={() => handleStatusChange(selectedMember, 'under_review')}
                >
                  Under Review
                </Button>
                <Button
                  size="sm"
                  variant={selectedMember.eligibility === 'suspended' ? 'danger' : 'outline'}
                  onClick={() => handleStatusChange(selectedMember, 'suspended')}
                >
                  Suspend
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
