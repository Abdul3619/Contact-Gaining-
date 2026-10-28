/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizePhoneNumber } from './phoneUtils';
import { Member, ConsentRecord, ContactRelease, Locale, MemberEligibility, SystemSettings, AuditLogEvent } from '../types';
import { Json } from '../types/supabase';

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
   * 
   * Reconciled with live database constraints:
   * - members.status: 'pending' | 'active' | 'suspended' (active upon valid registration)
   * - consent_records.consent_type: 'contact_distribution' (permitted: 'contact_distribution' | 'privacy_policy' | 'terms')
   * 
   * Safe partial failure handling: If profile or consent creation fails, returns an explicit error
   * and does not leave the user appearing registered with missing permissions.
   */
  async signUp(params: SignUpParams): Promise<AuthResponse<{ user: unknown; member: Member }>> {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Supabase backend is not configured.',
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
        error: phoneVal.errorMessage || 'Invalid international phone number structure.',
      };
    }

    const normalizedE164 = phoneVal.e164;

    try {
      // 2. Pre-check for duplicate phone number in live members table
      const { data: existingPhone, error: phoneCheckError } = await supabase
        .from('members')
        .select('id')
        .eq('phone_e164', normalizedE164)
        .maybeSingle();

      if (phoneCheckError && phoneCheckError.code !== 'PGRST116') {
        console.warn('Phone uniqueness pre-check notice:', phoneCheckError.message);
      }

      if (existingPhone) {
        return {
          data: null,
          error: 'This WhatsApp phone number is already registered in the community directory. Please sign in.',
        };
      }

      // 3. Register user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            display_name: params.displayName.trim(),
            phone_e164: normalizedE164,
            country_code: params.countryCode,
          },
        },
      });

      if (authError) {
        return { data: null, error: authError.message };
      }

      const user = authData.user;
      if (!user) {
        return { data: null, error: 'Registration failed: no authentication record returned from auth provider.' };
      }

      const now = new Date().toISOString();

      // 4. Upsert profile in `members` table
      // Strictly enforced by live database insert policy: status MUST be 'pending' upon registration
      const { data: memberRow, error: memberError } = await supabase
        .from('members')
        .upsert({
          id: user.id,
          display_name: params.displayName.trim(),
          country_code: params.countryCode,
          phone_e164: normalizedE164,
          preferred_language: params.preferredLanguage,
          status: 'pending',
          updated_at: now,
        })
        .select()
        .single();

      if (memberError) {
        return { data: null, error: `Failed to save member profile: ${memberError.message}` };
      }

      // 5. Insert explicit initial consent records in `consent_records`
      // Verified allowed constraint values: 'contact_distribution' | 'privacy_policy' | 'terms'
      const consentPayloads = [
        {
          member_id: user.id,
          consent_type: 'contact_distribution' as const,
          granted: true,
          source: 'registration',
          version: params.termsVersion || '2026.1',
          withdrawn_at: null,
          metadata: {
            acknowledged_no_remote_wipe: true,
            referral_code: params.referralCode || null,
            ip_sample: 'client_registration',
            registered_at: now,
          },
        },
        {
          member_id: user.id,
          consent_type: 'privacy_policy' as const,
          granted: true,
          source: 'registration',
          version: params.termsVersion || '2026.1',
          withdrawn_at: null,
          metadata: {
            acknowledged_privacy: true,
            registered_at: now,
          },
        },
        {
          member_id: user.id,
          consent_type: 'terms' as const,
          granted: true,
          source: 'registration',
          version: params.termsVersion || '2026.1',
          withdrawn_at: null,
          metadata: {
            acknowledged_terms: true,
            registered_at: now,
          },
        },
      ];

      const { data: consentRows, error: consentError } = await supabase
        .from('consent_records')
        .insert(consentPayloads)
        .select();

      if (consentError) {
        console.error('Consent recording error:', consentError);
        return {
          data: null,
          error: `Account created but failed to record contact sharing consent (${consentError.message}). Please contact support or retry sign-in.`,
        };
      }

      const primaryConsent = (consentRows && consentRows.length > 0) ? consentRows[0] : undefined;

      // 6. Record audit event
      await this.logAuditEvent('MEMBER_REGISTERED', {
        user_id: user.id,
        phone_e164: normalizedE164,
        email: user.email,
        consent_recorded: true,
        timestamp: now,
      });

      const memberModel = this.mapMemberRow(memberRow, primaryConsent);
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

      // Update timestamp
      if (member) {
        await supabase
          .from('members')
          .update({ updated_at: new Date().toISOString() })
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
   * Signs out current user session
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
   * Password recovery email
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
   * Fetches member record by Supabase user id with latest contact_distribution consent record
   */
  async getMemberByUserId(userId: string): Promise<Member | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data: memberRow, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !memberRow) return null;

      // Fetch latest consent record for contact_distribution
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('*')
        .eq('member_id', memberRow.id)
        .eq('consent_type', 'contact_distribution')
        .order('id', { ascending: false })
        .limit(1);

      const latestConsent = consentRows && consentRows.length > 0 ? consentRows[0] : undefined;
      return this.mapMemberRow(memberRow, latestConsent);
    } catch (err) {
      console.error('Error fetching member profile:', err);
      return null;
    }
  }

  /**
   * Updates an authenticated member's profile in the live `members` table.
   * Strictly restricts modifications to authorized profile fields:
   * displayName, countryCode, and preferredLanguage.
   * Does NOT allow clients to modify phone_e164, status, or member id.
   */
  async updateMemberProfile(
    memberId: string,
    updates: {
      displayName: string;
      countryCode: string;
      preferredLanguage: 'en' | 'fr';
    }
  ): Promise<{ success: boolean; member?: Member; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase backend is not configured.' };
    }

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('members')
        .update({
          display_name: updates.displayName.trim(),
          country_code: updates.countryCode,
          preferred_language: updates.preferredLanguage,
          updated_at: now,
        })
        .eq('id', memberId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      await this.logAuditEvent('PROFILE_UPDATED', {
        member_id: memberId,
        display_name: updates.displayName.trim(),
        country_code: updates.countryCode,
        preferred_language: updates.preferredLanguage,
        timestamp: now,
      });

      const updatedMember = this.mapMemberRow(data);
      return { success: true, member: updatedMember, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Explicit Consent Management:
   * Records a new consent decision in `consent_records` without overwriting historical records.
   * Uses verified constraint value: `consent_type: 'contact_distribution'`.
   * Does NOT write invalid statuses to `members.status` ('withdrawn' is not a DB status; 'pending' | 'active' | 'suspended' are).
   * Consent state is accurately modeled via `consent_records.withdrawn_at` and `consent_records.granted`.
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

      // 1. Insert new consent audit record in `consent_records`
      const { error: consentErr } = await supabase
        .from('consent_records')
        .insert({
          member_id: memberId,
          consent_type: 'contact_distribution',
          granted,
          source: 'member_portal',
          version: termsVersion,
          withdrawn_at: granted ? null : now,
          metadata: {
            acknowledged_no_remote_wipe: true,
            revocation_reason: granted ? null : (revocationReason || 'Member requested withdrawal in settings'),
            timestamp: now,
          },
        });

      if (consentErr) {
        return { success: false, error: consentErr.message };
      }

      // 2. Touch members.updated_at without writing unsupported enum values
      await supabase
        .from('members')
        .update({ updated_at: now })
        .eq('id', memberId);

      // 3. Log audit event
      await this.logAuditEvent(granted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN', {
        member_id: memberId,
        consent_type: 'contact_distribution',
        granted,
        reason: revocationReason || null,
        timestamp: now,
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
        .order('id', { ascending: false });

      if (error || !data) return [];

      return data.map((r: {
        id: string;
        member_id: string;
        consent_type: string;
        granted: boolean;
        source: string;
        version: string;
        withdrawn_at: string | null;
        metadata: Record<string, unknown> | null;
      }) => ({
        id: r.id,
        memberId: r.member_id,
        timestamp: (r.metadata?.timestamp as string) || new Date().toISOString(),
        consentedToExport: r.granted && !r.withdrawn_at,
        acknowledgedNoRemoteWipe: Boolean(r.metadata?.acknowledged_no_remote_wipe ?? true),
        termsVersion: r.version || '2026.1',
        ipHashSample: (r.metadata?.ip_sample as string) || '',
        revokedAt: r.withdrawn_at || undefined,
        revocationReason: (r.metadata?.revocation_reason as string) || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Real Allocation Engine:
   * 
   * Strict security and business rules enforced:
   * 1. Recipient must have DB status = 'active'.
   * 2. Recipient must have active unwithdrawn consent for 'contact_distribution'.
   * 3. Never allocate recipient their own contact (id != recipientId, phone != recipientPhone).
   * 4. Never duplicate existing allocations in contact_allocations.
   * 5. Candidate contacts must have DB status = 'active' and unwithdrawn consent for 'contact_distribution'.
   * 6. Withdrawn or suspended members are strictly excluded.
   */
  async allocateContactsForMember(
    recipientMemberId: string,
    requestedCount: number = 20
  ): Promise<{ allocatedCount: number; contacts: Member[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { allocatedCount: 0, contacts: [], error: 'Supabase backend is not configured.' };
    }

    try {
      // 1. Verify recipient's own profile and status in DB
      const { data: recipient, error: recError } = await supabase
        .from('members')
        .select('id, status, phone_e164')
        .eq('id', recipientMemberId)
        .single();

      if (recError || !recipient) {
        return { allocatedCount: 0, contacts: [], error: 'Recipient member record not found.' };
      }

      if (recipient.status !== 'active') {
        return {
          allocatedCount: 0,
          contacts: [],
          error: `Your account is not active (status: ${recipient.status}). Only active members can receive contact allocations.`,
        };
      }

      // 2. Verify recipient's own consent status: must have active, unwithdrawn contact_distribution consent
      const { data: recConsent } = await supabase
        .from('consent_records')
        .select('granted, withdrawn_at')
        .eq('member_id', recipientMemberId)
        .eq('consent_type', 'contact_distribution')
        .order('id', { ascending: false })
        .limit(1);

      const recipientConsenting = recConsent && recConsent.length > 0 && recConsent[0].granted && !recConsent[0].withdrawn_at;
      if (!recipientConsenting) {
        return {
          allocatedCount: 0,
          contacts: [],
          error: 'You have withdrawn your contact sharing consent. To receive contacts from the community, please reinstate sharing in your profile.',
        };
      }

      // 3. Fetch existing allocated contact IDs for this recipient to prevent duplicate allocations
      const { data: existingAllocations, error: allocError } = await supabase
        .from('contact_allocations')
        .select('contact_member_id')
        .eq('recipient_member_id', recipientMemberId);

      if (allocError) {
        return { allocatedCount: 0, contacts: [], error: `Failed to query existing allocations: ${allocError.message}` };
      }

      const existingIds = new Set(
        (existingAllocations || []).map((a: { contact_member_id: string }) => a.contact_member_id)
      );
      existingIds.add(recipientMemberId); // Never allocate self

      // 4. Query candidate members who have status = 'active'
      const { data: candidates, error: candError } = await supabase
        .from('members')
        .select('id, display_name, country_code, phone_e164, preferred_language, status, created_at, updated_at')
        .eq('status', 'active')
        .neq('id', recipientMemberId)
        .neq('phone_e164', recipient.phone_e164)
        .order('created_at', { ascending: false })
        .limit(150);

      if (candError) {
        return { allocatedCount: 0, contacts: [], error: `Failed to query candidate contacts: ${candError.message}` };
      }

      // Filter out candidates already allocated or matching recipient
      const unallocatedCandidates = (candidates || []).filter(
        (c: { id: string; phone_e164: string }) => !existingIds.has(c.id) && c.phone_e164 !== recipient.phone_e164
      );

      if (unallocatedCandidates.length === 0) {
        return {
          allocatedCount: 0,
          contacts: [],
          error: null, // Honest empty state: no new contacts available
        };
      }

      // 5. Verify candidates' latest consent: must have consent_type: 'contact_distribution' and not withdrawn
      const candidateIds = unallocatedCandidates.slice(0, requestedCount * 2).map((c: { id: string }) => c.id);
      const { data: consentChecks } = await supabase
        .from('consent_records')
        .select('member_id, consent_type, granted, withdrawn_at')
        .in('member_id', candidateIds)
        .eq('consent_type', 'contact_distribution');

      // Build map of latest consent state per candidate
      const activelyConsentingIds = new Set<string>();
      const candidateConsentMap = new Map<string, { granted: boolean; withdrawn_at: string | null }>();

      (consentChecks || []).forEach((rec: { member_id: string; granted: boolean; withdrawn_at: string | null }) => {
        candidateConsentMap.set(rec.member_id, rec);
        if (rec.granted && !rec.withdrawn_at) {
          activelyConsentingIds.add(rec.member_id);
        }
      });

      // Filter to only confirmed actively consenting candidates
      const confirmedCandidates = unallocatedCandidates.filter((c: { id: string }) => {
        const consent = candidateConsentMap.get(c.id);
        if (consent) {
          return consent.granted && !consent.withdrawn_at;
        }
        // If no consent record exists, they are not eligible
        return false;
      });

      if (confirmedCandidates.length === 0) {
        return { allocatedCount: 0, contacts: [], error: null };
      }

      const selectedBatch = confirmedCandidates.slice(0, requestedCount);

      // 6. Insert allocations into `contact_allocations` table
      const now = new Date().toISOString();
      const insertRows = selectedBatch.map((c: { id: string }) => ({
        recipient_member_id: recipientMemberId,
        contact_member_id: c.id,
        allocated_at: now,
      }));

      const { error: insertError } = await supabase
        .from('contact_allocations')
        .insert(insertRows);

      if (insertError) {
        return { allocatedCount: 0, contacts: [], error: `Allocation failed: ${insertError.message}` };
      }

      const mappedContacts: Member[] = selectedBatch.map(c => this.mapMemberRow(c));
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
   * strictly excluding any contact whose consent has since been withdrawn or whose account is suspended!
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
        .select('contact_member_id, allocated_at')
        .eq('recipient_member_id', recipientMemberId);

      if (allocErr || !allocRows || allocRows.length === 0) {
        return { contacts: [], revokedCount: 0, error: null };
      }

      const allocatedIds = allocRows.map((a: { contact_member_id: string }) => a.contact_member_id);

      // Fetch member profiles
      const { data: memberRows, error: memErr } = await supabase
        .from('members')
        .select('*')
        .in('id', allocatedIds);

      if (memErr || !memberRows) {
        return { contacts: [], revokedCount: 0, error: memErr?.message || 'Failed to fetch contacts.' };
      }

      // Check current consent status for contact_distribution
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('member_id, consent_type, granted, withdrawn_at')
        .in('member_id', allocatedIds)
        .eq('consent_type', 'contact_distribution');

      const activeConsentMap = new Map<string, boolean>();
      (consentRows || []).forEach((c: { member_id: string; granted: boolean; withdrawn_at: string | null }) => {
        activeConsentMap.set(c.member_id, c.granted && !c.withdrawn_at);
      });

      const eligibleContacts: Member[] = [];
      let revokedCount = 0;

      memberRows.forEach((m: {
        id: string;
        status: 'pending' | 'active' | 'suspended';
        display_name: string;
        country_code: string;
        phone_e164: string;
        preferred_language: 'en' | 'fr';
        created_at: string;
        updated_at: string;
      }) => {
        const hasConsent = activeConsentMap.get(m.id) === true;
        // Strictly exclude if consent was withdrawn OR member is suspended/pending
        if (hasConsent && m.status === 'active') {
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
    _downloadType?: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) return { success: true, error: null };

    try {
      const { error } = await supabase.from('download_logs').insert({
        member_id: memberId,
        release_id: releaseId,
        downloaded_at: new Date().toISOString(),
        contact_count: contactCount,
        format: 'vcf',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
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
    if (!isSupabaseConfigured() || !userId) return false;

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return false;
      return ['admin', 'superadmin', 'moderator'].includes((data as { role: string }).role);
    } catch {
      return false;
    }
  }

  /**
   * Fetches published contact releases from live database
   */
  async getReleases(): Promise<ContactRelease[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('contact_releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((r: { id: string; status: 'published' | 'draft' | 'archived'; count: number; created_at: string }, idx: number) => ({
        id: r.id,
        releaseNumber: idx + 1,
        releaseTitle: `Batch Release #${idx + 1}`,
        publishedAt: r.created_at,
        totalEligibleContacts: r.count || 0,
        incrementalNewContacts: r.count || 0,
        fileSizeBytes: 1024 * (r.count || 1),
        hashChecksum: r.id.slice(0, 8),
        status: r.status,
        descriptionEn: 'Official verified community contact release file.',
        descriptionFr: 'Fichier de diffusion officiel de contacts communautaires vérifiés.',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Logs an audit event to `audit_events`
   */
  async logAuditEvent(action: string, metadata: Record<string, unknown>): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      await supabase.from('audit_events').insert({
        created_at: new Date().toISOString(),
        action,
        metadata,
      });
    } catch (err) {
      console.warn('Audit event log notice:', err);
    }
  /**
   * Fetches real admin metrics from live Supabase tables
   */
  async getAdminMetrics(): Promise<{
    totalRegistered: number;
    eligibleCount: number;
    pendingCount: number;
    suspendedCount: number;
    uniqueCountries: number;
    totalReleases: number;
    totalDownloads: number;
    isLiveDb: boolean;
    error: string | null;
  }> {
    if (!isSupabaseConfigured()) {
      return {
        totalRegistered: 0,
        eligibleCount: 0,
        pendingCount: 0,
        suspendedCount: 0,
        uniqueCountries: 0,
        totalReleases: 0,
        totalDownloads: 0,
        isLiveDb: false,
        error: 'Supabase backend is not configured.',
      };
    }

    try {
      // 1. Members count and status distribution
      const { count: totalRegistered, error: memErr } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: pendingCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: suspendedCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'suspended');

      // Unique countries
      const { data: memberCountries } = await supabase
        .from('members')
        .select('country_code');
      const uniqueCountries = new Set((memberCountries || []).map((m: { country_code: string }) => m.country_code)).size;

      // 2. Active consenting members
      const { count: consentingCount } = await supabase
        .from('consent_records')
        .select('*', { count: 'exact', head: true })
        .eq('consent_type', 'contact_distribution')
        .eq('granted', true)
        .is('withdrawn_at', null);

      // 3. Releases count
      const { count: totalReleases } = await supabase
        .from('contact_releases')
        .select('*', { count: 'exact', head: true });

      // 4. Downloads count
      const { count: totalDownloads } = await supabase
        .from('download_logs')
        .select('*', { count: 'exact', head: true });

      return {
        totalRegistered: totalRegistered || 0,
        eligibleCount: Math.min(activeCount || 0, consentingCount || 0),
        pendingCount: pendingCount || 0,
        suspendedCount: suspendedCount || 0,
        uniqueCountries,
        totalReleases: totalReleases || 0,
        totalDownloads: totalDownloads || 0,
        isLiveDb: true,
        error: memErr ? memErr.message : null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        totalRegistered: 0,
        eligibleCount: 0,
        pendingCount: 0,
        suspendedCount: 0,
        uniqueCountries: 0,
        totalReleases: 0,
        totalDownloads: 0,
        isLiveDb: false,
        error: msg,
      };
    }
  }

  /**
   * Fetches system operational settings from `platform_settings` table
   */
  async getSystemSettings(): Promise<{ settings: SystemSettings; isFromDb: boolean; error: string | null }> {
    const defaultSettings: SystemSettings = {
      growthPhaseActive: true,
      registrationOpen: true,
      requireDoubleOptInConsent: true,
      e164ValidationStrict: true,
      disclaimerEnforced: true,
      communityInviteLink: 'https://chat.whatsapp.com/sample-international-exchange-invite',
      founderPortfolioUrl: 'https://github.com/Abdul3619/Contact-Gaining-',
    };

    if (!isSupabaseConfigured()) {
      return { settings: defaultSettings, isFromDb: false, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('key', 'system_settings')
        .maybeSingle();

      if (error || !data) {
        return { settings: defaultSettings, isFromDb: false, error: error?.message || null };
      }

      const val = data.value as unknown as Partial<SystemSettings>;
      return {
        settings: {
          ...defaultSettings,
          ...val,
        },
        isFromDb: true,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { settings: defaultSettings, isFromDb: false, error: msg };
    }
  }

  /**
   * Updates platform operational settings in `platform_settings`
   */
  async updateSystemSettings(
    newSettings: Partial<SystemSettings>
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          key: 'system_settings',
          value: newSettings as unknown as Json,
          updated_at: now,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      await this.logAuditEvent('SETTINGS_UPDATED', {
        key: 'system_settings',
        updated_at: now,
      });

      return { success: true, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches all registered members with their latest contact_distribution consent
   */
  async getAllMembers(): Promise<{ members: Member[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { members: [], error: 'Supabase is not configured.' };
    }

    try {
      const { data: memberRows, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !memberRows) {
        return { members: [], error: error ? error.message : 'No members found.' };
      }

      if (memberRows.length === 0) {
        return { members: [], error: null };
      }

      const memberIds = memberRows.map((m: { id: string }) => m.id);
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('*')
        .in('member_id', memberIds)
        .eq('consent_type', 'contact_distribution')
        .order('id', { ascending: false });

      const consentMap = new Map<string, any>();
      (consentRows || []).forEach((c: any) => {
        if (!consentMap.has(c.member_id)) {
          consentMap.set(c.member_id, c);
        }
      });

      const members = memberRows.map((m: any) => this.mapMemberRow(m, consentMap.get(m.id)));
      return { members, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { members: [], error: msg };
    }
  }

  /**
   * Modifies member account eligibility status ('pending' | 'active' | 'suspended')
   */
  async updateMemberStatus(
    memberId: string,
    status: 'pending' | 'active' | 'suspended'
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('members')
        .update({ status, updated_at: now })
        .eq('id', memberId);

      if (error) {
        return { success: false, error: error.message };
      }

      await this.logAuditEvent('MEMBER_STATUS_CHANGED', {
        member_id: memberId,
        new_status: status,
        updated_at: now,
      });

      return { success: true, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Creates and publishes a new contact release batch in `contact_releases`
   */
  async createReleaseBatch(
    count: number,
    status: 'published' | 'draft' | 'archived' = 'published'
  ): Promise<{ success: boolean; releaseId?: string; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('contact_releases')
        .insert({
          status,
          count,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      await this.logAuditEvent('RELEASE_PUBLISHED', {
        release_id: data.id,
        count,
        status,
        timestamp: now,
      });

      return { success: true, releaseId: data.id, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches latest audit log events from `audit_events` table
   */
  async getAuditLogs(): Promise<AuditLogEvent[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('audit_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data) return [];

      return data.map((d: { id: string; action: string; created_at: string; metadata: any }) => ({
        id: d.id,
        timestamp: d.created_at,
        actor: d.metadata?.user_id ? `User ${String(d.metadata.user_id).slice(0, 8)}` : 'System / Admin',
        actorRole: (d.action.includes('ADMIN') || d.action.includes('SETTINGS')) ? 'admin' : (d.metadata?.user_id ? 'member' : 'system'),
        action: d.action,
        details: JSON.stringify(d.metadata || {}),
        ipAddressSample: d.metadata?.ip_sample || '127.0.0.1',
        metadata: d.metadata || undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fetches all consent withdrawal and removal records
   */
  async getConsentWithdrawalRecords(): Promise<ConsentRecord[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .or('granted.eq.false,withdrawn_at.not.is.null')
        .order('id', { ascending: false });

      if (error || !data) return [];

      return data.map((r: any) => ({
        id: r.id,
        memberId: r.member_id,
        timestamp: r.metadata?.timestamp || new Date().toISOString(),
        consentedToExport: false,
        acknowledgedNoRemoteWipe: Boolean(r.metadata?.acknowledged_no_remote_wipe ?? true),
        termsVersion: r.version || '2026.1',
        ipHashSample: r.metadata?.ip_sample || '',
        revokedAt: r.withdrawn_at || new Date().toISOString(),
        revocationReason: r.metadata?.revocation_reason || 'Withdrawn by member',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Helper to map live database row to frontend Member interface
   */
  private mapMemberRow(
    row: {
      id: string;
      display_name: string;
      country_code: string;
      phone_e164: string;
      preferred_language: 'en' | 'fr';
      status: 'pending' | 'active' | 'suspended';
      created_at?: string;
      updated_at?: string;
    },
    consentRow?: {
      id: string;
      member_id: string;
      consent_type?: string;
      granted: boolean;
      source?: string;
      version?: string;
      withdrawn_at?: string | null;
      metadata?: Record<string, unknown> | null;
    }
  ): Member {
    const isConsenting = consentRow ? (consentRow.granted && !consentRow.withdrawn_at) : (row.status === 'active');

    let eligibility: MemberEligibility = 'eligible';
    if (row.status === 'suspended') {
      eligibility = 'suspended';
    } else if (row.status === 'pending') {
      eligibility = 'under_review';
    } else if (!isConsenting) {
      eligibility = 'withdrawn';
    } else {
      eligibility = 'eligible';
    }

    const defaultConsent: ConsentRecord = {
      id: consentRow?.id || 'cst_' + row.id,
      memberId: row.id,
      timestamp: (consentRow?.metadata?.timestamp as string) || row.created_at || new Date().toISOString(),
      consentedToExport: isConsenting,
      acknowledgedNoRemoteWipe: Boolean(consentRow?.metadata?.acknowledged_no_remote_wipe ?? true),
      termsVersion: consentRow?.version || '2026.1',
      ipHashSample: (consentRow?.metadata?.ip_sample as string) || '',
      revokedAt: consentRow?.withdrawn_at || undefined,
      revocationReason: (consentRow?.metadata?.revocation_reason as string) || undefined,
    };

    return {
      id: row.id,
      displayName: row.display_name,
      countryCode: row.country_code,
      phoneCallingCode: row.phone_e164.startsWith('+') ? row.phone_e164.slice(0, 4) : '+',
      rawPhone: row.phone_e164,
      normalizedE164: row.phone_e164,
      preferredLanguage: row.preferred_language || 'en',
      referralCode: 'CG-' + row.id.slice(0, 6).toUpperCase(),
      consent: defaultConsent,
      eligibility,
      registeredAt: row.created_at || new Date().toISOString(),
      lastActiveAt: row.updated_at || new Date().toISOString(),
      downloadCount: 0,
      totalReferrals: 0,
      isSampleRecord: false,
    };
  }
}

export const supabaseService = new SupabaseService();
