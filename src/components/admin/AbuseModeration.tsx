/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { AbuseReport } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ShieldAlert, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';

export const AbuseModeration: React.FC = () => {
  const { addToast } = useApp();
  const [reports, setReports] = useState<AbuseReport[]>(mockDataService.getAbuseReports());
  const [selectedReport, setSelectedReport] = useState<AbuseReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleUpdateStatus = (reportId: string, status: AbuseReport['status']) => {
    mockDataService.updateReportStatus(reportId, status, resolutionNotes || undefined);
    setReports(mockDataService.getAbuseReports());
    if (selectedReport) {
      setSelectedReport({ ...selectedReport, status, resolutionNotes });
    }
    addToast(`Report marked as ${status}.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
            Abuse Reports &amp; Moderation
          </h1>
          <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
            Review community member complaints against spamming, unsolicited broadcasting, and policy breaches.
          </p>
        </div>
        <Badge variant="warning">
          {reports.filter(r => r.status === 'pending').length} Pending Reviews
        </Badge>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Offending Phone / Target</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Reported At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6]">
              {reports.map(rep => (
                <tr key={rep.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#736C61] dark:text-[#81796D]">
                    {rep.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-rose-600 dark:text-rose-400">
                    {rep.reportedPhoneOrName}
                  </td>
                  <td className="py-3 px-4 capitalize">
                    {rep.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#736C61] dark:text-[#A89F91]">
                    {new Date(rep.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        rep.status === 'resolved'
                          ? 'gold'
                          : rep.status === 'investigating'
                          ? 'warning'
                          : rep.status === 'dismissed'
                          ? 'neutral'
                          : 'danger'
                      }
                    >
                      {rep.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setResolutionNotes(rep.resolutionNotes || '');
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-[#EDE8DE] dark:bg-[#1D1A15] hover:bg-[#DFD7C8] dark:hover:bg-[#2B261F] text-[#9D7B43] dark:text-[#C5A15B] border border-[#DFD7C8] dark:border-[#2B261F] transition-colors cursor-pointer font-medium"
                    >
                      Inspect &amp; Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={`Abuse Incident Review: ${selectedReport.id}`}
          description={`Reported Target: ${selectedReport.reportedPhoneOrName}`}
        >
          <div className="space-y-4 text-xs text-[#25221D] dark:text-[#F5F0E6]">
            <div className="p-3 bg-[#EDE8DE] dark:bg-[#1D1A15] rounded-xl border border-[#DFD7C8] dark:border-[#2B261F] space-y-2">
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Category:</span>
                <span className="font-semibold capitalize">{selectedReport.category.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Reporter ID:</span>
                <span className="font-mono">{selectedReport.reporterMemberId}</span>
              </div>
              <div>
                <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Incident Description:</span>
                <p className="bg-[#FFFCF6] dark:bg-[#15130F] p-2.5 rounded-lg border border-[#DFD7C8] dark:border-[#2B261F] mt-1 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>
              {selectedReport.evidenceNotes && (
                <div>
                  <span className="text-[#736C61] dark:text-[#81796D] block text-[11px]">Evidence Notes:</span>
                  <span className="text-[#736C61] dark:text-[#A89F91]">{selectedReport.evidenceNotes}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Moderator Resolution Notes:
              </label>
              <textarea
                rows={2}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Log internal resolution steps (e.g. number warned or excluded from directory)..."
                className="w-full p-2.5 bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg outline-hidden text-xs focus:border-[#C5A15B]"
              />
            </div>

            <div className="pt-3 border-t border-[#DFD7C8] dark:border-[#2B261F] flex flex-wrap justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'investigating')}
                >
                  Mark Investigating
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                >
                  Resolve &amp; Exclude Number
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
