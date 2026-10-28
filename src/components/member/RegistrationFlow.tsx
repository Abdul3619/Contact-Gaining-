/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { COUNTRIES, getCountryByCode } from '../../data/countries';
import { normalizePhoneNumber } from '../../services/phoneUtils';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { WhatsAppStatusNotice } from '../common/Disclaimers';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

export const RegistrationFlow: React.FC = () => {
  const { locale, t, setMemberScreen, refreshData, addToast, signUpWithSupabase } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('NG');
  const [phoneCallingCode, setPhoneCallingCode] = useState('+234');
  const [rawPhone, setRawPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'fr'>(locale);

  // Consents
  const [consentExport, setConsentExport] = useState(false);
  const [acknowledgeNoWipe, setAcknowledgeNoWipe] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone Validation via libphonenumber-js
  const phoneValidation = useMemo(() => {
    return normalizePhoneNumber(rawPhone, phoneCallingCode, countryCode);
  }, [rawPhone, phoneCallingCode, countryCode]);

  const selectedCountry = getCountryByCode(countryCode) || COUNTRIES[0];

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!displayName.trim() || displayName.trim().length < 2) {
      errs.displayName = 'Please enter your name or business name.';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (!countryCode) {
      errs.countryCode = 'Please select the country where you reside.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!rawPhone.trim()) {
      errs.rawPhone = 'Please enter your WhatsApp phone number.';
    } else if (!phoneValidation.isValid) {
      errs.rawPhone = phoneValidation.errorMessage || 'Please enter a valid phone number for this country code.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!consentExport) {
      errs.consentExport = 'Please check the box to confirm you wish to share your details.';
    }
    if (!acknowledgeNoWipe) {
      errs.acknowledgeNoWipe = 'Please confirm you understand how phone downloads work.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    } else {
      setMemberScreen('landing');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrors({});

    const res = await signUpWithSupabase({
      email: email.trim().toLowerCase(),
      password,
      displayName: displayName.trim(),
      countryCode,
      phoneCallingCode,
      rawPhone: rawPhone.trim(),
      preferredLanguage,
      referralCode: referralCode.trim() || undefined,
      termsVersion: '2026.1',
    });

    setIsSubmitting(false);

    if (res.success) {
      refreshData();
      addToast('Registration submitted! Your profile is pending verification before contact release inclusion.', 'info');
      setMemberScreen('verification_pending');
    } else {
      setErrors({ submit: res.error || 'Unable to complete registration. Please check your details.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Stepper Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6357] hover:text-[#1C1915] dark:text-[#A8A196] dark:hover:text-[#F5F0E6] mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Back to overview' : 'Previous step'}</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight">
          {t('regTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1">
          Step {step} of 3 — Join fellow creators and entrepreneurs.
        </p>

        {/* Progress Tracker */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 1 ? 'bg-[#C5A15B]' : 'bg-[#E5DFD5] dark:bg-[#2B261F]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 2 ? 'bg-[#C5A15B]' : 'bg-[#E5DFD5] dark:bg-[#2B261F]'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step >= 3 ? 'bg-[#C5A15B]' : 'bg-[#E5DFD5] dark:bg-[#2B261F]'
            }`}
          />
        </div>

        <div className="flex justify-between text-[11px] font-medium text-[#6B6357] dark:text-[#81796D] mt-2">
          <span className={step === 1 ? 'text-[#9D7B43] dark:text-[#C5A15B] font-bold' : ''}>{t('regStep1')}</span>
          <span className={step === 2 ? 'text-[#9D7B43] dark:text-[#C5A15B] font-bold' : ''}>{t('regStep2')}</span>
          <span className={step === 3 ? 'text-[#9D7B43] dark:text-[#C5A15B] font-bold' : ''}>{t('regStep3')}</span>
        </div>
      </div>

      {/* STEP 1: Basic Info & Residence Country */}
      {step === 1 && (
        <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-2">
              {t('displayNameLabel')} *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={t('displayNamePlaceholder')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border rounded-lg text-sm transition-colors outline-hidden text-[#1C1915] dark:text-[#F5F0E6] placeholder:text-[#81796D] ${
                errors.displayName
                  ? 'border-rose-500 focus:border-rose-600'
                  : 'border-[#E5DFD5] focus:border-[#C5A15B] dark:border-[#2B261F]'
              }`}
            />
            {errors.displayName ? (
              <p className="text-xs text-rose-500 mt-1.5">{errors.displayName}</p>
            ) : (
              <p className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1.5">
                This is how you will appear in members&apos; contact books.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border rounded-lg text-sm transition-colors outline-hidden text-[#1C1915] dark:text-[#F5F0E6] placeholder:text-[#81796D] ${
                  errors.email
                    ? 'border-rose-500 focus:border-rose-600'
                    : 'border-[#E5DFD5] focus:border-[#C5A15B] dark:border-[#2B261F]'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-2">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className={`w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border rounded-lg text-sm transition-colors outline-hidden text-[#1C1915] dark:text-[#F5F0E6] placeholder:text-[#81796D] ${
                  errors.password
                    ? 'border-rose-500 focus:border-rose-600'
                    : 'border-[#E5DFD5] focus:border-[#C5A15B] dark:border-[#2B261F]'
                }`}
              />
              {errors.password && <p className="text-xs text-rose-500 mt-1.5">{errors.password}</p>}
            </div>
          </div>

          <div>
            <SearchableCountrySelect
              mode="country"
              label={t('countryLabel') + ' *'}
              value={countryCode}
              onChange={(code, country) => {
                setCountryCode(code);
                if (!rawPhone) {
                  setPhoneCallingCode(country.dialCode);
                }
              }}
              locale={locale}
              error={errors.countryCode}
            />
            <p className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1.5">
              Select your current country of residence.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-2">
              {t('referralCodeLabel')}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              placeholder={t('referralCodePlaceholder')}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg text-sm transition-colors uppercase outline-hidden focus:border-[#C5A15B] font-mono text-[#1C1915] dark:text-[#F5F0E6]"
            />
            <p className="text-[11px] text-[#6B6357] dark:text-[#81796D] mt-1.5">
              If an existing member invited you, enter their invite code here.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button size="lg" variant="gold" onClick={handleNext} icon={<ArrowRight className="w-4 h-4 text-black" />}>
              Continue to phone setup
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Phone Number & Normalization */}
      {step === 2 && (
        <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <SearchableCountrySelect
                  mode="dialCode"
                  label={t('callingCodeLabel')}
                  value={phoneCallingCode}
                  onChange={(dialCode) => setPhoneCallingCode(dialCode)}
                  locale={locale}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
                  {t('phoneLabel')} *
                </label>
                <input
                  type="tel"
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border rounded-lg transition-colors outline-hidden font-mono text-[#1C1915] dark:text-[#F5F0E6] ${
                    errors.rawPhone
                      ? 'border-rose-500 focus:border-rose-600'
                      : 'border-[#E5DFD5] focus:border-[#C5A15B] dark:border-[#2B261F]'
                  }`}
                />
              </div>
            </div>

            {errors.rawPhone && (
              <p className="text-xs text-rose-500">{errors.rawPhone}</p>
            )}

            {/* Clean Live Normalization Preview */}
            <div className="p-4 rounded-xl border text-xs space-y-2 bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border-[#E5DFD5] dark:border-[#2B261F]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">
                  Phone number preview
                </span>
                {phoneValidation.isValid ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Valid format
                  </span>
                ) : rawPhone ? (
                  <span className="text-amber-700 dark:text-amber-400 font-medium">Checking...</span>
                ) : (
                  <span className="text-[#6B6357] dark:text-[#81796D]">Enter number</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-[#6B6357] dark:text-[#A8A196]">
                <div>
                  <span className="text-[#6B6357] dark:text-[#81796D] block">International format:</span>
                  <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">
                    {phoneValidation.e164 || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6357] dark:text-[#81796D] block">Display format:</span>
                  <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">
                    {phoneValidation.internationalFormat || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-2">
              {t('langLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredLanguage('en')}
                className={`p-3 rounded-lg border text-left text-xs font-semibold transition-colors cursor-pointer ${
                  preferredLanguage === 'en'
                    ? 'border-[#9D7B43] dark:border-[#C5A15B] bg-[#C5A15B]/10 text-[#9D7B43] dark:text-[#C5A15B]'
                    : 'border-[#E5DFD5] dark:border-[#2B261F] text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F6F2EA] dark:hover:bg-[#1D1A15]'
                }`}
              >
                English
                <span className="block text-[11px] font-normal text-[#6B6357] dark:text-[#81796D] mt-0.5">
                  Standard interface
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreferredLanguage('fr')}
                className={`p-3 rounded-lg border text-left text-xs font-semibold transition-colors cursor-pointer ${
                  preferredLanguage === 'fr'
                    ? 'border-[#9D7B43] dark:border-[#C5A15B] bg-[#C5A15B]/10 text-[#9D7B43] dark:text-[#C5A15B]'
                    : 'border-[#E5DFD5] dark:border-[#2B261F] text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F6F2EA] dark:hover:bg-[#1D1A15]'
                }`}
              >
                Français
                <span className="block text-[11px] font-normal text-[#6B6357] dark:text-[#81796D] mt-0.5">
                  Interface en français
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button size="lg" variant="gold" onClick={handleNext} icon={<ArrowRight className="w-4 h-4 text-black" />}>
              Review and confirm
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Consents & Review Before Submission */}
      {step === 3 && (
        <div className="rounded-2xl border p-6 sm:p-8 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              {t('reviewBeforeSubmit')}
            </h2>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196]">
              Please check your information before joining.
            </p>
          </div>

          {/* Submission Summary Table */}
          <div className="rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] divide-y divide-[#E5DFD5] dark:divide-[#2B261F] text-xs sm:text-sm">
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-[#6B6357] dark:text-[#81796D]">{t('displayNameLabel')}</span>
              <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">{displayName}</span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-[#6B6357] dark:text-[#81796D]">{t('countryLabel')}</span>
              <span className="font-semibold text-[#1C1915] dark:text-[#F5F0E6]">
                {selectedCountry.flag} {selectedCountry.name}
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-[#6B6357] dark:text-[#81796D]">WhatsApp number</span>
              <span className="font-semibold font-mono text-[#9D7B43] dark:text-[#C5A15B]">
                {phoneValidation.e164}
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center">
              <span className="text-[#6B6357] dark:text-[#81796D]">{t('langLabel')}</span>
              <span className="font-semibold uppercase">{preferredLanguage}</span>
            </div>
            {referralCode && (
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-[#6B6357] dark:text-[#81796D]">Invite code</span>
                <span className="font-mono text-[#1C1915] dark:text-[#F5F0E6]">{referralCode}</span>
              </div>
            )}
          </div>

          {/* Consents */}
          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider">
              Your sharing permissions
            </h3>

            {/* Consent 1 */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] transition-colors cursor-pointer bg-[#F6F2EA]/70 dark:bg-[#1D1A15]">
              <input
                type="checkbox"
                checked={consentExport}
                onChange={e => setConsentExport(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#C5A15B] rounded border-[#E5DFD5] dark:border-[#2B261F] focus:ring-[#C5A15B] shrink-0 cursor-pointer"
              />
              <div className="text-xs leading-relaxed text-[#1C1915] dark:text-[#F5F0E6]">
                <span className="font-semibold block mb-0.5">
                  1. Permission to share contact details
                </span>
                <span className="text-[#6B6357] dark:text-[#A8A196]">
                  {t('consentCheck1')}
                </span>
              </div>
            </label>
            {errors.consentExport && (
              <p className="text-xs text-rose-500">{errors.consentExport}</p>
            )}

            {/* Consent 2 */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-[#E5DFD5] dark:border-[#2B261F] hover:border-[#9D7B43] dark:hover:border-[#C5A15B] transition-colors cursor-pointer bg-[#F6F2EA]/70 dark:bg-[#1D1A15]">
              <input
                type="checkbox"
                checked={acknowledgeNoWipe}
                onChange={e => setAcknowledgeNoWipe(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#C5A15B] rounded border-[#E5DFD5] dark:border-[#2B261F] focus:ring-[#C5A15B] shrink-0 cursor-pointer"
              />
              <div className="text-xs leading-relaxed text-[#1C1915] dark:text-[#F5F0E6]">
                <span className="font-semibold block mb-0.5">
                  2. Understanding phone downloads
                </span>
                <span className="text-[#6B6357] dark:text-[#A8A196]">
                  {t('consentCheck2')}
                </span>
              </div>
            </label>
            {errors.acknowledgeNoWipe && (
              <p className="text-xs text-rose-500">{errors.acknowledgeNoWipe}</p>
            )}
          </div>

          <WhatsAppStatusNotice />

          {errors.submit && (
            <p className="text-xs text-rose-500 font-semibold">{errors.submit}</p>
          )}

          <div className="pt-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button
              size="lg"
              variant="gold"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              icon={<Check className="w-4 h-4 text-black" />}
            >
              {t('submitRegistration')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
