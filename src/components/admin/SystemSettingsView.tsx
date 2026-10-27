/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Settings, Save, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { addToast, resetDemonstrationData } = useApp();
  const settings = mockDataService.getSystemSettings();

  const [pilotMode, setPilotMode] = useState(settings.growthPhaseActive);
  const [registrationOpen, setRegistrationOpen] = useState(settings.registrationOpen);
  const [requireDoubleOptIn, setRequireDoubleOptIn] = useState(settings.requireDoubleOptInConsent);
  const [e164Strict, setE164Strict] = useState(settings.e164ValidationStrict);
  const [communityLink, setCommunityLink] = useState(settings.communityInviteLink);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      mockDataService.updateSystemSettings({
        growthPhaseActive: pilotMode,
        registrationOpen,
        requireDoubleOptInConsent: requireDoubleOptIn,
        e164ValidationStrict: e164Strict,
        communityInviteLink: communityLink,
      });
      setIsSaving(false);
      addToast('System operational parameters updated successfully.', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#25221D] dark:text-[#F5F0E6] tracking-tight">
          Platform System Settings
        </h1>
        <p className="text-xs text-[#736C61] dark:text-[#A89F91] mt-1">
          Operational switches, compliance gates, and external channel configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#FFFCF6] dark:bg-[#15130F] border border-[#DFD7C8] dark:border-[#2B261F] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#736C61] dark:text-[#A89F91]">
            Operational Policy Switches
          </h2>

          {/* Pilot Mode Switch */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block mb-0.5">
                Growth Pilot Enforcement
              </span>
              <span className="text-[#736C61] dark:text-[#A89F91]">
                While active, all participants receive free contact access and paid tier checkout stays disabled.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pilotMode}
              onChange={e => setPilotMode(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#C5A15B] focus:ring-[#C5A15B] cursor-pointer"
            />
          </label>

          {/* Registration Open */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block mb-0.5">
                Voluntary Public Registration
              </span>
              <span className="text-[#736C61] dark:text-[#A89F91]">
                Allow new participants to complete the international opt-in registration flow.
              </span>
            </div>
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={e => setRegistrationOpen(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#C5A15B] focus:ring-[#C5A15B] cursor-pointer"
            />
          </label>

          {/* Double Opt-In Consent Requirement */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block mb-0.5">
                Enforce Mandatory Double Opt-In
              </span>
              <span className="text-[#736C61] dark:text-[#A89F91]">
                Requires both voluntary sharing consent and the physical device permanence acknowledgement before registration.
              </span>
            </div>
            <input
              type="checkbox"
              checked={requireDoubleOptIn}
              onChange={e => setRequireDoubleOptIn(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#C5A15B] focus:ring-[#C5A15B] cursor-pointer"
            />
          </label>

          {/* E.164 Strict */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-[#25221D] dark:text-[#F5F0E6] block mb-0.5">
                Strict E.164 Library Validation
              </span>
              <span className="text-[#736C61] dark:text-[#A89F91]">
                Validate international phone numbers strictly using international metadata standards.
              </span>
            </div>
            <input
              type="checkbox"
              checked={e164Strict}
              onChange={e => setE164Strict(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#C5A15B] focus:ring-[#C5A15B] cursor-pointer"
            />
          </label>
        </div>

        {/* WhatsApp Community Link */}
        <div className="pt-2 border-t border-[#DFD7C8] dark:border-[#2B261F] space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#736C61] dark:text-[#A89F91]">
            Official WhatsApp Community Invite URL
          </label>
          <input
            type="url"
            value={communityLink}
            onChange={e => setCommunityLink(e.target.value)}
            className="w-full bg-[#EDE8DE] dark:bg-[#1D1A15] border border-[#DFD7C8] dark:border-[#2B261F] rounded-xl px-3.5 py-2 text-xs text-[#25221D] dark:text-[#F5F0E6] font-mono focus:border-[#C5A15B] outline-hidden"
          />
          <p className="text-[11px] text-[#736C61] dark:text-[#81796D]">
            Rendered on the public landing page with explicit notice that community membership does not equal contact sharing consent.
          </p>
        </div>

        <div className="pt-4 border-t border-[#DFD7C8] dark:border-[#2B261F] flex items-center justify-between">
          <button
            type="button"
            onClick={resetDemonstrationData}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial Baseline</span>
          </button>

          <Button type="submit" variant="gold" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
