/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          user_id: string | null;
          display_name: string;
          country_code: string;
          phone_calling_code: string;
          raw_phone: string;
          normalized_e164: string;
          preferred_language: 'en' | 'fr';
          referral_code: string;
          referred_by_code: string | null;
          eligibility: 'eligible' | 'under_review' | 'suspended' | 'withdrawn';
          registered_at: string;
          last_active_at: string;
          is_sample_record: boolean;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          display_name: string;
          country_code: string;
          phone_calling_code: string;
          raw_phone: string;
          normalized_e164: string;
          preferred_language?: 'en' | 'fr';
          referral_code?: string;
          referred_by_code?: string | null;
          eligibility?: 'eligible' | 'under_review' | 'suspended' | 'withdrawn';
          registered_at?: string;
          last_active_at?: string;
          is_sample_record?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          display_name?: string;
          country_code?: string;
          phone_calling_code?: string;
          raw_phone?: string;
          normalized_e164?: string;
          preferred_language?: 'en' | 'fr';
          referral_code?: string;
          referred_by_code?: string | null;
          eligibility?: 'eligible' | 'under_review' | 'suspended' | 'withdrawn';
          registered_at?: string;
          last_active_at?: string;
          is_sample_record?: boolean;
        };
      };
      consent_records: {
        Row: {
          id: string;
          member_id: string;
          purpose: string;
          granted: boolean;
          terms_version: string;
          acknowledged_no_remote_wipe: boolean;
          timestamp: string;
          revoked_at: string | null;
          revocation_reason: string | null;
          ip_hash_sample: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          purpose?: string;
          granted: boolean;
          terms_version?: string;
          acknowledged_no_remote_wipe?: boolean;
          timestamp?: string;
          revoked_at?: string | null;
          revocation_reason?: string | null;
          ip_hash_sample?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          purpose?: string;
          granted?: boolean;
          terms_version?: string;
          acknowledged_no_remote_wipe?: boolean;
          timestamp?: string;
          revoked_at?: string | null;
          revocation_reason?: string | null;
          ip_hash_sample?: string | null;
        };
      };
      contact_allocations: {
        Row: {
          id: string;
          recipient_member_id: string;
          allocated_member_id: string;
          release_id: string | null;
          allocated_at: string;
          status: 'active' | 'revoked';
        };
        Insert: {
          id?: string;
          recipient_member_id: string;
          allocated_member_id: string;
          release_id?: string | null;
          allocated_at?: string;
          status?: 'active' | 'revoked';
        };
        Update: {
          id?: string;
          recipient_member_id?: string;
          allocated_member_id?: string;
          release_id?: string | null;
          allocated_at?: string;
          status?: 'active' | 'revoked';
        };
      };
      contact_releases: {
        Row: {
          id: string;
          release_number: number;
          release_title: string;
          published_at: string;
          total_eligible_contacts: number;
          incremental_new_contacts: number;
          file_size_bytes: number;
          hash_checksum: string;
          status: 'published' | 'draft' | 'archived';
          description_en: string;
          description_fr: string;
        };
        Insert: {
          id?: string;
          release_number: number;
          release_title: string;
          published_at?: string;
          total_eligible_contacts?: number;
          incremental_new_contacts?: number;
          file_size_bytes?: number;
          hash_checksum?: string;
          status?: 'published' | 'draft' | 'archived';
          description_en?: string;
          description_fr?: string;
        };
        Update: {
          id?: string;
          release_number?: number;
          release_title?: string;
          published_at?: string;
          total_eligible_contacts?: number;
          incremental_new_contacts?: number;
          file_size_bytes?: number;
          hash_checksum?: string;
          status?: 'published' | 'draft' | 'archived';
          description_en?: string;
          description_fr?: string;
        };
      };
      download_logs: {
        Row: {
          id: string;
          member_id: string;
          release_id: string | null;
          download_type: 'full' | 'incremental';
          downloaded_at: string;
          contact_count: number;
          status: 'completed' | 'failed';
          ip_sample: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          release_id?: string | null;
          download_type?: 'full' | 'incremental';
          downloaded_at?: string;
          contact_count: number;
          status?: 'completed' | 'failed';
          ip_sample?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          release_id?: string | null;
          download_type?: 'full' | 'incremental';
          downloaded_at?: string;
          contact_count?: number;
          status?: 'completed' | 'failed';
          ip_sample?: string | null;
        };
      };
      admin_roles: {
        Row: {
          user_id: string;
          role: 'admin' | 'moderator' | 'superadmin';
          granted_at: string;
          granted_by: string | null;
        };
        Insert: {
          user_id: string;
          role?: 'admin' | 'moderator' | 'superadmin';
          granted_at?: string;
          granted_by?: string | null;
        };
        Update: {
          user_id?: string;
          role?: 'admin' | 'moderator' | 'superadmin';
          granted_at?: string;
          granted_by?: string | null;
        };
      };
      audit_events: {
        Row: {
          id: string;
          timestamp: string;
          actor: string;
          actor_role: string;
          action: string;
          details: string;
          ip_address_sample: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          actor: string;
          actor_role?: string;
          action: string;
          details: string;
          ip_address_sample?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          timestamp?: string;
          actor?: string;
          actor_role?: string;
          action?: string;
          details?: string;
          ip_address_sample?: string | null;
          metadata?: Json | null;
        };
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
