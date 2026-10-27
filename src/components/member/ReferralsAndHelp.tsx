/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDataService } from '../../services/mockDataService';
import { AbuseReportCategory } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Users2,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Send,
  LifeBuoy,
  ChevronDown,
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
    navigator.clipboard?.writeText(`https://globalsphere.community/join?ref=${activeMember.referralCode}`);
    setCopied(true);
    addToast('Personal referral link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSending(true);
    setTimeout(() => {
      setSupportSending(false);
      setSupportSubject('');
      setSupportMessage('');
      addToast('Support inquiry logged. Our team will review within 24 hours.', 'success');
    }, 500);
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
      addToast('Abuse incident recorded for moderation review.', 'warning');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('refTitle')} &amp; Safety Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t('refDesc')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Referral Progress
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t('supportTitle')}
        </button>
        <button
          onClick={() => setActiveTab('abuse')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'abuse'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t('abuseTitle')}
        </button>
        <button
          onClick={() => setActiveTab('troubleshooting')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'troubleshooting'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Import Troubleshooting
        </button>
      </div>

      {/* TAB 1: Referrals */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Link Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Your Invitation Code</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              When friends, clients, or colleagues register with your referral link, they receive immediate access to the active pilot directory.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 truncate">
                https://globalsphere.community/join?ref={activeMember.referralCode}
              </div>
              <Button
                variant="emerald"
                size="md"
                onClick={handleCopy}
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied' : 'Copy Invitation Link'}
              </Button>
            </div>
          </div>

          {/* Referral Eligibility & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Your Active Referrals</span>
              <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
                {activeMember.totalReferrals}
              </div>
              <p className="text-xs text-slate-500 mt-1">Sample members credited</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Referral Eligibility</span>
              <div className="text-xl font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span>Eligible</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Active double opt-in</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase">Phase 2 Reward Tier</span>
              <div className="text-xl font-bold text-teal-800 mt-1">
                +25 Contacts / Invite
              </div>
              <p className="text-xs text-slate-500 mt-1">Activates after threshold</p>
            </div>
          </div>

          {/* Referral Rules Explanation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-700 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Referral Program Rules</h3>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li>Referred users must voluntarily register and provide valid E.164 phone numbers with double opt-in consent.</li>
              <li>Self-referrals or duplicate phone numbers are disqualified automatically.</li>
              <li>In Phase 1, referral statistics are logged for demonstration. Real rewards will be issued when Phase 2 launches.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: Support */}
      {activeTab === 'support' && (
        <form onSubmit={handleSupportSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Contact Support Team</h2>
          <p className="text-xs text-slate-500">
            Have questions about the pilot, your allowance, or file compatibility? Let us know.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <input
              type="text"
              required
              value={supportSubject}
              onChange={e => setSupportSubject(e.target.value)}
              placeholder="e.g. Issue importing .vcf file on Samsung Galaxy S23"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              placeholder="Please explain the issue or question in detail..."
              className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" isLoading={supportSending} icon={<Send className="w-4 h-4" />}>
              Submit Inquiry
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: Report Abuse */}
      {activeTab === 'abuse' && (
        <form onSubmit={handleAbuseSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">Report Member Abuse or Spam</h2>
          </div>
          <p className="text-xs text-slate-500">
            We maintain zero tolerance for unsolicited bulk broadcasting, pyramid schemes, harassment, or non-consensual additions to groups.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Offending Number or Display Name
            </label>
            <input
              type="text"
              required
              value={abuseOffender}
              onChange={e => setAbuseOffender(e.target.value)}
              placeholder="e.g. +234 800 000 9999 or 'Crypto Bot'"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Abuse Category
            </label>
            <select
              value={abuseCategory}
              onChange={e => setAbuseCategory(e.target.value as AbuseReportCategory)}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden cursor-pointer"
            >
              <option value="unsolicited_commercial_spam">Unsolicited Commercial Spam / Cold Pitches</option>
              <option value="non_consensual_broadcast">Added to WhatsApp Group without Consent</option>
              <option value="impersonation_fraud">Impersonation or Financial Scam</option>
              <option value="harassment_or_abuse">Harassment or Offensive Behavior</option>
              <option value="invalid_phone_number">Fake or Unreachable Phone Number</option>
              <option value="other">Other Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Details
            </label>
            <textarea
              required
              rows={3}
              value={abuseDesc}
              onChange={e => setAbuseDesc(e.target.value)}
              placeholder="Describe what occurred, timing, and specific messages received..."
              className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Evidence Notes (Optional)
            </label>
            <input
              type="text"
              value={abuseEvidence}
              onChange={e => setAbuseEvidence(e.target.value)}
              placeholder="e.g. Screenshot taken, message header verified"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-slate-900 outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="danger" isLoading={abuseSending} icon={<ShieldAlert className="w-4 h-4" />}>
              Submit Incident Report
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: Troubleshooting */}
      {activeTab === 'troubleshooting' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">VCF Contact Import Troubleshooting Guide</h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-1">
                Issue 1: WhatsApp does not show the newly imported contacts
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                <strong>Solution:</strong> Open WhatsApp &gt; tap the New Chat icon (floating button) &gt; tap the 3-dot menu at top right &gt; tap <strong>Refresh</strong>. WhatsApp re-indexes the system address book.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-1">
                Issue 2: Duplicate contacts created in phone address book
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                <strong>Solution:</strong> In Google Contacts, tap <strong>Fix &amp; Manage &gt; Merge &amp; Fix</strong>. To prevent duplicates going forward, only download the <em>Incremental Batch</em> rather than the full directory repeatedly.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-1">
                Issue 3: iPhone opens .vcf as raw text instead of contacts
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                <strong>Solution:</strong> Download the file using Safari (not third-party browsers). Open the Files app &gt; tap the .vcf file &gt; tap the Share icon &gt; choose <strong>Contacts</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
