/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Globe2,
  Users2,
  DownloadCloud,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  WhatsAppStatusNotice,
  ContactPermanenceNotice,
  CommunityInvitationNotice,
} from '../common/Disclaimers';

export const LandingPage: React.FC = () => {
  const { t, setViewMode, setMemberScreen } = useApp();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{t('pilotBannerTitle')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight sm:leading-tight mb-6">
          {t('heroHeadline')}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          {t('heroSubhead')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
          <Button
            size="lg"
            variant="emerald"
            onClick={() => {
              setViewMode('member');
              setMemberScreen('register');
            }}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            {t('heroCtaRegister')}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('heroCtaHow')}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span>✓ International Coverage</span>
          <span aria-hidden="true">·</span>
          <span>✓ 100% Opt-In Only</span>
          <span aria-hidden="true">·</span>
          <span>✓ Zero Data Scraping</span>
        </div>
      </section>

      {/* Critical Status & Permanence Disclaimers */}
      <section className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <WhatsAppStatusNotice />
        <ContactPermanenceNotice />
      </section>

      {/* How Contact Exchange Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Contact Exchange Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A structured, 4-step process designed for transparency, privacy compliance, and mutual respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t('step1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Searchable ISO 3166-1
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t('step2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Revocable Consent Ledger
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t('step3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              RFC 2426 vCard 3.0
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base mb-4">
                04
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {t('step4Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              Mutual Saves Required
            </div>
          </div>
        </div>
      </section>

      {/* Consent & Privacy Principles */}
      <section id="consent-privacy" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-teal-400 shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Our 5 Core Consent &amp; Privacy Commitments
            </h2>
          </div>
          <p className="text-sm text-slate-300 mb-8 leading-relaxed">
            Unlike informal scraping bots or random WhatsApp contact-gain groups, GlobalSphere operates under strict privacy and boundary guidelines.
          </p>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">1. Truly Voluntary Opt-In</strong>
                <p className="text-slate-300">No member is added automatically. Every participant explicitly fills the registration form and accepts terms.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">2. Community Channel != Redistribution Consent</strong>
                <p className="text-slate-300">Joining our informational WhatsApp community does NOT authorize anyone to redistribute your number.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">3. Revocable at Any Time</strong>
                <p className="text-slate-300">You can withdraw your consent in your Profile. Once withdrawn, your record is purged from all future releases.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">4. Deduplication &amp; Rate Limits</strong>
                <p className="text-slate-300">Duplicate phone numbers are rejected. Members cannot hoard or mass-scrape contact files without verification.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">5. Zero Status Guarantee Misrepresentation</strong>
                <p className="text-slate-300">We never deceive users into thinking that saving contacts guarantees WhatsApp status views.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Community Invite Placeholder */}
      <section className="max-w-4xl mx-auto px-4">
        <CommunityInvitationNotice />
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Official WhatsApp Community Channel</h4>
            <p className="text-xs text-slate-500 mt-0.5">Get announcements, release schedules, and import tutorials.</p>
          </div>
          <a
            href="#community"
            onClick={(e) => {
              e.preventDefault();
              alert('Demonstration Link: In Phase 2, this will open the verified WhatsApp Community announcement channel.');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('joinCommunityBtn')}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="text-sm text-slate-600 mt-1">Clear answers to important questions about Phase 1.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Is GlobalSphere only for Nigeria or West Africa?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. GlobalSphere is an international platform supporting participants across Africa, Europe, the Americas, Asia, and Oceania. Members can select their residence country independently from their phone's international calling code.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Does importing contacts guarantee that people will view my WhatsApp Status?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. WhatsApp statuses are strictly governed by WhatsApp's privacy architecture: both individuals must save each other's phone numbers in their respective address books, and their individual privacy settings must permit status sharing.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              What happens if I decide to withdraw my contact details?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You can withdraw consent anytime from your Profile. Your number is immediately removed from all future weekly exports. However, as noted in the registration agreement, previously downloaded .vcf files cannot be remotely deleted from physical devices of people who downloaded past releases.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              How does the free pilot work, and when will monetization start?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Phase 1 is completely free. Eligible participants receive up to 50 curated contacts per week. Monetization will only be evaluated after reaching the configurable community milestone (initially set to 1,000 eligible participants), and early pilot members will retain their free weekly allowance.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-8 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-teal-950 mb-3">
            Ready to participate in the international pilot?
          </h3>
          <p className="text-sm text-teal-800 max-w-xl mx-auto mb-6">
            Register voluntarily in under 2 minutes. Preview the registration and consent flow with live E.164 validation.
          </p>
          <Button
            size="lg"
            variant="emerald"
            onClick={() => {
              setViewMode('member');
              setMemberScreen('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {t('navRegister')}
          </Button>
        </div>
      </section>
    </div>
  );
};
