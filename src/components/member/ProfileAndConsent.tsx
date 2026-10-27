/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ContactPermanenceNotice } from '../common/Disclaimers';
import {
  ShieldCheck,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

export const ProfileAndConsent: React.FC = () => {
  const { activeMember, refreshData, t, addToast, setMemberScreen } = useApp();

  const [displayName, setDisplayName] = useState(activeMember.displayName);
  const [countryCode, setCountryCode] = useState(activeMember.countryCode);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'fr'>(activeMember.preferredLanguage);
  const [isSaving, setIsSaving] = useState(false);

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
      addToast('Profile changes saved successfully.', 'success');
    }, 400);
  };

  const handleConfirmRemoval = () => {
    mockDataService.requestContactRemoval(activeMember.id, removalReason);
    setRemovalModalOpen(false);
    refreshData();
    addToast('Your contact details have been withdrawn from all future releases.', 'warning');
  };

  const handleConfirmDeactivation = () => {
    mockDataService.requestContactRemoval(activeMember.id, 'Account deactivation requested by member');
    setDeactivateModalOpen(false);
    refreshData();
    addToast('Your account has been deactivated.', 'info');
    setMemberScreen('landing');
  };

  const isWithdrawn = activeMember.eligibility === 'withdrawn' || !activeMember.consent.consentedToExport;

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-[#1C1915] dark:text-[#F5F0E6]">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('profileTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1">
          {t('profileSubhead')}
        </p>
      </div>

      {/* Consent Status Card */}
      <div
        className={`rounded-2xl p-6 border transition-colors shadow-xs ${
          isWithdrawn
            ? 'bg-rose-500/10 border-rose-500/30'
            : 'bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isWithdrawn
                  ? 'bg-rose-500/15 text-rose-600'
                  : 'bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B]'
              }`}
            >
              {isWithdrawn ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-base font-bold">Sharing status</h2>
                <span>·</span>
                {isWithdrawn ? (
                  <span className="text-rose-700 dark:text-rose-400 font-medium text-xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Withdrawn
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active &amp; Sharing
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
                {isWithdrawn
                  ? 'Your number is excluded from all upcoming releases. You can reinstate sharing anytime.'
                  : t('consentActiveNotice')}
              </p>
            </div>
          </div>

          {!isWithdrawn && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRemovalModalOpen(true)}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Withdraw details
            </Button>
          )}
        </div>

        {/* Record Details */}
        <div className="mt-5 pt-4 border-t border-[#E5DFD5] dark:border-[#2B261F] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6B6357] dark:text-[#A8A196]">
          <div>
            <span className="text-[#81796D] block text-[11px]">Permission granted on:</span>
            <span>{new Date(activeMember.consent.timestamp).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-[#81796D] block text-[11px]">Status in release files:</span>
            <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">
              {isWithdrawn ? 'Excluded from exports' : 'Included in weekly release files'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">
          Your contact information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              {t('displayNameLabel')}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
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
              <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
                {t('langLabel')}
              </label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value as 'en' | 'fr')}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden cursor-pointer text-[#1C1915] dark:text-[#F5F0E6]"
              >
                <option value="en" className="bg-[#FFFFFF] dark:bg-[#15130F]">English</option>
                <option value="fr" className="bg-[#FFFFFF] dark:bg-[#15130F]">Français</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Registered WhatsApp Number
            </label>
            <input
              type="text"
              disabled
              value={activeMember.normalizedE164}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg text-[#6B6357] dark:text-[#81796D] font-mono cursor-not-allowed"
            />
            <p className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1">
              To use a different phone number, simply register a new profile with that number.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </form>

      {/* Permanence & Privacy Notice */}
      <ContactPermanenceNotice />

      {/* Account Deactivation Area */}
      <div className="rounded-2xl border p-6 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-rose-300 dark:border-rose-900/60 shadow-xs">
        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">
          {t('deactivateAccountTitle')}
        </h3>
        <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed mb-4">
          Deactivating your account removes you from all upcoming contact releases and suspends your profile.
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
        title="Withdraw your contact details"
        description="Your phone number and name will be removed from all upcoming contact releases."
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
            Once confirmed, you will no longer be included in weekly contact files for new members.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              Reason for leaving:
            </label>
            <select
              value={removalReason}
              onChange={e => setRemovalReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg outline-hidden bg-transparent text-[#1C1915] dark:text-[#F5F0E6]"
            >
              <option value="No longer actively networking on WhatsApp" className="bg-[#FFFFFF] dark:bg-[#15130F]">No longer actively networking on WhatsApp</option>
              <option value="Received unwanted commercial messages" className="bg-[#FFFFFF] dark:bg-[#15130F]">Received unwanted commercial messages</option>
              <option value="Changing phone number or business name" className="bg-[#FFFFFF] dark:bg-[#15130F]">Changing phone number or business name</option>
              <option value="Privacy preference change" className="bg-[#FFFFFF] dark:bg-[#15130F]">Privacy preference change</option>
              <option value="Other reason" className="bg-[#FFFFFF] dark:bg-[#15130F]">Other reason</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl border bg-[#FBF9F5] dark:bg-[#181612] border-[#E5DFD5] dark:border-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] leading-relaxed">
            <strong>Please note:</strong> Contacts previously downloaded and saved by existing members onto their phones cannot be erased remotely from their devices.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setRemovalModalOpen(false)}>
              Keep details active
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmRemoval}>
              Confirm withdrawal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Deactivate */}
      <Modal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="Confirm deactivation"
        description="Are you sure you want to deactivate your profile?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
            Your details will be withdrawn from all future releases and your active session will be closed.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeactivateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDeactivation}>
              Yes, deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
