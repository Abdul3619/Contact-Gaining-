/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchableCountrySelect } from '../common/SearchableCountrySelect';
import { COUNTRIES, getCountryByCode, getCountryByDialCode } from '../../data/countries';
import { normalizePhoneNumber } from '../../services/phoneUtils';
import { mockDataService } from '../../services/mockDataService';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  WhatsAppStatusNotice,
  ContactPermanenceNotice,
} from '../common/Disclaimers';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const RegistrationFlow: React.FC = () => {
  const { locale, setLocale, t, setMemberScreen, refreshData, addToast } = useApp();

  // Multi-step progress: 1: Details & Country, 2: Phone & Language, 3: Consent & Review
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [countryCode, setCountryCode] = useState('NG'); // Default to Nigeria, but can pick ANY country
  const [phoneCallingCode, setPhoneCallingCode] = useState('+234'); // Independent calling code
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

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!displayName.trim() || displayName.trim().length < 3) {
      errs.displayName = 'Display name must be at least 3 characters.';
    }
    if (!countryCode) {
      errs.countryCode = 'Please select your country of residence.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!rawPhone.trim()) {
      errs.rawPhone = 'WhatsApp phone number is required.';
    } else if (!phoneValidation.isValid) {
      errs.rawPhone = phoneValidation.errorMessage || 'Please enter a valid phone number for this calling code.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!consentExport) {
      errs.consentExport = 'You must grant voluntary consent to share your details with eligible members.';
    }
    if (!acknowledgeNoWipe) {
      errs.acknowledgeNoWipe = 'You must acknowledge that previously exported contacts cannot be wiped from physical devices.';
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

  const handleSubmit = () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = mockDataService.registerMember({
        displayName: displayName.trim(),
        countryCode,
        phoneCallingCode,
        rawPhone: rawPhone.trim(),
        normalizedE164: phoneValidation.e164,
        preferredLanguage,
        referralCode: referralCode.trim() || undefined,
        consentedToExport: consentExport,
        acknowledgedNoRemoteWipe: acknowledgeNoWipe,
      });

      setIsSubmitting(false);

      if (res.success) {
        refreshData();
        addToast(`Registration recorded! Welcome, ${res.member.displayName}.`, 'success');
        setMemberScreen('verification_pending');
      } else {
        setErrors({ submit: res.error || 'Failed to complete registration.' });
      }
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Stepper Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Back to Overview' : 'Previous Step'}</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('regTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join the consensual, international WhatsApp network. Free pilot phase.
        </p>

        {/* Progress Tracker */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div
            className={`h-2 rounded-full transition-all ${
              step >= 1 ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all ${
              step >= 2 ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all ${
              step >= 3 ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          />
        </div>

        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-2">
          <span className={step === 1 ? 'text-teal-700 font-bold' : ''}>{t('regStep1')}</span>
          <span className={step === 2 ? 'text-teal-700 font-bold' : ''}>{t('regStep2')}</span>
          <span className={step === 3 ? 'text-teal-700 font-bold' : ''}>{t('regStep3')}</span>
        </div>
      </div>

      {/* STEP 1: Basic Info & Residence Country */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t('displayNameLabel')} *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={t('displayNamePlaceholder')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-colors outline-hidden ${
                errors.displayName
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-slate-300 focus:border-slate-900'
              }`}
            />
            {errors.displayName ? (
              <p className="text-xs text-rose-600 mt-1.5">{errors.displayName}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1.5">
                This name will appear on contact cards (e.g. "Amara Diallo · Design Studio").
              </p>
            )}
          </div>

          <div>
            <SearchableCountrySelect
              mode="country"
              label={t('countryLabel') + ' *'}
              value={countryCode}
              onChange={(code, country) => {
                setCountryCode(code);
                // Also optionally pre-fill calling code if not set
                if (!rawPhone) {
                  setPhoneCallingCode(country.dialCode);
                }
              }}
              locale={locale}
              error={errors.countryCode}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Select your current country of residence. This is independent from your phone calling code.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t('referralCodeLabel')}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              placeholder={t('referralCodePlaceholder')}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm transition-colors uppercase outline-hidden focus:border-slate-900 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              If an existing member invited you, enter their code here.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button size="lg" variant="emerald" onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Phone Setup
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Phone Number & Normalization */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('phoneLabel')} *
                </label>
                <input
                  type="tel"
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border rounded-xl transition-colors outline-hidden font-mono ${
                    errors.rawPhone
                      ? 'border-rose-400 focus:border-rose-600'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
              </div>
            </div>

            {errors.rawPhone && (
              <p className="text-xs text-rose-600">{errors.rawPhone}</p>
            )}

            {/* Live E.164 Normalization Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">International Normalization Preview</span>
                {phoneValidation.isValid ? (
                  <Badge variant="success">E.164 Valid</Badge>
                ) : rawPhone ? (
                  <Badge variant="warning">Checking Format...</Badge>
                ) : (
                  <Badge variant="neutral">Pending Input</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 block">Normalized E.164:</span>
                  <span className="font-semibold text-slate-900">
                    {phoneValidation.e164 || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">International Format:</span>
                  <span className="font-semibold text-slate-900">
                    {phoneValidation.internationalFormat || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t('langLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredLanguage('en')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors cursor-pointer ${
                  preferredLanguage === 'en'
                    ? 'border-teal-500 bg-teal-50/60 text-teal-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🇬🇧 English
                <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                  Standard releases &amp; notifications
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreferredLanguage('fr')}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors cursor-pointer ${
                  preferredLanguage === 'fr'
                    ? 'border-teal-500 bg-teal-50/60 text-teal-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                🇫🇷 Français
                <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                  Diffusions et interface en français
                </span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button size="lg" variant="emerald" onClick={handleNext} icon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Review &amp; Consent
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Explicit Consents & Review Before Submission */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t('reviewBeforeSubmit')}
            </h3>
            <p className="text-xs text-slate-500">
              Please inspect your submitted details carefully.
            </p>
          </div>

          {/* Submission Summary Table */}
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="p-3 flex justify-between items-center">
              <span className="text-slate-500">{t('displayNameLabel')}</span>
              <span className="font-semibold text-slate-900">{displayName}</span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-slate-500">{t('countryLabel')}</span>
              <span className="font-semibold text-slate-900">
                {selectedCountry.flag} {selectedCountry.name} ({countryCode})
              </span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-slate-500">Normalized Phone (E.164)</span>
              <span className="font-semibold font-mono text-slate-900">
                {phoneValidation.e164}
              </span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-slate-500">{t('langLabel')}</span>
              <span className="font-semibold uppercase">{preferredLanguage}</span>
            </div>
            {referralCode && (
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">Referral Code</span>
                <span className="font-mono text-slate-900">{referralCode}</span>
              </div>
            )}
          </div>

          {/* Mandatory Consents */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Required Legal &amp; Voluntary Consents
            </h4>

            {/* Consent 1 */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
              <input
                type="checkbox"
                checked={consentExport}
                onChange={e => setConsentExport(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 shrink-0"
              />
              <div className="text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  1. Voluntary Contact Sharing Consent (Mandatory)
                </span>
                {t('consentCheck1')}
              </div>
            </label>
            {errors.consentExport && (
              <p className="text-xs text-rose-600">{errors.consentExport}</p>
            )}

            {/* Consent 2 */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-slate-50/50">
              <input
                type="checkbox"
                checked={acknowledgeNoWipe}
                onChange={e => setAcknowledgeNoWipe(e.target.checked)}
                className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 shrink-0"
              />
              <div className="text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  2. Contact File Permanence Acknowledgment (Mandatory)
                </span>
                {t('consentCheck2')}
              </div>
            </label>
            {errors.acknowledgeNoWipe && (
              <p className="text-xs text-rose-600">{errors.acknowledgeNoWipe}</p>
            )}
          </div>

          {/* Disclaimers */}
          <WhatsAppStatusNotice />

          {/* Verification Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Phase 1 Notice:</strong> In this phase, submitting registers your demo profile and logs double opt-in consent. Real SMS / WhatsApp OTP verification is scheduled for Phase 2.
              </div>
            </div>
          </div>

          {errors.submit && (
            <p className="text-xs text-rose-600 font-semibold">{errors.submit}</p>
          )}

          <div className="pt-4 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button
              size="lg"
              variant="emerald"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              {t('submitRegistration')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
