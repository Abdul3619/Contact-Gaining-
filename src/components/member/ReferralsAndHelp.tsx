/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { AbuseReportCategory } from '../../types';
import { Button } from '../common/Button';
import {
  Copy,
  Check,
  ShieldAlert,
  Send,
} from 'lucide-react';

export const ReferralsAndHelp: React.FC = () => {
  const { activeMember, t, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'referrals' | 'support' | 'abuse' | 'troubleshooting'>('referrals');
  const [copied, setCopied] = useState(false);

  // Support Form State
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);

  // Abuse Report State
  const [abuseOffender, setAbuseOffender] = useState('');
  const [abuseCategory, setAbuseCategory] = useState<AbuseReportCategory>('unsolicited_commercial_spam');
  const [abuseDesc, setAbuseDesc] = useState('');
  const [abuseEvidence, setAbuseEvidence] = useState('');
  const [abuseSending, setAbuseSending] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://contactgaining.community/join?ref=${activeMember.referralCode}`);
    setCopied(true);
    addToast('Your invite link has been copied.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSending(true);
    setTimeout(() => {
      setSupportSending(false);
      setSupportSubject('');
      setSupportMessage('');
      addToast('Thank you. We have received your message.', 'success');
    }, 400);
  };

  const handleAbuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAbuseSending(true);
    setTimeout(() => {
      mockDataService.submitAbuseReport({
        category: abuseCategory,
        reportedPhoneOrName: abuseOffender.trim(),
        description: abuseDesc.trim(),
        evidenceNotes: abuseEvidence.trim(),
      });
      setAbuseSending(false);
      setAbuseOffender('');
      setAbuseDesc('');
      setAbuseEvidence('');
      addToast('Report submitted. We will review it shortly.', 'warning');
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-[#1C1915] dark:text-[#F5F0E6]">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('refTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6357] dark:text-[#A8A196] mt-1">
          {t('refDesc')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5DFD5] dark:border-[#2B261F] pb-2">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] shadow-xs'
              : 'text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
          }`}
        >
          Invite link
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] shadow-xs'
              : 'text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
          }`}
        >
          {t('supportTitle')}
        </button>
        <button
          onClick={() => setActiveTab('abuse')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'abuse'
              ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] shadow-xs'
              : 'text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
          }`}
        >
          {t('abuseTitle')}
        </button>
        <button
          onClick={() => setActiveTab('troubleshooting')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'troubleshooting'
              ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] shadow-xs'
              : 'text-[#6B6357] dark:text-[#A8A196] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
          }`}
        >
          Contact import help
        </button>
      </div>

      {/* TAB 1: Referrals */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Link Box */}
          <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">Your personal invite link</h2>
            <p className="text-xs text-[#6B6357] dark:text-[#A8A196] leading-relaxed">
              When someone joins using your link, they are connected to our international network.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-lg border font-mono text-xs truncate bg-[#F6F2EA]/70 dark:bg-[#1D1A15] border-[#E5DFD5] dark:border-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6]">
                https://contactgaining.community/join?ref={activeMember.referralCode}
              </div>
              <Button
                variant="gold"
                size="md"
                onClick={handleCopy}
                icon={copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
              >
                {copied ? 'Copied' : 'Copy link'}
              </Button>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#81796D] uppercase">Members who joined</span>
              <div className="text-3xl font-bold font-mono mt-1 text-[#1C1915] dark:text-[#F5F0E6]">
                {activeMember.totalReferrals}
              </div>
              <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-1">Attributed through your link</p>
            </div>

            <div className="rounded-2xl border p-5 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs">
              <span className="text-xs font-semibold text-[#6B6357] dark:text-[#81796D] uppercase">Account standing</span>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active &amp; verified</span>
              </div>
              <p className="text-xs text-[#6B6357] dark:text-[#A8A196] mt-1">Eligible for all contact releases</p>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="rounded-2xl border p-6 text-xs space-y-3 bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] text-[#6B6357] dark:text-[#A8A196] shadow-xs">
            <h3 className="font-bold text-[#1C1915] dark:text-[#F5F0E6] text-sm">Community standards</h3>
            <ul className="space-y-2 list-disc list-inside leading-relaxed">
              <li>Every member must join voluntarily with their own valid WhatsApp number.</li>
              <li>Duplicate or invalid phone numbers are automatically filtered out.</li>
              <li>Respect fellow members. Unsolicited spamming or scraping violates community rules.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: Support */}
      {activeTab === 'support' && (
        <form onSubmit={handleSupportSubmit} className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">Questions or feedback</h2>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196]">
            Have a question about your account or need help with a contact file? Send us a note.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              type="text"
              required
              value={supportSubject}
              onChange={e => setSupportSubject(e.target.value)}
              placeholder="e.g. Question about importing contacts on iPhone"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full p-3 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="gold" isLoading={supportSending} icon={<Send className="w-4 h-4 text-black" />}>
              Send message
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Report Abuse */}
      {activeTab === 'abuse' && (
        <form onSubmit={handleAbuseSubmit} className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">Report spam or unsolicited messages</h2>
          </div>
          <p className="text-xs text-[#6B6357] dark:text-[#A8A196]">
            We maintain zero tolerance for cold spam, non-consensual broadcast lists, or unwanted group additions.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Phone number or name of the sender
            </label>
            <input
              type="text"
              required
              value={abuseOffender}
              onChange={e => setAbuseOffender(e.target.value)}
              placeholder="e.g. +234 800 000 9999 or display name"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden font-mono text-[#1C1915] dark:text-[#F5F0E6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              What kind of issue occurred?
            </label>
            <select
              value={abuseCategory}
              onChange={e => setAbuseCategory(e.target.value as AbuseReportCategory)}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden cursor-pointer text-[#1C1915] dark:text-[#F5F0E6]"
            >
              <option value="unsolicited_commercial_spam" className="bg-[#FFFFFF] dark:bg-[#15130F]">Unsolicited cold sales pitch or spam</option>
              <option value="non_consensual_broadcast" className="bg-[#FFFFFF] dark:bg-[#15130F]">Added to a WhatsApp group without permission</option>
              <option value="impersonation_fraud" className="bg-[#FFFFFF] dark:bg-[#15130F]">Impersonation or suspicious financial proposal</option>
              <option value="harassment_or_abuse" className="bg-[#FFFFFF] dark:bg-[#15130F]">Harassment or offensive language</option>
              <option value="invalid_phone_number" className="bg-[#FFFFFF] dark:bg-[#15130F]">Unreachable or fake phone number</option>
              <option value="other" className="bg-[#FFFFFF] dark:bg-[#15130F]">Other concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Details
            </label>
            <textarea
              required
              rows={3}
              value={abuseDesc}
              onChange={e => setAbuseDesc(e.target.value)}
              placeholder="What happened? Please share details..."
              className="w-full p-3 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1915] dark:text-[#F5F0E6] uppercase tracking-wider mb-1.5">
              Optional notes or timestamps
            </label>
            <input
              type="text"
              value={abuseEvidence}
              onChange={e => setAbuseEvidence(e.target.value)}
              placeholder="e.g. Message sent on Tuesday at 14:00"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-transparent border border-[#E5DFD5] dark:border-[#2B261F] rounded-lg focus:border-[#C5A15B] outline-hidden text-[#1C1915] dark:text-[#F5F0E6]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="danger" isLoading={abuseSending} icon={<ShieldAlert className="w-4 h-4" />}>
              Submit report
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: Troubleshooting */}
      {activeTab === 'troubleshooting' && (
        <div className="rounded-2xl border p-6 sm:p-7 transition-colors bg-[#FFFFFF] dark:bg-[#15130F] border-[#E5DFD5] dark:border-[#2B261F] shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#1C1915] dark:text-[#F5F0E6]">Help importing contacts (.vcf)</h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 bg-[#F6F2EA]/70 dark:bg-[#1D1A15]">
              <h3 className="font-bold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
                WhatsApp is not showing the new contacts yet
              </h3>
              <p className="text-[#6B6357] dark:text-[#A8A196] leading-relaxed text-xs">
                Open WhatsApp, start a new chat, tap the three dots at the top right, and choose <strong>Refresh</strong>. WhatsApp will re-read your device address book.
              </p>
            </div>

            <div className="border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 bg-[#F6F2EA]/70 dark:bg-[#1D1A15]">
              <h3 className="font-bold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
                Preventing duplicates on your phone
              </h3>
              <p className="text-[#6B6357] dark:text-[#A8A196] leading-relaxed text-xs">
                To keep your contact book tidy, download the &quot;Newly joined members&quot; batch each week rather than downloading the entire directory repeatedly.
              </p>
            </div>

            <div className="border border-[#E5DFD5] dark:border-[#2B261F] rounded-xl p-4 bg-[#F6F2EA]/70 dark:bg-[#1D1A15]">
              <h3 className="font-bold text-[#1C1915] dark:text-[#F5F0E6] mb-1">
                Opening .vcf files on iPhone
              </h3>
              <p className="text-[#6B6357] dark:text-[#A8A196] leading-relaxed text-xs">
                We recommend using Safari to download contact files on iOS. Open the file from the Files app and tap <strong>Add All Contacts</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
