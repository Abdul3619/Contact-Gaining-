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

  const [pilotMode, setPilotMode] = useState(settings.pilotModeActive);
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
        pilotModeActive: pilotMode,
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
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          10. Platform System Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Operational switches, compliance gates, and external channel configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Operational Policy Switches
          </h2>

          {/* Pilot Mode Switch */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-white block mb-0.5">
                Pilot Mode Enforcement
              </span>
              <span className="text-slate-400">
                While active, all participants receive free contact allowances and paid tier checkout stays disabled.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pilotMode}
              onChange={e => setPilotMode(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-teal-600 bg-slate-800 border-slate-700 focus:ring-teal-500"
            />
          </label>

          {/* Registration Open */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-white block mb-0.5">
                Voluntary Public Registration
              </span>
              <span className="text-slate-400">
                Allow new participants to complete the international opt-in registration flow.
              </span>
            </div>
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={e => setRegistrationOpen(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-teal-600 bg-slate-800 border-slate-700 focus:ring-teal-500"
            />
          </label>

          {/* Double Opt-In Consent Requirement */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-white block mb-0.5">
                Enforce Mandatory Double Opt-In
              </span>
              <span className="text-slate-400">
                Requires both voluntary sharing consent and the physical device permanence acknowledgement before registration.
              </span>
            </div>
            <input
              type="checkbox"
              checked={requireDoubleOptIn}
              onChange={e => setRequireDoubleOptIn(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-teal-600 bg-slate-800 border-slate-700 focus:ring-teal-500"
            />
          </label>

          {/* E.164 Strict */}
          <label className="flex items-start justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div className="text-xs leading-relaxed pr-4">
              <span className="font-semibold text-white block mb-0.5">
                Strict E.164 Library Validation
              </span>
              <span className="text-slate-400">
                Validate international phone numbers strictly using libphonenumber-js metadata instead of simple regex.
              </span>
            </div>
            <input
              type="checkbox"
              checked={e164Strict}
              onChange={e => setE164Strict(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-teal-600 bg-slate-800 border-slate-700 focus:ring-teal-500"
            />
          </label>
        </div>

        {/* WhatsApp Community Link */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Official WhatsApp Community Invite URL
          </label>
          <input
            type="url"
            value={communityLink}
            onChange={e => setCommunityLink(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-teal-500 outline-hidden"
          />
          <p className="text-[11px] text-slate-500">
            Rendered on the public landing page with explicit notice that community membership does not equal contact sharing consent.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={resetDemonstrationData}
            className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial Baseline</span>
          </button>

          <Button type="submit" variant="emerald" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
