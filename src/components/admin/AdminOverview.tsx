/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { supabaseService } from '../../services/supabaseService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Users,
  ShieldCheck,
  Globe2,
  ShieldAlert,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { setAdminScreen, isBackendConfigured } = useApp();

  const [useSampleData, setUseSampleData] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<{
    totalRegistered: number;
    eligibleCount: number;
    pendingCount: number;
    suspendedCount: number;
    uniqueCountries: number;
    totalReleases: number;
    totalDownloads: number;
    isLiveDb: boolean;
    error: string | null;
  } | null>(null);
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveMetrics = async () => {
    setIsLoading(true);
    if (isBackendConfigured) {
      const metrics = await supabaseService.getAdminMetrics();
      setLiveMetrics(metrics);
      const audit = await supabaseService.getAuditLogs();
      if (audit.length > 0) {
        setLiveLogs(audit);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLiveMetrics();
  }, [isBackendConfigured]);

  const members = mockDataService.getMembers();
  const config = mockDataService.getGrowthConfig();
  const reports = mockDataService.getAbuseReports();
  const sampleLogs = mockDataService.getAuditLogs();

  const totalRegistered = (!useSampleData && liveMetrics?.isLiveDb)
    ? liveMetrics.totalRegistered
    : members.length;

  const eligibleCount = (!useSampleData && liveMetrics?.isLiveDb)
    ? liveMetrics.eligibleCount
    : members.filter(m => m.eligibility === 'eligible').length;

  const uniqueCountries = (!useSampleData && liveMetrics?.isLiveDb)
    ? liveMetrics.uniqueCountries
    : new Set(members.map(m => m.countryCode)).size;

  const pendingReports = reports.filter(r => r.status === 'pending' || r.status === 'investigating').length;

  const logs = (!useSampleData && liveLogs.length > 0) ? liveLogs : sampleLogs;

  const threshold = config.futureMonetizationEvaluationThreshold || 1000;
  const thresholdPercent = Math.min(100, Math.round((eligibleCount / threshold) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner with Backend Status */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B6357] dark:text-[#A8A196] shadow-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B] shrink-0" />
          <span>
            <strong className="text-[#1C1915] dark:text-[#F5F0E6]">
              {useSampleData ? 'Showing Demonstration Dataset' : 'Live Supabase Backend (qwppwilumpokakzpusmo):'}
            </strong>{' '}
            {useSampleData
              ? 'Illustrating populated community state.'
              : `Connected via public API key (${totalRegistered} registered, ${liveMetrics?.totalReleases || 0} releases).`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchLiveMetrics}
            disabled={isLoading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant={useSampleData ? 'gold' : 'outline'}
            onClick={() => setUseSampleData(prev => !prev)}
          >
            {useSampleData ? 'Switch to Live Database' : 'View Sample Data'}
          </Button>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs inline-flex items-center gap-1.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Sync
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#6B6357] dark:text-[#A8A196] text-xs mb-1">
            <span>Total registered</span>
            <Users className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6] tabular-nums">
            {totalRegistered}
          </div>
          <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1 block">Members joined</span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#6B6357] dark:text-[#A8A196] text-xs mb-1">
            <span>Active in releases</span>
            <ShieldCheck className="w-4 h-4 text-[#C5A15B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#9D7B43] dark:text-[#C5A15B] tabular-nums">
            {eligibleCount}
          </div>
          <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1 block">Consent active</span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#6B6357] dark:text-[#A8A196] text-xs mb-1">
            <span>Countries</span>
            <Globe2 className="w-4 h-4 text-[#9D7B43] dark:text-[#C5A15B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1C1915] dark:text-[#F5F0E6] tabular-nums">
            {uniqueCountries}
          </div>
          <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1 block">Represented regions</span>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#6B6357] dark:text-[#A8A196] text-xs mb-1">
            <span>Safety reports</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
            {pendingReports}
          </div>
          <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1 block">Awaiting review</span>
        </div>
      </div>

      {/* Community Progress Meter */}
      <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">Community milestone progress</h2>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-0.5">
              The community operates with open access until reaching <strong>{threshold} verified members</strong>.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[#9D7B43] dark:text-[#C5A15B]">
              {eligibleCount} / {threshold}
            </span>
            <span className="text-xs text-[#6B6357] dark:text-[#81796D] block font-mono">{thresholdPercent}% achieved</span>
          </div>
        </div>

        <div className="w-full bg-[#F0ECE1] dark:bg-[#2B261F] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#C5A15B] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(thresholdPercent, 4)}%` }}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-[#E5DFD5] dark:border-[#2B261F] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6357] dark:text-[#A8A196]">
          <span>Adjustable under Access Policy &amp; Limits</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAdminScreen('allowance')}
          >
            Adjust milestone target
          </Button>
        </div>
      </div>

      {/* Two Column Section: Shortcuts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Actions */}
        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6357] dark:text-[#A8A196]">
            Management shortcuts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setAdminScreen('members')}
              className="p-3.5 rounded-xl bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#1C1915] dark:text-[#F5F0E6] group-hover:text-[#9D7B43] dark:group-hover:text-[#C5A15B] text-xs font-semibold mb-1">
                <span>Member directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-[#6B6357] dark:text-[#81796D]">Search profiles, verify numbers, inspect records.</p>
            </button>

            <button
              onClick={() => setAdminScreen('releases')}
              className="p-3.5 rounded-xl bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#1C1915] dark:text-[#F5F0E6] group-hover:text-[#9D7B43] dark:group-hover:text-[#C5A15B] text-xs font-semibold mb-1">
                <span>Release batches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-[#6B6357] dark:text-[#81796D]">Generate and publish contact export files.</p>
            </button>

            <button
              onClick={() => setAdminScreen('abuse')}
              className="p-3.5 rounded-xl bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#1C1915] dark:text-[#F5F0E6] group-hover:text-[#9D7B43] dark:group-hover:text-[#C5A15B] text-xs font-semibold mb-1">
                <span>Review reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-[#6B6357] dark:text-[#81796D]">Address member reports and prevent spam.</p>
            </button>

            <button
              onClick={() => setAdminScreen('audit_logs')}
              className="p-3.5 rounded-xl bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#1C1915] dark:text-[#F5F0E6] group-hover:text-[#9D7B43] dark:group-hover:text-[#C5A15B] text-xs font-semibold mb-1">
                <span>Audit trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-[#6B6357] dark:text-[#81796D]">Inspect chronological event logs.</p>
            </button>
          </div>
        </div>

        {/* Right: Recent Events */}
        <div className="bg-[#FFFFFF] dark:bg-[#15130F] border border-[#E5DFD5] dark:border-[#2B261F] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6357] dark:text-[#A8A196]">
              Recent community activity
            </h3>
            <button
              onClick={() => setAdminScreen('audit_logs')}
              className="text-xs text-[#9D7B43] dark:text-[#C5A15B] hover:underline font-semibold cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-[#E5DFD5] dark:divide-[#2B261F] text-xs">
            {logs.slice(0, 4).map(log => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#9D7B43] dark:text-[#C5A15B] font-semibold text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[#6B6357] dark:text-[#81796D] text-[10px]">by {log.actor}</span>
                  </div>
                  <p className="text-[#1C1915] dark:text-[#F5F0E6] text-[11px] mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-[#6B6357] dark:text-[#81796D] font-mono whitespace-nowrap">
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
