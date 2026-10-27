/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Member,
  ContactRelease,
  DownloadRecord,
  GrowthPhaseConfig,
  PackagePlan,
  AbuseReport,
  AuditLogEvent,
  SystemSettings,
  AbuseReportCategory,
  Locale,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_RELEASES,
  INITIAL_GROWTH_CONFIG,
  INITIAL_PACKAGES,
  INITIAL_ABUSE_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_SETTINGS,
} from '../data/sampleData';
import { SampleVCardContact, generateVcfString, triggerVcfDownload } from './vcfGenerator';

const STORAGE_KEYS = {
  MEMBERS: 'contact_gaining_mock_members_v2',
  RELEASES: 'contact_gaining_mock_releases_v2',
  CONFIG: 'contact_gaining_mock_config_v2',
  PACKAGES: 'contact_gaining_mock_packages_v2',
  REPORTS: 'contact_gaining_mock_reports_v2',
  LOGS: 'contact_gaining_mock_logs_v2',
  SETTINGS: 'contact_gaining_mock_settings_v2',
  CURRENT_MEMBER_ID: 'contact_gaining_mock_active_member_id',
};

class MockDataService {
  private members: Member[];
  private releases: ContactRelease[];
  private growthConfig: GrowthPhaseConfig;
  private packages: PackagePlan[];
  private reports: AbuseReport[];
  private logs: AuditLogEvent[];
  private settings: SystemSettings;
  private activeMemberId: string;

  constructor() {
    this.members = this.load(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    this.releases = this.load(STORAGE_KEYS.RELEASES, INITIAL_RELEASES);
    this.growthConfig = this.load(STORAGE_KEYS.CONFIG, INITIAL_GROWTH_CONFIG);
    this.packages = this.load(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    this.reports = this.load(STORAGE_KEYS.REPORTS, INITIAL_ABUSE_REPORTS);
    this.logs = this.load(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
    this.settings = this.load(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
    this.activeMemberId = localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER_ID) || this.members[0].id;
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }

  // Active Member Session Simulation
  getActiveMemberId(): string {
    return this.activeMemberId;
  }

  setActiveMemberId(memberId: string): void {
    this.activeMemberId = memberId;
    localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER_ID, memberId);
  }

  getActiveMember(): Member {
    const found = this.members.find(m => m.id === this.activeMemberId);
    return found || this.members[0];
  }

  // Member Operations
  getMembers(): Member[] {
    return [...this.members];
  }

  getMemberById(id: string): Member | undefined {
    return this.members.find(m => m.id === id);
  }

  registerMember(payload: {
    displayName: string;
    countryCode: string;
    phoneCallingCode: string;
    rawPhone: string;
    normalizedE164: string;
    preferredLanguage: Locale;
    referralCode?: string;
    consentedToExport: boolean;
    acknowledgedNoRemoteWipe: boolean;
  }): { success: boolean; member: Member; error?: string } {
    const existing = this.members.find(m => m.normalizedE164 === payload.normalizedE164);
    if (existing) {
      return {
        success: false,
        member: existing,
        error: 'This WhatsApp number is already registered in the demonstration directory.',
      };
    }

    const newId = `mem_user_${Date.now()}`;
    const generatedRefCode = `CG-${payload.displayName.replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;

    const newMember: Member = {
      id: newId,
      displayName: payload.displayName,
      countryCode: payload.countryCode,
      phoneCallingCode: payload.phoneCallingCode,
      rawPhone: payload.rawPhone,
      normalizedE164: payload.normalizedE164,
      preferredLanguage: payload.preferredLanguage,
      referralCode: generatedRefCode,
      referredByCode: payload.referralCode || undefined,
      eligibility: 'eligible',
      registeredAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      downloadCount: 0,
      totalReferrals: 0,
      isSampleRecord: true,
      previouslyAllocatedContactIds: [],
      consent: {
        id: `cst_${Date.now()}`,
        memberId: newId,
        timestamp: new Date().toISOString(),
        consentedToExport: payload.consentedToExport,
        acknowledgedNoRemoteWipe: payload.acknowledgedNoRemoteWipe,
        termsVersion: 'v2.0-growth',
        ipHashSample: 'client-opt-in',
      },
    };

    this.members.unshift(newMember);
    this.save(STORAGE_KEYS.MEMBERS, this.members);
    this.setActiveMemberId(newId);

    // Update eligible count
    this.growthConfig.currentEligibleCount += 1;
    this.save(STORAGE_KEYS.CONFIG, this.growthConfig);

    this.logAuditEvent({
      actor: newMember.displayName,
      actorRole: 'member',
      action: 'MEMBER_REGISTERED',
      details: `New voluntary member registration (${payload.normalizedE164}). Double consent confirmed.`,
    });

    return { success: true, member: newMember };
  }

  updateProfile(memberId: string, updates: Partial<Pick<Member, 'displayName' | 'countryCode' | 'preferredLanguage'>>): boolean {
    const idx = this.members.findIndex(m => m.id === memberId);
    if (idx === -1) return false;

    this.members[idx] = {
      ...this.members[idx],
      ...updates,
      lastActiveAt: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.MEMBERS, this.members);

    this.logAuditEvent({
      actor: this.members[idx].displayName,
      actorRole: 'member',
      action: 'PROFILE_UPDATED',
      details: `Member updated profile attributes: ${Object.keys(updates).join(', ')}`,
    });

    return true;
  }

  requestContactRemoval(memberId: string, reason: string): boolean {
    const idx = this.members.findIndex(m => m.id === memberId);
    if (idx === -1) return false;

    this.members[idx].consent.consentedToExport = false;
    this.members[idx].consent.revokedAt = new Date().toISOString();
    this.members[idx].consent.revocationReason = reason;
    this.members[idx].eligibility = 'withdrawn';
    this.save(STORAGE_KEYS.MEMBERS, this.members);

    if (this.growthConfig.currentEligibleCount > 0) {
      this.growthConfig.currentEligibleCount -= 1;
      this.save(STORAGE_KEYS.CONFIG, this.growthConfig);
    }

    this.logAuditEvent({
      actor: this.members[idx].displayName,
      actorRole: 'member',
      action: 'CONSENT_WITHDRAWN',
      details: `Voluntary removal requested. Reason: "${reason}". Excluded from future exports.`,
    });

    return true;
  }

  toggleMemberEligibility(memberId: string, newEligibility: Member['eligibility']): boolean {
    const idx = this.members.findIndex(m => m.id === memberId);
    if (idx === -1) return false;

    const old = this.members[idx].eligibility;
    this.members[idx].eligibility = newEligibility;
    this.save(STORAGE_KEYS.MEMBERS, this.members);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'ELIGIBILITY_CHANGED',
      details: `Admin changed member ${this.members[idx].displayName} eligibility from ${old} to ${newEligibility}.`,
    });

    return true;
  }

  // Releases
  getReleases(): ContactRelease[] {
    return [...this.releases];
  }

  createRelease(payload: {
    releaseTitle: string;
    incrementalNewContacts: number;
    descriptionEn: string;
    descriptionFr: string;
  }): ContactRelease {
    const nextNumber = this.releases.length + 1;
    const newRelease: ContactRelease = {
      id: `rel_0${nextNumber}_${Date.now()}`,
      releaseNumber: nextNumber,
      releaseTitle: payload.releaseTitle,
      publishedAt: new Date().toISOString(),
      totalEligibleContacts: this.growthConfig.currentEligibleCount,
      incrementalNewContacts: payload.incrementalNewContacts,
      fileSizeBytes: Math.round(payload.incrementalNewContacts * 1250),
      hashChecksum: `sha256-cg${Math.random().toString(36).substring(2, 9)}`,
      status: 'published',
      descriptionEn: payload.descriptionEn,
      descriptionFr: payload.descriptionFr,
    };

    this.releases.unshift(newRelease);
    this.save(STORAGE_KEYS.RELEASES, this.releases);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'RELEASE_CREATED',
      details: `Published Contact Release #${nextNumber}: ${payload.releaseTitle} (${payload.incrementalNewContacts} incremental contacts).`,
    });

    return newRelease;
  }

  // Download Execution with Growth-Stage Rules (no arbitrary weekly cap, self-exclusion)
  simulateDownload(
    releaseId: string,
    type: 'full' | 'incremental',
    forceError: boolean = false
  ): { success: boolean; error?: string; record?: DownloadRecord } {
    if (forceError) {
      return {
        success: false,
        error: 'Simulated Network Error: Failed to generate contact archive stream. Please retry.',
      };
    }

    const release = this.releases.find(r => r.id === releaseId) || this.releases[0];
    const member = this.getActiveMember();

    if (member.eligibility !== 'eligible') {
      return {
        success: false,
        error: `Account is currently "${member.eligibility}". Only verified eligible participants can export releases.`,
      };
    }

    // Generate safe sample contacts, filtering out self
    const samplePool = [
      { name: 'Elena Rostova', phone: '+44 7700 900234', country: 'United Kingdom', org: 'Elena Digital' },
      { name: 'Tariq Mansour', phone: '+971 50 000 8921', country: 'UAE', org: 'Mansour Ventures' },
      { name: 'Chidinma Okafor', phone: '+234 800 000 7712', country: 'Nigeria', org: 'Okafor Logistics' },
      { name: 'Jean-Paul Koffi', phone: '+225 07 00 99 88', country: "Côte d'Ivoire", org: 'Koffi & Partners' },
      { name: 'Sylvie Marchand', phone: '+33 6 00 22 33 44', country: 'France', org: 'Marchand Mode' },
      { name: 'Kweku Addo', phone: '+233 24 000 5566', country: 'Ghana', org: 'GoldCoast Media' },
      { name: 'Amina Kimani', phone: '+254 700 00 4433', country: 'Kenya', org: 'Kimani Solar' },
      { name: 'Rajesh Sharma', phone: '+91 98000 12345', country: 'India', org: 'Sharma Software' },
      { name: 'Camila Santos', phone: '+55 11 90000 7788', country: 'Brazil', org: 'Santos Consultoria' },
      { name: 'Maximilian Weber', phone: '+49 150 000 1122', country: 'Germany', org: 'Weber Export' },
    ].filter(p => p.phone !== member.normalizedE164); // NEVER include own contact

    const countToExport = type === 'incremental' ? Math.min(15, release.incrementalNewContacts) : Math.min(48, release.totalEligibleContacts);
    const sampleContacts: SampleVCardContact[] = [];

    for (let i = 0; i < countToExport; i++) {
      const template = samplePool[i % samplePool.length];
      const suffix = Math.floor(i / samplePool.length) > 0 ? ` #${Math.floor(i / samplePool.length) + 1}` : '';
      sampleContacts.push({
        fullName: `${template.name}${suffix}`,
        phone: template.phone,
        country: template.country,
        organization: template.org,
        note: `Contact Gaining Sample Member (${release.releaseTitle})`,
      });
    }

    const vcfBlob = generateVcfString(sampleContacts, release.releaseTitle);
    const fileName = `ContactGaining_Release_${release.releaseNumber}_${type}_Sample.vcf`;
    triggerVcfDownload(vcfBlob, fileName);

    // Update member download count & previously allocated records
    const memberIdx = this.members.findIndex(m => m.id === member.id);
    if (memberIdx !== -1) {
      this.members[memberIdx].downloadCount += 1;
      const prev = this.members[memberIdx].previouslyAllocatedContactIds || [];
      if (!prev.includes(release.id)) {
        this.members[memberIdx].previouslyAllocatedContactIds = [...prev, release.id];
      }
      this.save(STORAGE_KEYS.MEMBERS, this.members);
    }

    const record: DownloadRecord = {
      id: `dl_${Date.now()}`,
      memberId: member.id,
      releaseId: release.id,
      releaseNumber: release.releaseNumber,
      downloadType: type,
      downloadedAt: new Date().toISOString(),
      contactCount: countToExport,
      status: 'completed',
    };

    this.logAuditEvent({
      actor: member.displayName,
      actorRole: 'member',
      action: type === 'incremental' ? 'VCF_DOWNLOAD_INCREMENTAL' : 'VCF_DOWNLOAD_FULL',
      details: `Generated and downloaded sample VCF: ${fileName} (${countToExport} demo contacts).`,
    });

    return { success: true, record };
  }

  // Growth Config
  getGrowthConfig(): GrowthPhaseConfig {
    return { ...this.growthConfig };
  }

  // Alias for backward compatibility
  getAllowanceConfig(): GrowthPhaseConfig {
    return this.getGrowthConfig();
  }

  updateGrowthConfig(updates: Partial<GrowthPhaseConfig>): boolean {
    this.growthConfig = { ...this.growthConfig, ...updates };
    this.save(STORAGE_KEYS.CONFIG, this.growthConfig);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'GROWTH_CONFIG_UPDATED',
      details: `Growth parameters updated. Threshold: ${this.growthConfig.futureMonetizationEvaluationThreshold}, ReleaseDay: ${this.growthConfig.incrementalReleaseDay}`,
    });

    return true;
  }

  updateAllowanceConfig(updates: Partial<GrowthPhaseConfig>): boolean {
    return this.updateGrowthConfig(updates);
  }

  // Packages
  getPackages(): PackagePlan[] {
    return [...this.packages];
  }

  updatePackage(id: string, updates: Partial<PackagePlan>): boolean {
    const idx = this.packages.findIndex(p => p.id === id);
    if (idx === -1) return false;

    this.packages[idx] = { ...this.packages[idx], ...updates };
    this.save(STORAGE_KEYS.PACKAGES, this.packages);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'PACKAGE_UPDATED',
      details: `Package plan "${this.packages[idx].name}" updated. Allowance: ${this.packages[idx].contactAllowance}, Price: $${this.packages[idx].priceUSD}`,
    });

    return true;
  }

  // Abuse Reports
  getAbuseReports(): AbuseReport[] {
    return [...this.reports];
  }

  submitAbuseReport(payload: {
    category: AbuseReportCategory;
    reportedPhoneOrName: string;
    description: string;
    evidenceNotes?: string;
  }): AbuseReport {
    const newReport: AbuseReport = {
      id: `rep_${Date.now()}`,
      reporterMemberId: this.activeMemberId,
      reportedPhoneOrName: payload.reportedPhoneOrName,
      category: payload.category,
      description: payload.description,
      evidenceNotes: payload.evidenceNotes,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    this.reports.unshift(newReport);
    this.save(STORAGE_KEYS.REPORTS, this.reports);

    this.logAuditEvent({
      actor: this.getActiveMember().displayName,
      actorRole: 'member',
      action: 'ABUSE_REPORTED',
      details: `Abuse incident reported for ${payload.reportedPhoneOrName}. Category: ${payload.category}`,
    });

    return newReport;
  }

  updateReportStatus(reportId: string, status: AbuseReport['status'], resolutionNotes?: string): boolean {
    const idx = this.reports.findIndex(r => r.id === reportId);
    if (idx === -1) return false;

    this.reports[idx].status = status;
    if (resolutionNotes) {
      this.reports[idx].resolutionNotes = resolutionNotes;
    }
    this.save(STORAGE_KEYS.REPORTS, this.reports);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'REPORT_STATUS_CHANGED',
      details: `Abuse report ${reportId} marked as ${status}.`,
    });

    return true;
  }

  // Audit Logs
  getAuditLogs(): AuditLogEvent[] {
    return [...this.logs];
  }

  logAuditEvent(event: Omit<AuditLogEvent, 'id' | 'timestamp' | 'ipAddressSample'>): void {
    const newLog: AuditLogEvent = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: event.actor,
      actorRole: event.actorRole,
      action: event.action,
      details: event.details,
      ipAddressSample: '198.51.100.' + Math.floor(10 + Math.random() * 80),
      metadata: event.metadata,
    };
    this.logs.unshift(newLog);
    this.save(STORAGE_KEYS.LOGS, this.logs);
  }

  // System Settings
  getSystemSettings(): SystemSettings {
    return { ...this.settings };
  }

  updateSystemSettings(updates: Partial<SystemSettings>): boolean {
    this.settings = { ...this.settings, ...updates };
    this.save(STORAGE_KEYS.SETTINGS, this.settings);

    this.logAuditEvent({
      actor: 'admin@contactgaining.internal',
      actorRole: 'admin',
      action: 'SYSTEM_SETTINGS_UPDATED',
      details: `System operational settings modified: ${Object.keys(updates).join(', ')}`,
    });

    return true;
  }

  // Reset to initial mock dataset
  resetToInitial(): void {
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.RELEASES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_MEMBER_ID);

    this.members = [...INITIAL_MEMBERS];
    this.releases = [...INITIAL_RELEASES];
    this.growthConfig = { ...INITIAL_GROWTH_CONFIG };
    this.packages = [...INITIAL_PACKAGES];
    this.reports = [...INITIAL_ABUSE_REPORTS];
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.settings = { ...INITIAL_SYSTEM_SETTINGS };
    this.activeMemberId = INITIAL_MEMBERS[0].id;
  }
}

export const mockDataService = new MockDataService();
