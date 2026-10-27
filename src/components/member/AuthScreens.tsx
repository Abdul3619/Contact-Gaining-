/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { Button } from '../common/Button';
import {
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const SignInScreen: React.FC = () => {
  const { t, allMembers, switchActiveMember, setMemberScreen, addToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callingCode, setCallingCode] = useState('+234');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number or choose a profile below.');
      return;
    }
    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    const found = allMembers.find(m => m.rawPhone.includes(cleanNum) || m.normalizedE164.includes(cleanNum));

    if (found) {
      switchActiveMember(found.id);
      setMemberScreen('dashboard');
    } else {
      switchActiveMember(allMembers[0].id);
      addToast('Signed in to sample profile.', 'info');
      setMemberScreen('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-[#1C1915] dark:text-[#F5F0E6]">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#15130F] dark:bg-[#1D1A15] border border-[#9D7B43]/50 dark:border-[#C5A15B]/50 text-[#C5A15B] flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow-xs">
            CG
          </div>
          <h1 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">{t('signInTitle')}</h1>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-1">{t('signInDesc')}</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <SearchableCountrySelect
                mode="dialCode"
                value={callingCode}
                onChange={code => setCallingCode(code)}
              />
            </div>
            <div className="col-span-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                placeholder="700 000 1234"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden font-mono text-[#1C1915] dark:text-[#F5F0E6]"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}

          <Button type="submit" size="lg" variant="gold" className="w-full">
            {t('signInBtn')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E5DFD5] dark:border-[#2B261F]">
          <span className="text-[11px] font-semibold text-[#6B6357] dark:text-[#81796D] uppercase tracking-wider block mb-3">
            Preview Profiles:
          </span>
          <div className="space-y-2">
            {allMembers.slice(0, 3).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  switchActiveMember(m.id);
                  setMemberScreen('dashboard');
                }}
                className="w-full text-left p-3 rounded-lg border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] bg-[#F6F2EA]/70 dark:bg-[#1D1A15] transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6] block truncate">
                    {m.displayName}
                  </span>
                  <span className="text-[11px] text-[#6B6357] dark:text-[#81796D] font-mono">
                    {m.countryCode} · {m.normalizedE164}
                  </span>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-[#6B6357] dark:text-[#81796D] pt-4 border-t border-[#E5DFD5] dark:border-[#2B261F]">
          <button
            type="button"
            onClick={() => setMemberScreen('recovery')}
            className="hover:text-[#1C1915] dark:hover:text-[#F5F0E6] underline underline-offset-2 cursor-pointer"
          >
            {t('accountRecoveryTitle')}
          </button>
          <button
            type="button"
            onClick={() => setMemberScreen('register')}
            className="text-[#9D7B43] dark:text-[#C5A15B] font-semibold hover:underline cursor-pointer"
          >
            {t('navRegister')}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AccountRecoveryScreen: React.FC = () => {
  const { t, setMemberScreen, addToast } = useApp();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Sign-in link sent to your number.', 'info');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-[#1C1915] dark:text-[#F5F0E6]">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F0ECE1] dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] text-[#9D7B43] dark:text-[#C5A15B] flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">{t('accountRecoveryTitle')}</h1>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-1">{t('accountRecoveryDesc')}</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl border text-xs space-y-3 bg-[#F2F9F5] dark:bg-[#0E1712] border-emerald-200 dark:border-emerald-900/60 text-[#1C1915] dark:text-[#F5F0E6]">
            <div className="flex items-center gap-2 font-semibold text-sm text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Sign-in details dispatched</span>
            </div>
            <p className="leading-relaxed text-[#6B6357] dark:text-[#A8A196]">
              A verification link was generated for {phone || 'your phone number'}. You can also sign in directly using any preview profile.
            </p>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setMemberScreen('sign_in')}
              className="w-full mt-2"
            >
              Return to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 800 000 1234"
                required
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden font-mono text-[#1C1915] dark:text-[#F5F0E6]"
              />
            </div>

            <Button type="submit" size="lg" variant="gold" className="w-full">
              {t('requestRecoveryBtn')}
            </Button>

            <button
              type="button"
              onClick={() => setMemberScreen('sign_in')}
              className="w-full text-center text-xs text-[#6B6357] hover:text-[#1C1915] dark:text-[#81796D] dark:hover:text-[#F5F0E6] underline underline-offset-2 py-2 cursor-pointer"
            >
              Cancel and return
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const VerificationPendingScreen: React.FC = () => {
  const { activeMember, setMemberScreen } = useApp();

  return (
    <div className="max-w-md mx-auto py-8 px-4 text-center">
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-5 text-[#1C1915] dark:text-[#F5F0E6]">
        <div className="w-12 h-12 rounded-xl bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B] border border-[#C5A15B]/30 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 text-[#9D7B43] dark:text-[#C5A15B]" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#1C1915] dark:text-[#F5F0E6]">You&apos;re all set!</h1>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-1.5 leading-relaxed">
            Your details have been registered and added to the community directory.
          </p>
        </div>

        <div className="p-4 rounded-xl border text-left text-xs space-y-2 bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border-[#E5DFD5] dark:border-[#2B261F]">
          <div className="flex justify-between">
            <span className="text-[#6B6357] dark:text-[#81796D]">Name:</span>
            <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">{activeMember.displayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6357] dark:text-[#81796D]">WhatsApp:</span>
            <span className="font-mono font-semibold text-[#9D7B43] dark:text-[#C5A15B]">{activeMember.normalizedE164}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B6357] dark:text-[#81796D]">Status:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Active &amp; verified</span>
          </div>
        </div>

        <Button
          size="lg"
          variant="gold"
          onClick={() => setMemberScreen('dashboard')}
          className="w-full"
          icon={<ArrowRight className="w-4 h-4 text-black" />}
        >
          Go to your dashboard
        </Button>
      </div>
    </div>
  );
};
