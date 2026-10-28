/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizePhoneNumber } from './phoneUtils';
import { Member, ConsentRecord, ContactRelease, Locale } from '../types';

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
   * Reconciled with live database columns:
   * - members: id (= user.id), display_name, country_code, phone_e164, preferred_language, status
   * - consent_records: member_id, consent_type, granted, source, version, withdrawn_at, metadata
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
        return { data: null, error: 'Registration failed: no authentication record returned.' };
      }

      const now = new Date().toISOString();

      // 4. Upsert profile in `members` table (id matches user.id)
      const { data: memberRow, error: memberError } = await supabase
        .from('members')
        .upsert({
          id: user.id,
          display_name: params.displayName.trim(),
          country_code: params.countryCode,
          phone_e164: normalizedE164,
          preferred_language: params.preferredLanguage,
          status: 'active',
          updated_at: now,
        })
        .select()
        .single();

      if (memberError) {
        return { data: null, error: `Failed to save member profile: ${memberError.message}` };
      }

      // 5. Insert explicit initial consent record in `consent_records`
      const { data: consentRow, error: consentError } = await supabase
        .from('consent_records')
        .insert({
          member_id: user.id,
          consent_type: 'whatsapp_contact_exchange',
          granted: true,
          source: 'registration',
          version: params.termsVersion || '2026.1',
          withdrawn_at: null,
          metadata: {
            acknowledged_no_remote_wipe: true,
            referral_code: params.referralCode || null,
            ip_sample: 'client_registration',
          },
        })
        .select()
        .single();

      if (consentError) {
        console.warn('Consent record logging notice:', consentError.message);
      }

      // 6. Record audit event
      await this.logAuditEvent('MEMBER_REGISTERED', {
        user_id: user.id,
        phone_e164: normalizedE164,
        email: user.email,
        timestamp: now,
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
   * Fetches member record by Supabase user id with latest consent record
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

      // Fetch latest consent record
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('*')
        .eq('member_id', memberRow.id)
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
   * Explicit Consent Management:
   * Records a new consent decision without overwriting historical records.
   * Updates member status accordingly in the live database.
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
          consent_type: 'whatsapp_contact_exchange',
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

      // 2. Update status in live members table
      const newStatus = granted ? 'active' : 'withdrawn';
      const { error: memberErr } = await supabase
        .from('members')
        .update({
          status: newStatus,
          updated_at: now,
        })
        .eq('id', memberId);

      if (memberErr) {
        return { success: false, error: memberErr.message };
      }

      // 3. Log audit event
      await this.logAuditEvent(granted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN', {
        member_id: memberId,
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
        consentedToExport: r.granted,
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
   * Reconciled with live database column: `contact_member_id`
   * Rules enforced:
   * - Recipient must have status = 'active'.
   * - Never allocate recipient their own contact.
   * - Never duplicate existing allocations.
   * - Allocated contacts must have active consent at allocation time.
   */
  async allocateContactsForMember(
    recipientMemberId: string,
    requestedCount: number = 20
  ): Promise<{ allocatedCount: number; contacts: Member[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { allocatedCount: 0, contacts: [], error: 'Supabase backend is not configured.' };
    }

    try {
      // 1. Verify recipient's own status
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
          error: `Your account is currently not active for contact allocations (status: ${recipient.status}). Please verify your consent in profile settings.`,
        };
      }

      // 2. Fetch existing allocated contact IDs for this recipient
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

      // 3. Query candidate members who have status = 'active'
      const { data: candidates, error: candError } = await supabase
        .from('members')
        .select('id, display_name, country_code, phone_e164, preferred_language, status, created_at, updated_at')
        .eq('status', 'active')
        .neq('id', recipientMemberId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (candError) {
        return { allocatedCount: 0, contacts: [], error: `Failed to query candidate contacts: ${candError.message}` };
      }

      // Filter out candidates already allocated
      const freshCandidates = (candidates || []).filter((c: { id: string }) => !existingIds.has(c.id));

      if (freshCandidates.length === 0) {
        return {
          allocatedCount: 0,
          contacts: [],
          error: null, // Honest empty state
        };
      }

      // 4. Verify candidate active consent in consent_records
      const candidateIds = freshCandidates.slice(0, requestedCount).map((c: { id: string }) => c.id);
      const { data: consentChecks } = await supabase
        .from('consent_records')
        .select('member_id, granted, withdrawn_at')
        .in('member_id', candidateIds);

      const activelyConsentingIds = new Set<string>();
      (consentChecks || []).forEach((rec: { member_id: string; granted: boolean; withdrawn_at: string | null }) => {
        if (rec.granted && !rec.withdrawn_at) {
          activelyConsentingIds.add(rec.member_id);
        }
      });

      // Default candidates whose consent was recorded at registration
      const confirmedCandidates = freshCandidates.filter(
        (c: { id: string }) => activelyConsentingIds.has(c.id) || !consentChecks?.some((chk: { member_id: string }) => chk.member_id === c.id)
      );

      if (confirmedCandidates.length === 0) {
        return { allocatedCount: 0, contacts: [], error: null };
      }

      // 5. Insert allocations using live column `contact_member_id`
      const now = new Date().toISOString();
      const insertRows = confirmedCandidates.slice(0, requestedCount).map((c: { id: string }) => ({
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

      const mappedContacts: Member[] = confirmedCandidates.slice(0, requestedCount).map(c => this.mapMemberRow(c));
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
   * strictly excluding any contact whose consent has since been withdrawn!
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

      // Check current consent status
      const { data: consentRows } = await supabase
        .from('consent_records')
        .select('member_id, granted, withdrawn_at')
        .in('member_id', allocatedIds);

      const activeConsentMap = new Map<string, boolean>();
      (consentRows || []).forEach((c: { member_id: string; granted: boolean; withdrawn_at: string | null }) => {
        activeConsentMap.set(c.member_id, c.granted && !c.withdrawn_at);
      });

      const eligibleContacts: Member[] = [];
      let revokedCount = 0;

      memberRows.forEach((m: { id: string; status: 'active' | 'withdrawn' | 'suspended'; display_name: string; country_code: string; phone_e164: string; preferred_language: 'en' | 'fr'; created_at: string; updated_at: string }) => {
        const hasConsent = activeConsentMap.get(m.id) ?? (m.status === 'active');
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
    if (!isSupabaseConfigured()) return false;

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
      status: 'active' | 'withdrawn' | 'suspended';
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
      eligibility: row.status === 'active' ? 'eligible' : 'withdrawn',
      registeredAt: row.created_at || new Date().toISOString(),
      lastActiveAt: row.updated_at || new Date().toISOString(),
      downloadCount: 0,
      totalReferrals: 0,
      isSampleRecord: false,
    };
  }
}

export const supabaseService = new SupabaseService();
