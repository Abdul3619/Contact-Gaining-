/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Save, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const AllowanceConfig: React.FC = () => {
  const { addToast } = useApp();
  const config = mockDataService.getAllowanceConfig();

  const [monetizationThreshold, setMonetizationThreshold] = useState(config.futureMonetizationEvaluationThreshold || 1000);
  const [pilotActive, setPilotActive] = useState(config.growthPhaseActive);
  const [releaseDay, setReleaseDay] = useState(config.incrementalReleaseDay);
  const [maxAttempts, setMaxAttempts] = useState(config.maxDailyDownloadAttempts || 10);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      mockDataService.updateGrowthConfig({
        futureMonetizationEvaluationThreshold: Number(monetizationThreshold),
        growthPhaseActive: pilotActive,
        incrementalReleaseDay: releaseDay,
        maxDailyDownloadAttempts: Number(maxAttempts),
      });
      setIsSaving(false);
      addToast('Growth policy & pilot parameters updated successfully.', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
          Growth Policy &amp; Pilot Settings
        </h1>
        <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
          Configure growth-stage uncapped contact access, future monetization evaluation benchmarks, and release frequency.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Growth Policy Highlights */}
        <div className="p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] text-xs text-[#736C61] dark:text-[#A89F91] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block mb-1">
              Active Growth Policy: No Fixed Weekly Cap
            </span>
            <p className="leading-relaxed">
              During this international expansion phase, eligible members can download all newly verified contacts available that they have not previously received, subject only to anti-abuse rate limits.
            </p>
          </div>
        </div>

        {/* Core Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#736C61] dark:text-[#A89F91]">
                Monetization Evaluation Threshold
              </label>
              <input
                type="number"
                min={100}
                max={50000}
                step={50}
                value={monetizationThreshold}
                onChange={e => setMonetizationThreshold(Number(e.target.value))}
                className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl px-3.5 py-2.5 text-sm text-[#25221D] dark:text-[#F5F0E6] font-mono focus:border-[#C5A15B] outline-hidden"
              />
              <p className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1.5 leading-relaxed">
                Benchmark: <strong>{monetizationThreshold} verified eligible participants</strong>. Network operates completely free until community surpasses this milestone.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#736C61] dark:text-[#A89F91]">
                Weekly Release Day
              </label>
              <select
                value={releaseDay}
                onChange={e => setReleaseDay(e.target.value as any)}
                className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl px-3.5 py-2.5 text-sm text-[#25221D] dark:text-[#F5F0E6] focus:border-[#C5A15B] outline-hidden cursor-pointer"
              >
                <option value="Monday">Monday (09:00 UTC)</option>
                <option value="Wednesday">Wednesday (12:00 UTC)</option>
                <option value="Friday">Friday (18:00 UTC - Recommended)</option>
                <option value="Saturday">Saturday (10:00 UTC)</option>
                <option value="Sunday">Sunday (18:00 UTC)</option>
              </select>
              <p className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1.5">
                Automated schedule trigger for bundling new voluntary participants into cohorts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#736C61] dark:text-[#A89F91]">
                Max Daily Download Attempts
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxAttempts}
                onChange={e => setMaxAttempts(Number(e.target.value))}
                className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl px-3.5 py-2.5 text-sm text-[#25221D] dark:text-[#F5F0E6] font-mono focus:border-[#C5A15B] outline-hidden"
              />
              <p className="text-[11px] text-[#736C61] dark:text-[#81796D] mt-1.5">
                Spam protection rate limit to prevent automated scraping scripts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs block text-[#25221D] dark:text-[#F5F0E6]">Growth Phase Mode</span>
                <span className="text-[11px] text-[#736C61] dark:text-[#A89F91]">
                  Uncapped downloads active. Paid checkouts remain dormant.
                </span>
              </div>
              <input
                type="checkbox"
                checked={pilotActive}
                onChange={e => setPilotActive(e.target.checked)}
                className="w-5 h-5 rounded border-[#DFD7C8] text-[#C5A15B] focus:ring-[#C5A15B] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DFD7C8] dark:border-[#2B261F] flex justify-end">
          <Button
            type="submit"
            variant="gold"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            Save Growth Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
