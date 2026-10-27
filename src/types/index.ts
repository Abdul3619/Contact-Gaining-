/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Locale = 'en' | 'fr';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface Country {
  name: string;
  nameFr: string;
  code: string;       // ISO 3166-1 alpha-2 (e.g. 'US', 'GB', 'NG', 'FR', 'KE', 'CI', 'GH', 'BR', 'IN')
  dialCode: string;   // e.g. '+1', '+44', '+234', '+33'
  flag: string;       // Unicode flag emoji
  region: 'Africa' | 'Europe' | 'Americas' | 'Asia' | 'Oceania';
}

export type ConsentStatus = 'consented' | 'withdrawn' | 'pending_review' | 'expired';
export type MemberEligibility = 'eligible' | 'under_review' | 'suspended' | 'withdrawn';

export interface ConsentRecord {
  id: string;
  memberId: string;
  timestamp: string;
  consentedToExport: boolean;
  acknowledgedNoRemoteWipe: boolean;
  termsVersion: string;
  ipHashSample: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface Member {
  id: string;
  displayName: string;
  countryCode: string;       // Residence country ISO code
  phoneCallingCode: string;  // Calling code e.g. '+44'
  rawPhone: string;
  normalizedE164: string;    // Standard E.164 (e.g. '+447911123456')
  preferredLanguage: Locale;
  referralCode: string;
  referredByCode?: string;
  consent: ConsentRecord;
  eligibility: MemberEligibility;
  registeredAt: string;
  lastActiveAt: string;
  downloadCount: number;
  totalReferrals: number;
  isSampleRecord: boolean;
  previouslyAllocatedContactIds?: string[];
}

export interface ContactRelease {
  id: string;
  releaseNumber: number;
  releaseTitle: string;
  publishedAt: string;
  totalEligibleContacts: number;
  incrementalNewContacts: number;
  fileSizeBytes: number;
  hashChecksum: string;
  status: 'published' | 'draft' | 'archived';
  descriptionEn: string;
  descriptionFr: string;
}

export interface DownloadRecord {
  id: string;
  memberId: string;
  releaseId: string;
  releaseNumber: number;
  downloadType: 'full' | 'incremental';
  downloadedAt: string;
  contactCount: number;
  status: 'completed' | 'failed';
}

export interface Referral {
  id: string;
  referrerId: string;
  referredMemberId: string;
  referredName: string;
  referredCountry: string;
  registeredAt: string;
  status: 'active_consented' | 'pending_consent' | 'withdrawn';
}

export interface GrowthPhaseConfig {
  growthPhaseActive: boolean; // Growth stage: no fixed weekly download cap
  currentEligibleCount: number;
  futureMonetizationEvaluationThreshold: number; // 1000 members proposed benchmark
  incrementalReleaseDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  maxDailyDownloadAttempts: number;
}

export interface PackagePlan {
  id: string;
  name: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  contactAllowance: number;
  priceUSD: number;
  billingCadence: 'one_time' | 'monthly';
  targetAudience: string;
  isLive: boolean; // false during Phase 2A growth pilot
}

export type AbuseReportCategory = 
  | 'unsolicited_commercial_spam'
  | 'impersonation_fraud'
  | 'harassment_or_abuse'
  | 'non_consensual_broadcast'
  | 'invalid_phone_number'
  | 'other';

export interface AbuseReport {
  id: string;
  reporterMemberId: string;
  reportedPhoneOrName: string;
  category: AbuseReportCategory;
  description: string;
  evidenceNotes?: string;
  submittedAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'admin' | 'system' | 'member';
  action: string;
  details: string;
  ipAddressSample: string;
  metadata?: Record<string, unknown>;
}

export interface SystemSettings {
  growthPhaseActive: boolean;
  registrationOpen: boolean;
  requireDoubleOptInConsent: boolean;
  e164ValidationStrict: boolean;
  disclaimerEnforced: boolean;
  communityInviteLink: string;
  founderPortfolioUrl: string;
}
