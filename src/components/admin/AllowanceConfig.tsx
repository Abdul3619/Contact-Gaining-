/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sliders, Save, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const AllowanceConfig: React.FC = () => {
  const { addToast } = useApp();
  const config = mockDataService.getAllowanceConfig();

  const [weeklyAllowance, setWeeklyAllowance] = useState(config.freeWeeklyContactsPerMember);
  const [monetizationThreshold, setMonetizationThreshold] = useState(config.pilotMonetizationThreshold);
  const [pilotActive, setPilotActive] = useState(config.pilotActive);
  const [releaseDay, setReleaseDay] = useState(config.incrementalReleaseDay);
  const [maxAttempts, setMaxAttempts] = useState(config.maxDownloadAttemptsPerDay);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      mockDataService.updateAllowanceConfig({
        freeWeeklyContactsPerMember: Number(weeklyAllowance),
        pilotMonetizationThreshold: Number(monetizationThreshold),
        pilotActive,
        incrementalReleaseDay: releaseDay,
        maxDownloadAttemptsPerDay: Number(maxAttempts),
      });
      setIsSaving(false);
      addToast('Weekly allowance & pilot parameters updated successfully.', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          5. Weekly Free Allowance &amp; Pilot Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure baseline weekly allowances, monetization thresholds, and release frequency.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Core Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Free Weekly Contacts Per Member
              </label>
              <input
                type="number"
                min={10}
                max={500}
                value={weeklyAllowance}
                onChange={e => setWeeklyAllowance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-teal-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Default: <strong>50 unique contacts/week</strong>. Existing participants retain this free quota after future monetization launches.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pilot Monetization Threshold (Eligible Members)
              </label>
              <input
                type="number"
                min={100}
                max={50000}
                step={50}
                value={monetizationThreshold}
                onChange={e => setMonetizationThreshold(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-teal-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Target: <strong>{monetizationThreshold} eligible participants</strong>. Network remains 100% free pilot until this verified benchmark is confirmed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Weekly Incremental Release Day
              </label>
              <select
                value={releaseDay}
                onChange={e => setReleaseDay(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-500 outline-hidden cursor-pointer"
              >
                <option value="Monday">Monday (09:00 UTC)</option>
                <option value="Wednesday">Wednesday (12:00 UTC)</option>
                <option value="Friday">Friday (18:00 UTC - Recommended)</option>
                <option value="Saturday">Saturday (10:00 UTC)</option>
                <option value="Sunday">Sunday (18:00 UTC)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Automated schedule trigger for bundling new voluntary participants.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Max Daily Download Attempts
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxAttempts}
                onChange={e => setMaxAttempts(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-teal-500 outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Rate limiter to prevent automated mass-scraping bots.
              </p>
            </div>
          </div>
        </div>

        {/* Pilot Mode Switch */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="font-semibold text-white text-xs block">Free Pilot Mode Active</span>
            <span className="text-[11px] text-slate-400">
              When active, paid package checkout gates remain dormant and all eligible members receive free releases.
            </span>
          </div>
          <input
            type="checkbox"
            checked={pilotActive}
            onChange={e => setPilotActive(e.target.checked)}
            className="w-5 h-5 rounded text-teal-600 border-slate-700 bg-slate-800 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="emerald" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
