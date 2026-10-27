/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  ArrowRight,
  Lock,
  Phone,
  KeyRound,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SignInScreen: React.FC = () => {
  const { t, allMembers, switchActiveMember, setMemberScreen, addToast } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callingCode, setCallingCode] = useState('+234');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number or select a demonstration account below.');
      return;
    }
    // Match against mock members
    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    const found = allMembers.find(m => m.rawPhone.includes(cleanNum) || m.normalizedE164.includes(cleanNum));

    if (found) {
      switchActiveMember(found.id);
      setMemberScreen('dashboard');
    } else {
      // Pick first member and notify
      switchActiveMember(allMembers[0].id);
      addToast('Simulating sign-in with sample member account.', 'info');
      setMemberScreen('dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg mx-auto mb-3">
            GS
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t('signInTitle')}</h1>
          <p className="text-xs text-slate-500 mt-1">{t('signInDesc')}</p>
        </div>

        {/* Phase 1 Disclaimer */}
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <strong>Notice:</strong> Production authentication (SMS / OTP) is planned for Phase 2. Select any sample profile below to explore the portal immediately.
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
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden font-mono"
              />
            </div>
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}

          <Button type="submit" size="lg" variant="emerald" className="w-full">
            {t('signInBtn')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Quick Demo Accounts:
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
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-800 block truncate">
                    {m.displayName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {m.countryCode} · {m.normalizedE164}
                  </span>
                </div>
                <Badge variant={m.eligibility === 'eligible' ? 'success' : 'warning'}>
                  {m.eligibility}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setMemberScreen('recovery')}
            className="hover:text-slate-900 underline underline-offset-2 cursor-pointer"
          >
            {t('accountRecoveryTitle')}
          </button>
          <button
            type="button"
            onClick={() => setMemberScreen('register')}
            className="text-teal-700 font-semibold hover:underline cursor-pointer"
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
    addToast('Simulated recovery instructions logged.', 'info');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t('accountRecoveryTitle')}</h1>
          <p className="text-xs text-slate-500 mt-1">{t('accountRecoveryDesc')}</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Simulated Recovery Dispatched</span>
            </div>
            <p className="leading-relaxed">
              In Phase 2, a 6-digit confirmation code will be dispatched to your WhatsApp number ({phone || '+234 800 000 1234'}). For Phase 1 demonstration, you can sign in with any sample account.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setMemberScreen('sign_in')}
              className="w-full mt-2"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('phoneLabel')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 800 000 1234"
                required
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden font-mono"
              />
            </div>

            <Button type="submit" size="lg" variant="primary" className="w-full">
              {t('requestRecoveryBtn')}
            </Button>

            <button
              type="button"
              onClick={() => setMemberScreen('sign_in')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 py-2"
            >
              Cancel and Return
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const VerificationPendingScreen: React.FC = () => {
  const { t, activeMember, setMemberScreen } = useApp();

  return (
    <div className="max-w-md mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('verificationPendingTitle')}</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {t('verificationPendingDesc')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Registered Name:</span>
            <span className="font-semibold text-slate-900">{activeMember.displayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phone (E.164):</span>
            <span className="font-mono font-semibold text-slate-900">{activeMember.normalizedE164}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Opt-In Consent:</span>
            <Badge variant="success">Confirmed &amp; Recorded</Badge>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left">
          <strong>Phase 1 Fast-Track:</strong> Since real SMS carrier APIs are not configured in Phase 1, you can immediately access the Member Dashboard and Download Centre as an active pilot member.
        </div>

        <Button
          size="lg"
          variant="emerald"
          onClick={() => setMemberScreen('dashboard')}
          className="w-full"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Enter Member Dashboard (Demo Mode)
        </Button>
      </div>
    </div>
  );
};
