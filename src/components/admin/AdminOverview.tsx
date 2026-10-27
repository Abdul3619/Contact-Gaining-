/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Users,
  ShieldCheck,
  Globe2,
  FileCheck2,
  ShieldAlert,
  DownloadCloud,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { setAdminScreen, setViewMode } = useApp();

  const members = mockDataService.getMembers();
  const config = mockDataService.getAllowanceConfig();
  const releases = mockDataService.getReleases();
  const reports = mockDataService.getAbuseReports();
  const logs = mockDataService.getAuditLogs();

  const totalRegistered = members.length;
  const eligibleCount = members.filter(m => m.eligibility === 'eligible').length;
  const uniqueCountries = new Set(members.map(m => m.countryCode)).size;
  const pendingRemovals = members.filter(m => m.eligibility === 'withdrawn').length;
  const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'investigating').length;

  const thresholdPercent = Math.min(100, Math.round((config.currentEligibleCount / config.pilotMonetizationThreshold) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
          <span>
            <strong>Administrative Prototype:</strong> Operational workflows are fully interactive with local state. Server-side RBAC and database sync will connect in Phase 2.
          </span>
        </div>
        <Badge variant="pilot">Pilot Mode Active</Badge>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalRegistered}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Voluntary participants</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Eligible for Export</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
            {eligibleCount}
          </div>
          <span className="text-[11px] text-teal-500/80 mt-1 block">Active double opt-in</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Countries</span>
            <Globe2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {uniqueCountries}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cross-regional cohort</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Abuse Reports</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {pendingReports}
          </div>
          <span className="text-[11px] text-amber-500/80 mt-1 block">Requires moderation</span>
        </div>
      </div>

      {/* Pilot Monetization Threshold Progress Meter */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pilot Milestone Progress</h2>
              <Badge variant="neutral">Milestone Rule</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monetization threshold is currently set to <strong>{config.pilotMonetizationThreshold} eligible participants</strong>. Network operates completely free until approved.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-teal-300">
              {config.currentEligibleCount} / {config.pilotMonetizationThreshold}
            </span>
            <span className="text-xs text-slate-500 block font-mono">{thresholdPercent}% achieved</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${thresholdPercent}%` }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Configurable in Section 5 (Weekly Allowance &amp; Pilot Settings)</span>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => setAdminScreen('allowance')}
          >
            Adjust Threshold Setting
          </Button>
        </div>
      </div>

      {/* Two Column Section: Quick Operations & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Actions */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Administrative Shortcuts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setAdminScreen('members')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-300 text-xs font-semibold mb-1">
                <span>Member Directory</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Search members, verify consent, toggle status.</p>
            </button>

            <button
              onClick={() => setAdminScreen('releases')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-300 text-xs font-semibold mb-1">
                <span>Publish Release</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Generate next weekly incremental release batch.</p>
            </button>

            <button
              onClick={() => setAdminScreen('abuse')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-300 text-xs font-semibold mb-1">
                <span>Moderate Abuse</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Review member complaints and ban offenders.</p>
            </button>

            <button
              onClick={() => setAdminScreen('audit_logs')}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-300 text-xs font-semibold mb-1">
                <span>Audit Logs</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Inspect immutable event ledger and timestamps.</p>
            </button>
          </div>
        </div>

        {/* Right: Recent Audit Log Events */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent System Events
            </h3>
            <button
              onClick={() => setAdminScreen('audit_logs')}
              className="text-xs text-teal-400 hover:underline"
            >
              View Full Audit Trail
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {logs.slice(0, 4).map(log => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-300 font-semibold text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-500 text-[10px]">by {log.actor}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
