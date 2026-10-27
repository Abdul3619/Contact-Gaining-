/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lock,
  Check,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  WhatsAppStatusNotice,
  ContactPermanenceNotice,
  CommunityInvitationNotice,
} from '../common/Disclaimers';
import { FounderCard } from '../common/FounderCard';

export const LandingPage: React.FC = () => {
  const { t, setViewMode, setMemberScreen, addToast } = useApp();

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#9D7B43] dark:text-[#C5A15B] mb-3">
          {t('growthBannerTitle')}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight leading-tight sm:leading-tight mb-5">
          {t('heroHeadline')}
        </h1>

        <p className="text-base sm:text-lg text-[#6B6357] dark:text-[#A8A196] max-w-2xl mx-auto leading-relaxed mb-8">
          {t('heroSubhead')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          <Button
            size="lg"
            variant="gold"
            onClick={() => {
              setViewMode('member');
              setMemberScreen('register');
            }}
            icon={<ArrowRight className="w-5 h-5 text-black" />}
          >
            {t('heroCtaRegister')}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('heroCtaHow')}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#6B6357] dark:text-[#A8A196] font-medium">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#9D7B43] dark:text-[#C5A15B]" />
            International community
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#9D7B43] dark:text-[#C5A15B]" />
            Voluntary contact sharing
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#9D7B43] dark:text-[#C5A15B]" />
            Easy withdrawal anytime
          </span>
        </div>
      </section>

      {/* Real-World Disclaimers (Honest & Balanced) */}
      <section className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <WhatsAppStatusNotice />
        <ContactPermanenceNotice />
      </section>

      {/* How Contact Exchange Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight">
            How Contact Gaining works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-2">
            Four straightforward steps to expand your WhatsApp network respectfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="rounded-2xl p-6 border transition-all flex flex-col justify-between bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#F0ECE1] dark:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] border border-[#E5DFD5] dark:border-[#2B261F] flex items-center justify-center font-mono font-bold text-xs mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-2">
                {t('step1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl p-6 border transition-all flex flex-col justify-between bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#F0ECE1] dark:bg-[#1D1A15] text-[#9D7B43] dark:text-[#C5A15B] border border-[#9D7B43]/30 dark:border-[#C5A15B]/30 flex items-center justify-center font-mono font-bold text-xs mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-2">
                {t('step2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl p-6 border transition-all flex flex-col justify-between bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#F0ECE1] dark:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] border border-[#E5DFD5] dark:border-[#2B261F] flex items-center justify-center font-mono font-bold text-xs mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-2">
                {t('step3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl p-6 border transition-all flex flex-col justify-between bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-lg bg-[#F0ECE1] dark:bg-[#1D1A15] text-[#1C1915] dark:text-[#F5F0E6] border border-[#E5DFD5] dark:border-[#2B261F] flex items-center justify-center font-mono font-bold text-xs mb-4">
                04
              </div>
              <h3 className="text-base font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-2">
                {t('step4Title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Commitments */}
      <section id="privacy-sharing" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="rounded-3xl p-7 sm:p-10 border transition-colors bg-[#1C1915] text-[#F5F0E6] border-[#2B261F] shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-[#C5A15B] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Our privacy and sharing standards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A8A196] mb-6 leading-relaxed">
            Contact Gaining is built for people who want genuine connections. We hold ourselves to clear standards so you are always in control of your details.
          </p>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-start gap-3 bg-[#15130F] p-4 rounded-xl border border-[#2B261F]">
              <Check className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">Always voluntary</strong>
                <p className="text-[#A8A196]">You only appear in contact files if you explicitly sign up and choose to share your details.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#15130F] p-4 rounded-xl border border-[#2B261F]">
              <Check className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">Announcement channel privacy</strong>
                <p className="text-[#A8A196]">Joining our WhatsApp channel is optional and never exposes or shares your phone number with others.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#15130F] p-4 rounded-xl border border-[#2B261F]">
              <Check className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">Withdraw anytime</strong>
                <p className="text-[#A8A196]">You can withdraw your details from your profile settings. Your number will be excluded from all future contact releases.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#15130F] p-4 rounded-xl border border-[#2B261F]">
              <Check className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">Clean contact files</strong>
                <p className="text-[#A8A196]">We remove duplicate numbers, filter invalid formats, and ensure you never receive your own number in a file.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#15130F] p-4 rounded-xl border border-[#2B261F]">
              <Check className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium mb-0.5">Honest expectations</strong>
                <p className="text-[#A8A196]">We never promise guaranteed status views, sales, or instant responses. Authentic networking takes real communication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <div id="about-founder" className="scroll-mt-20">
        <FounderCard variant="section" />
      </div>

      {/* WhatsApp Community Channel Notice */}
      <section className="max-w-4xl mx-auto px-4">
        <CommunityInvitationNotice />
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-[#1C1915] dark:text-[#F5F0E6]">Community announcement channel</h3>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-0.5">Get notified when new batches of member contacts are released.</p>
          </div>
          <button
            onClick={() => {
              addToast('Opening announcement channel preview. No contact data is shared through this channel.', 'info');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer bg-[#1C1915] text-[#F5F0E6] hover:bg-[#2B261F] dark:bg-[#1D1A15] dark:text-[#C5A15B] dark:border dark:border-[#C5A15B]/30 dark:hover:bg-[#25221D]"
          >
            <MessageSquare className="w-4 h-4 text-[#C5A15B]" />
            <span>{t('joinCommunityBtn')}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1915] dark:text-[#F5F0E6] tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1">
            Common questions about member sharing, contact files, and privacy.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="rounded-2xl p-5 border transition-colors bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <h3 className="text-sm font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              Who can join Contact Gaining?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              Anyone with a valid WhatsApp phone number who wants to network authentically. We welcome creators, professionals, and small business owners from all countries.
            </p>
          </div>

          <div className="rounded-2xl p-5 border transition-colors bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <h3 className="text-sm font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              Will people automatically see my WhatsApp Status?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              No. WhatsApp only displays status updates when both people have saved each other in their phone address books. You will need to reach out, say hello, and invite members to save your number too.
            </p>
          </div>

          <div className="rounded-2xl p-5 border transition-colors bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <h3 className="text-sm font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              Can I leave if I change my mind?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              Yes, anytime. When you withdraw your consent in your profile, your number is immediately removed from all future release files.
            </p>
          </div>

          <div className="rounded-2xl p-5 border transition-colors bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
            <h3 className="text-sm font-semibold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
              How do I import downloaded contacts into my phone?
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              The platform generates a standard .vcf file. On iPhone and Android, simply tap the file after downloading and choose to add all contacts to your address book.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 pb-8">
        <div className="rounded-3xl p-8 sm:p-10 border transition-colors bg-[#F6F2EA] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F]">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1915] dark:text-[#F5F0E6] mb-2.5">
            Ready to expand your WhatsApp network?
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] max-w-lg mx-auto mb-6">
            Joining takes less than two minutes. Share your details with real people who are looking to connect.
          </p>
          <Button
            size="lg"
            variant="gold"
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
