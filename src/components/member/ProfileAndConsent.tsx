/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { ContactPermanenceNotice } from '../common/Disclaimers';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Trash2,
  AlertTriangle,
  History,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';

export const ProfileAndConsent: React.FC = () => {
  const { activeMember, refreshData, t, addToast, setMemberScreen } = useApp();

  // Profile Form state
  const [displayName, setDisplayName] = useState(activeMember.displayName);
  const [countryCode, setCountryCode] = useState(activeMember.countryCode);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'fr'>(activeMember.preferredLanguage);
  const [isSaving, setIsSaving] = useState(false);

  // Removal Modal
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [removalReason, setRemovalReason] = useState('No longer actively networking on WhatsApp');
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      mockDataService.updateProfile(activeMember.id, {
        displayName: displayName.trim(),
        countryCode,
        preferredLanguage,
      });
      setIsSaving(false);
      refreshData();
      addToast('Profile preferences updated successfully.', 'success');
    }, 400);
  };

  const handleConfirmRemoval = () => {
    mockDataService.requestContactRemoval(activeMember.id, removalReason);
    setRemovalModalOpen(false);
    refreshData();
    addToast('Consent revoked. You have been removed from all future releases.', 'warning');
  };

  const handleConfirmDeactivation = () => {
    mockDataService.requestContactRemoval(activeMember.id, 'Account deactivation requested by member');
    setDeactivateModalOpen(false);
    refreshData();
    addToast('Demonstration account deactivated.', 'info');
    setMemberScreen('landing');
  };

  const isWithdrawn = activeMember.eligibility === 'withdrawn' || !activeMember.consent.consentedToExport;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('profileTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t('profileSubhead')}
        </p>
      </div>

      {/* Consent Status Card */}
      <div className={`rounded-2xl p-6 border shadow-xs ${
        isWithdrawn ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isWithdrawn ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'
            }`}>
              {isWithdrawn ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Active Participation &amp; Consent</h2>
                <Badge variant={isWithdrawn ? 'danger' : 'success'}>
                  {isWithdrawn ? 'Consent Withdrawn' : 'Active & Consented'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isWithdrawn
                  ? 'Your number has been excluded from all upcoming releases. You cannot export new contacts while withdrawn.'
                  : t('consentActiveNotice')}
              </p>
            </div>
          </div>

          {!isWithdrawn && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRemovalModalOpen(true)}
              className="text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Request Removal
            </Button>
          )}
        </div>

        {/* Consent Ledger Details */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Consented Timestamp:</span>
            <span>{new Date(activeMember.consent.timestamp).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Terms Version:</span>
            <span>{activeMember.consent.termsVersion}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Audit Hash:</span>
            <span className="text-slate-500">{activeMember.consent.ipHashSample}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900">
          Participant Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('displayNameLabel')}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SearchableCountrySelect
                mode="country"
                label={t('countryLabel')}
                value={countryCode}
                onChange={code => setCountryCode(code)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('langLabel')}
              </label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value as 'en' | 'fr')}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden cursor-pointer"
              >
                <option value="en">English (UK/International)</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Verified WhatsApp Number (E.164)
            </label>
            <input
              type="text"
              disabled
              value={activeMember.normalizedE164}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-mono cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              To change your registered phone number in Phase 2, a phone reverification will be required.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Permanence & Privacy Notice */}
      <ContactPermanenceNotice />

      {/* Account Deactivation Area */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-rose-950 mb-1">
          {t('deactivateAccountTitle')}
        </h3>
        <p className="text-xs text-rose-800 leading-relaxed mb-4">
          Deactivating your account immediately stops all future contact releases, revokes sharing consent, and suspends your directory access.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeactivateModalOpen(true)}
          icon={<Trash2 className="w-4 h-4" />}
        >
          {t('deactivateAccountBtn')}
        </Button>
      </div>

      {/* Modal: Request Removal */}
      <Modal
        isOpen={removalModalOpen}
        onClose={() => setRemovalModalOpen(false)}
        title="Request Contact Removal"
        description="Withdraw your phone number and display name from upcoming releases."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            By confirming removal, your details will be immediately excluded from upcoming weekly exports.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for withdrawal:
            </label>
            <select
              value={removalReason}
              onChange={e => setRemovalReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-hidden"
            >
              <option value="No longer actively networking on WhatsApp">No longer actively networking on WhatsApp</option>
              <option value="Received unwanted commercial messages">Received unwanted commercial messages</option>
              <option value="Changing phone number or business name">Changing phone number or business name</option>
              <option value="Privacy preference change">Privacy preference change</option>
              <option value="Other reason">Other reason</option>
            </select>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Important:</strong> Contacts previously downloaded and saved by existing members cannot be remotely erased from their phone storage.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setRemovalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmRemoval}>
              Confirm Removal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Deactivate */}
      <Modal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="Confirm Account Deactivation"
        description="Are you sure you want to deactivate your participation?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This will mark your record as withdrawn and clear active session states.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeactivateModalOpen(false)}>
              Keep Account
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDeactivation}>
              Yes, Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
