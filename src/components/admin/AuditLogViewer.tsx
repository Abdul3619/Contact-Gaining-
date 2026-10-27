/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { mockDataService } from '../../services/mockDataService';
import { AuditLogEvent } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Search, Filter, RefreshCw } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEvent[]>(mockDataService.getAuditLogs());
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'system' | 'member'>('all');

  const filteredLogs = logs.filter(l => {
    const q = query.toLowerCase().trim();
    const matchesQ =
      !q ||
      l.action.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'all' || l.actorRole === roleFilter;
    return matchesQ && matchesRole;
  });

  const handleRefresh = () => {
    setLogs(mockDataService.getAuditLogs());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
            Administrative Audit Log Viewer
          </h1>
          <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
            Immutable operational ledger recording consent transactions, releases, and config events.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Event Trail
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#FFFCF6] dark:bg-[#15130F] p-3 rounded-xl border border-[#DFD7C8] dark:border-[#2B261F] shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#736C61] dark:text-[#81796D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events by action, actor, or details..."
            className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg pl-9 pr-3 py-2 text-xs text-[#25221D] dark:text-[#F5F0E6] placeholder:text-[#81796D] outline-hidden focus:border-[#C5A15B]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#736C61] dark:text-[#81796D] shrink-0" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-lg px-3 py-2 text-xs text-[#25221D] dark:text-[#F5F0E6] outline-hidden cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin Actions</option>
            <option value="system">System / Cron</option>
            <option value="member">Member Consents &amp; Downloads</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFD7C8] dark:border-[#2B261F] text-[#736C61] dark:text-[#A89F91] font-semibold uppercase tracking-wider bg-[#EDE8DE]/50 dark:bg-[#1D1A15]/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Key</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">IP Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C8] dark:divide-[#2B261F] text-[#25221D] dark:text-[#F5F0E6] font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#EDE8DE]/40 dark:hover:bg-[#1D1A15]/40 transition-colors">
                  <td className="py-3 px-4 text-[#736C61] dark:text-[#A89F91] whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#9D7B43] dark:text-[#C5A15B] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-[#25221D] dark:text-[#F5F0E6] whitespace-nowrap font-sans text-xs">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        log.actorRole === 'admin'
                          ? 'gold'
                          : log.actorRole === 'system'
                          ? 'neutral'
                          : 'bronze'
                      }
                    >
                      {log.actorRole}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-[#736C61] dark:text-[#A89F91] font-sans text-xs">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right text-[#736C61] dark:text-[#81796D] text-[10px]">
                    {log.ipAddressSample}
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
