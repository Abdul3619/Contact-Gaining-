/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabaseService } from '../../services/supabaseService';
import { Button } from '../common/Button';
import {
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Lock,
} from 'lucide-react';

export const SignInScreen: React.FC = () => {
  const {
    t,
    allMembers,
    switchActiveMember,
    setMemberScreen,
    signInWithSupabase,
    isBackendConfigured,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await signInWithSupabase(email.trim().toLowerCase(), password);
    setIsLoading(false);

    if (res.success) {
      setMemberScreen('dashboard');
    } else {
      setError(res.error || 'Invalid credentials or user not found.');
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

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@example.com"
                required
                className="w-full min-h-[44px] px-3.5 py-2 pl-9 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
              />
              <Mail className="w-4 h-4 text-[#81796D] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setMemberScreen('recovery')}
                className="text-xs text-[#9D7B43] dark:text-[#C5A15B] hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                required
                className="w-full min-h-[44px] px-3.5 py-2 pl-9 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
              />
              <Lock className="w-4 h-4 text-[#81796D] absolute left-3 top-3.5" />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <Button type="submit" size="lg" variant="gold" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : t('signInBtn')}
          </Button>
        </form>

        {/* Quick Profile Selection for Testing / Demo */}
        <div className="mt-6 pt-6 border-t border-[#E5DFD5] dark:border-[#2B261F]">
          <span className="text-[11px] font-semibold text-[#6B6357] dark:text-[#81796D] uppercase tracking-wider block mb-3">
            {isBackendConfigured ? 'Available Test Accounts:' : 'Demonstration Profiles:'}
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
  const { t, setMemberScreen } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = await supabaseService.requestPasswordReset(email.trim().toLowerCase());
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 text-[#1C1915] dark:text-[#F5F0E6]">
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
        <button
          onClick={() => setMemberScreen('sign_in')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </button>

        {!submitted ? (
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#F0ECE1] dark:bg-[#1D1A15] border border-[#E5DFD5] dark:border-[#2B261F] text-[#9D7B43] dark:text-[#C5A15B] flex items-center justify-center font-bold text-sm mb-4">
              <KeyRound className="w-5 h-5" />
            </div>

            <h1 className="text-xl font-bold tracking-tight mb-1">
              {t('accountRecoveryTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed mb-6">
              Enter the email address associated with your Contact Gaining account. We will send you instructions to reset your password.
            </p>

            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Account Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="name@example.com"
                  required
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
                />
              </div>

              {error && <p className="text-xs text-rose-500">{error}</p>}

              <Button type="submit" size="lg" variant="gold" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending instructions...' : 'Send Recovery Instructions'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Check your inbox</h2>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              If an account is registered with <strong className="text-[#1C1915] dark:text-[#F5F0E6]">{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Button
              variant="secondary"
              onClick={() => setMemberScreen('sign_in')}
              className="w-full mt-4"
            >
              Return to sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const VerificationPendingScreen: React.FC = () => {
  const { setMemberScreen } = useApp();

  return (
    <div className="max-w-md mx-auto py-8 px-4 text-[#1C1915] dark:text-[#F5F0E6]">
      <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#C5A15B]/15 text-[#9D7B43] dark:text-[#C5A15B] flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold">Email Verification Required</h1>
        <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
          Please check your inbox and tap the verification link to confirm your account and activate contact exchange eligibility.
        </p>
        <Button
          variant="gold"
          onClick={() => setMemberScreen('dashboard')}
          className="w-full"
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
};
