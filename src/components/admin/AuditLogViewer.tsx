/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { AuditLogEvent } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Search, Filter, ClipboardList, Shield, RefreshCw } from 'lucide-react';

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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            9. Administrative Audit Log Viewer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable operational ledger recording consent transactions, releases, and config events.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
          onClick={handleRefresh}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Event Trail
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events by action, actor, or details..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-hidden cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin Actions</option>
            <option value="system">System / Cron</option>
            <option value="member">Member Consents &amp; Downloads</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Key</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">IP Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-teal-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-white whitespace-nowrap font-sans text-xs">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        log.actorRole === 'admin'
                          ? 'warning'
                          : log.actorRole === 'system'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {log.actorRole}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[10px]">
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
