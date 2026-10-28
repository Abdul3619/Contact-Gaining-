/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizePhoneNumber } from './phoneUtils';
import { Member, ConsentRecord, ContactRelease, DownloadRecord, Locale } from '../types';

export interface AuthResponse<T> {
  data: T | null;
  error: string | null;
}

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
  countryCode: string;
  phoneCallingCode: string;
  rawPhone: string;
  preferredLanguage: Locale;
  referralCode?: string;
  termsVersion: string;
}

export class SupabaseService {
  /**
   * Registers a new member with Supabase Auth, creates the profile in `members`,
   * and records explicit initial consent in `consent_records`.
   */
  async signUp(params: SignUpParams): Promise<AuthResponse<{ user: unknown; member: Member }>> {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase backend is not configured with VITE_SUPABASE_ANON_KEY.',
      };
    }

    // 1. Normalize and strictly validate phone number in E.164
    const phoneVal = normalizePhoneNumber(
      params.rawPhone,
      params.phoneCallingCode,
      params.countryCode
    );

    if (!phoneVal.isValid) {
      return {
        data: null,
        error: phoneVal.errorMessage || 'Invalid international phone number.',
      };
    }

    const normalizedE164 = phoneVal.e164;

    try {
      // 2. Check for duplicate phone number
      const { data: existingPhone, error: phoneCheckError } = await supabase
        .from('members')
        .select('id')
        .eq('normalized_e164', normalizedE164)
        .maybeSingle();

      if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
        console.warn('Phone uniqueness pre-check warning:', phoneCheckError);
      }

      if (existingPhone) {
        return {
          data: null,
          error: 'This WhatsApp phone number is already registered. Please sign in or recover your account.',
        };
      }

      // 3. Register user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            display_name: params.displayName.trim(),
            normalized_e164: normalizedE164,
          },
        },
      });

      if (authError) {
        return { data: null, error: authError.message };
      }

      const user = authData.user;
      if (!user) {
        return { data: null, error: 'Registration failed: no user returned.' };
      }

      const generatedReferralCode = 'CG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const now = new Date().toISOString();

      // 4. Insert profile in `members` table
      const { data: memberRow, error: memberError } = await supabase
        .from('members')
        .insert({
          user_id: user.id,
          display_name: params.displayName.trim(),
          country_code: params.countryCode,
          phone_calling_code: params.phoneCallingCode,
          raw_phone: params.rawPhone.trim(),
          normalized_e164: normalizedE164,
          preferred_language: params.preferredLanguage,
          referral_code: generatedReferralCode,
          referred_by_code: params.referralCode?.trim() || null,
          eligibility: 'eligible',
          registered_at: now,
          last_active_at: now,
          is_sample_record: false,
        })
        .select()
        .single();

      if (memberError) {
        return { data: null, error: `Failed to create member profile: ${memberError.message}` };
      }

      // 5. Insert explicit initial consent record in `consent_records`
      const { data: consentRow, error: consentError } = await supabase
        .from('consent_records')
        .insert({
          member_id: memberRow.id,
          purpose: 'whatsapp_contact_exchange',
          granted: true,
          terms_version: params.termsVersion,
          acknowledged_no_remote_wipe: true,
          timestamp: now,
        })
        .select()
        .single();

      if (consentError) {
        console.error('Failed to create consent record:', consentError);
      }

      // 6. Log audit event
      await this.logAuditEvent({
        actor: user.email || user.id,
        actorRole: 'member',
        action: 'MEMBER_REGISTERED',
        details: `Member registered with phone ${normalizedE164}. Explicit consent recorded.`,
      });

      const memberModel = this.mapMemberRow(memberRow, consentRow || undefined);
      return {
        data: {
          user,
          member: memberModel,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { data: null, error: msg };
    }
  }

  /**
   * Signs in an existing member with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse<{ user: unknown; member: Member | null }>> {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase backend is not configured.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data.user) {
        return { data: null, error: 'Sign in failed: no user returned.' };
      }

      // Fetch member profile
      const member = await this.getMemberByUserId(data.user.id);

      // Update last active timestamp
      if (member) {
        await supabase
          .from('members')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', member.id);
      }

      return {
        data: {
          user: data.user,
          member,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { data: null, error: msg };
    }
  }

  /**
   * Signs out the current user and clears active session
   */
  async signOut(): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) return { error: null };
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: msg };
    }
  }

  /**
   * Sends password recovery email
   */
  async requestPasswordReset(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase backend is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
      return { error: error ? error.message : null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: msg };
    }
  }

  /**
   * Fetches member record by Supabase user id with latest consent record
   */
  async getMemberByUserId(userId: string): Promise<Member | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data: memberRow, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !memberRow) return null;

      // Fetch latest consent record
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('*')
        .eq('member_id', memberRow.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      const latestConsent = consentRows && consentRows.length > 0 ? consentRows[0] : undefined;
      return this.mapMemberRow(memberRow, latestConsent);
    } catch (err) {
      console.error('Error fetching member profile:', err);
      return null;
    }
  }

  /**
   * Explicit Consent Management:
   * Records a new consent decision without overwriting historical records.
   * Updates member eligibility accordingly.
   */
  async recordConsentChange(
    memberId: string,
    granted: boolean,
    revocationReason?: string,
    termsVersion: string = '2026.1'
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const now = new Date().toISOString();

      // 1. Insert new consent audit record
      const { error: consentErr } = await supabase
        .from('consent_records')
        .insert({
          member_id: memberId,
          purpose: 'whatsapp_contact_exchange',
          granted,
          terms_version: termsVersion,
          acknowledged_no_remote_wipe: true,
          timestamp: now,
          revoked_at: granted ? null : now,
          revocation_reason: granted ? null : (revocationReason || 'Member requested withdrawal in settings'),
        });

      if (consentErr) {
        return { success: false, error: consentErr.message };
      }

      // 2. Update eligibility in members table
      const newEligibility = granted ? 'eligible' : 'withdrawn';
      const { error: memberErr } = await supabase
        .from('members')
        .update({
          eligibility: newEligibility,
          last_active_at: now,
        })
        .eq('id', memberId);

      if (memberErr) {
        return { success: false, error: memberErr.message };
      }

      // 3. Log audit event
      await this.logAuditEvent({
        actor: memberId,
        actorRole: 'member',
        action: granted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN',
        details: granted
          ? `Member granted explicit sharing consent under terms ${termsVersion}.`
          : `Member withdrew contact sharing consent. Reason: ${revocationReason || 'Self-service'}.`,
      });

      return { success: true, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches versioned audit history of consent for a member
   */
  async getConsentHistory(memberId: string): Promise<ConsentRecord[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('member_id', memberId)
        .order('timestamp', { ascending: false });

      if (error || !data) return [];

      return data.map((r) => ({
        id: r.id,
        memberId: r.member_id,
        timestamp: r.timestamp,
        consentedToExport: r.granted,
        acknowledgedNoRemoteWipe: r.acknowledged_no_remote_wipe,
        termsVersion: r.terms_version,
        ipHashSample: r.ip_hash_sample || '',
        revokedAt: r.revoked_at || undefined,
        revocationReason: r.revocation_reason || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Real Allocation Engine:
   * Allocates new genuine, consenting contacts to recipient member.
   * Rules enforced:
   * - Recipient must be eligible and currently consenting.
   * - Never allocates recipient their own contact.
   * - Never duplicates existing allocations.
   * - Allocated contacts must have active consent at allocation time.
   */
  async allocateContactsForMember(
    recipientMemberId: string,
    requestedCount: number = 20,
    releaseId: string | null = null
  ): Promise<{ allocatedCount: number; contacts: Member[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { allocatedCount: 0, contacts: [], error: 'Supabase backend is not configured.' };
    }

    try {
      // 1. Verify recipient's own eligibility and consent
      const { data: recipient, error: recError } = await supabase
        .from('members')
        .select('id, eligibility, normalized_e164')
        .eq('id', recipientMemberId)
        .single();

      if (recError || !recipient) {
        return { allocatedCount: 0, contacts: [], error: 'Recipient member record not found.' };
      }

      if (recipient.eligibility !== 'eligible') {
        return {
          allocatedCount: 0,
          contacts: [],
          error: 'Your account is currently not eligible for contact allocation (status: ' + recipient.eligibility + '). Please check your consent settings.',
        };
      }

      // 2. Fetch existing allocated contact IDs for this recipient
      const { data: existingAllocations, error: allocError } = await supabase
        .from('contact_allocations')
        .select('allocated_member_id')
        .eq('recipient_member_id', recipientMemberId);

      if (allocError) {
        return { allocatedCount: 0, contacts: [], error: `Failed to query existing allocations: ${allocError.message}` };
      }

      const existingIds = new Set((existingAllocations || []).map((a) => a.allocated_member_id));
      existingIds.add(recipientMemberId); // Never allocate self

      // 3. Query candidate members who are eligible and consenting
      const { data: candidates, error: candError } = await supabase
        .from('members')
        .select('id, display_name, country_code, phone_calling_code, raw_phone, normalized_e164, preferred_language, referral_code, eligibility, registered_at, last_active_at')
        .eq('eligibility', 'eligible')
        .neq('id', recipientMemberId)
        .order('registered_at', { ascending: false })
        .limit(100);

      if (candError) {
        return { allocatedCount: 0, contacts: [], error: `Failed to query candidate contacts: ${candError.message}` };
      }

      // Filter out candidates already allocated
      const freshCandidates = (candidates || []).filter((c) => !existingIds.has(c.id));

      if (freshCandidates.length === 0) {
        return {
          allocatedCount: 0,
          contacts: [],
          error: null, // Honest empty state: no new contacts available
        };
      }

      // 4. Double-check that fresh candidates have active consent in consent_records
      const candidateIds = freshCandidates.slice(0, requestedCount).map((c) => c.id);
      const { data: consentChecks } = await supabase
        .from('consent_records')
        .select('member_id, granted, revoked_at')
        .in('member_id', candidateIds)
        .order('timestamp', { ascending: false });

      const activelyConsentingIds = new Set<string>();
      const processedMembers = new Set<string>();

      (consentChecks || []).forEach((rec) => {
        if (!processedMembers.has(rec.member_id)) {
          processedMembers.add(rec.member_id);
          if (rec.granted && !rec.revoked_at) {
            activelyConsentingIds.add(rec.member_id);
          }
        }
      });

      const confirmedCandidates = freshCandidates.filter((c) => activelyConsentingIds.has(c.id));

      if (confirmedCandidates.length === 0) {
        return { allocatedCount: 0, contacts: [], error: null };
      }

      // 5. Insert allocations atomically
      const now = new Date().toISOString();
      const insertRows = confirmedCandidates.map((c) => ({
        recipient_member_id: recipientMemberId,
        allocated_member_id: c.id,
        release_id: releaseId,
        allocated_at: now,
        status: 'active' as const,
      }));

      const { error: insertError } = await supabase
        .from('contact_allocations')
        .insert(insertRows);

      if (insertError) {
        return { allocatedCount: 0, contacts: [], error: `Allocation failed: ${insertError.message}` };
      }

      // 6. Return confirmed contacts
      const mappedContacts: Member[] = confirmedCandidates.map((c) => this.mapMemberRow(c));
      return {
        allocatedCount: mappedContacts.length,
        contacts: mappedContacts,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { allocatedCount: 0, contacts: [], error: msg };
    }
  }

  /**
   * Fetches all contacts currently allocated to recipient member,
   * excluding any contact whose consent has since been withdrawn!
   */
  async getAllocatedContactsForRecipient(
    recipientMemberId: string
  ): Promise<{ contacts: Member[]; revokedCount: number; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { contacts: [], revokedCount: 0, error: 'Supabase is not configured.' };
    }

    try {
      const { data: allocRows, error: allocErr } = await supabase
        .from('contact_allocations')
        .select('allocated_member_id, allocated_at')
        .eq('recipient_member_id', recipientMemberId);

      if (allocErr || !allocRows || allocRows.length === 0) {
        return { contacts: [], revokedCount: 0, error: null };
      }

      const allocatedIds = allocRows.map((a) => a.allocated_member_id);

      // Fetch member profiles
      const { data: memberRows, error: memErr } = await supabase
        .from('members')
        .select('*')
        .in('id', allocatedIds);

      if (memErr || !memberRows) {
        return { contacts: [], revokedCount: 0, error: memErr?.message || 'Failed to fetch contacts.' };
      }

      // Fetch consent statuses to exclude withdrawn contacts at download time
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('member_id, granted, revoked_at, timestamp')
        .in('member_id', allocatedIds)
        .order('timestamp', { ascending: false });

      const activeConsentMap = new Map<string, boolean>();
      const processed = new Set<string>();

      (consentRows || []).forEach((c) => {
        if (!processed.has(c.member_id)) {
          processed.add(c.member_id);
          activeConsentMap.set(c.member_id, c.granted && !c.revoked_at);
        }
      });

      const eligibleContacts: Member[] = [];
      let revokedCount = 0;

      memberRows.forEach((m) => {
        const isStillConsenting = activeConsentMap.get(m.id) ?? (m.eligibility === 'eligible');
        if (isStillConsenting && m.eligibility === 'eligible') {
          eligibleContacts.push(this.mapMemberRow(m));
        } else {
          revokedCount++;
        }
      });

      return {
        contacts: eligibleContacts,
        revokedCount,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { contacts: [], revokedCount: 0, error: msg };
    }
  }

  /**
   * Logs a download event in `download_logs`
   */
  async logDownload(
    memberId: string,
    releaseId: string | null,
    contactCount: number,
    downloadType: 'full' | 'incremental'
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) return { success: true, error: null };

    try {
      const { error } = await supabase.from('download_logs').insert({
        member_id: memberId,
        release_id: releaseId,
        download_type: downloadType,
        downloaded_at: new Date().toISOString(),
        contact_count: contactCount,
        status: 'completed',
      });

      return { success: !error, error: error ? error.message : null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Checks whether a user holds an administrative role in `admin_roles` table
   */
  async checkAdminRole(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return false;
      return ['admin', 'superadmin', 'moderator'].includes(data.role);
    } catch {
      return false;
    }
  }

  /**
   * Fetches published contact releases
   */
  async getReleases(): Promise<ContactRelease[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('contact_releases')
        .select('*')
        .order('release_number', { ascending: false });

      if (error || !data) return [];

      return data.map((r) => ({
        id: r.id,
        releaseNumber: r.release_number,
        releaseTitle: r.release_title,
        publishedAt: r.published_at,
        totalEligibleContacts: r.total_eligible_contacts,
        incrementalNewContacts: r.incremental_new_contacts,
        fileSizeBytes: r.file_size_bytes,
        hashChecksum: r.hash_checksum,
        status: r.status,
        descriptionEn: r.description_en,
        descriptionFr: r.description_fr,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Logs an audit event to `audit_events`
   */
  async logAuditEvent(event: {
    actor: string;
    actorRole: 'admin' | 'system' | 'member';
    action: string;
    details: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      await supabase.from('audit_events').insert({
        timestamp: new Date().toISOString(),
        actor: event.actor,
        actor_role: event.actorRole,
        action: event.action,
        details: event.details,
        metadata: (event.metadata as unknown as Record<string, unknown>) || null,
      });
    } catch (err) {
      console.warn('Failed to record audit event:', err);
    }
  }

  /**
   * Helper to map database member row to frontend Member interface
   */
  private mapMemberRow(
    row: {
      id: string;
      display_name: string;
      country_code: string;
      phone_calling_code: string;
      raw_phone: string;
      normalized_e164: string;
      preferred_language: 'en' | 'fr';
      referral_code: string;
      referred_by_code?: string | null;
      eligibility: 'eligible' | 'under_review' | 'suspended' | 'withdrawn';
      registered_at: string;
      last_active_at: string;
      is_sample_record?: boolean;
    },
    consentRow?: {
      id: string;
      member_id: string;
      timestamp: string;
      granted: boolean;
      acknowledged_no_remote_wipe: boolean;
      terms_version: string;
      ip_hash_sample?: string | null;
      revoked_at?: string | null;
      revocation_reason?: string | null;
    }
  ): Member {
    const defaultConsent: ConsentRecord = {
      id: consentRow?.id || 'consent_' + row.id,
      memberId: row.id,
      timestamp: consentRow?.timestamp || row.registered_at,
      consentedToExport: consentRow?.granted ?? (row.eligibility === 'eligible'),
      acknowledgedNoRemoteWipe: consentRow?.acknowledged_no_remote_wipe ?? true,
      termsVersion: consentRow?.terms_version || '2026.1',
      ipHashSample: consentRow?.ip_hash_sample || '',
      revokedAt: consentRow?.revoked_at || undefined,
      revocationReason: consentRow?.revocation_reason || undefined,
    };

    return {
      id: row.id,
      displayName: row.display_name,
      countryCode: row.country_code,
      phoneCallingCode: row.phone_calling_code,
      rawPhone: row.raw_phone,
      normalizedE164: row.normalized_e164,
      preferredLanguage: row.preferred_language,
      referralCode: row.referral_code,
      referredByCode: row.referred_by_code || undefined,
      consent: defaultConsent,
      eligibility: row.eligibility,
      registeredAt: row.registered_at,
      lastActiveAt: row.last_active_at,
      downloadCount: 0,
      totalReferrals: 0,
      isSampleRecord: Boolean(row.is_sample_record),
    };
  }
}

export const supabaseService = new SupabaseService();
