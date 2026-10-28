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

/**
 * Reconciled Supabase Database Schema matching live database qwppwilumpokakzpusmo
 */
export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string; // references auth.users.id
          display_name: string;
          country_code: string;
          phone_e164: string;
          preferred_language: 'en' | 'fr';
          status: 'active' | 'withdrawn' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          country_code: string;
          phone_e164: string;
          preferred_language?: 'en' | 'fr';
          status?: 'active' | 'withdrawn' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          country_code?: string;
          phone_e164?: string;
          preferred_language?: 'en' | 'fr';
          status?: 'active' | 'withdrawn' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consent_records: {
        Row: {
          id: string;
          member_id: string;
          consent_type: string;
          granted: boolean;
          source: string;
          version: string;
          withdrawn_at: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          consent_type?: string;
          granted: boolean;
          source?: string;
          version?: string;
          withdrawn_at?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          consent_type?: string;
          granted?: boolean;
          source?: string;
          version?: string;
          withdrawn_at?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      contact_allocations: {
        Row: {
          id: string;
          recipient_member_id: string;
          contact_member_id: string;
          allocated_at: string;
        };
        Insert: {
          id?: string;
          recipient_member_id: string;
          contact_member_id: string;
          allocated_at?: string;
        };
        Update: {
          id?: string;
          recipient_member_id?: string;
          contact_member_id?: string;
          allocated_at?: string;
        };
        Relationships: [];
      };
      contact_releases: {
        Row: {
          id: string;
          status: 'published' | 'draft' | 'archived';
          count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          status?: 'published' | 'draft' | 'archived';
          count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: 'published' | 'draft' | 'archived';
          count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      download_logs: {
        Row: {
          id: string;
          member_id: string;
          release_id: string | null;
          downloaded_at: string;
          contact_count: number;
          format: string;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          release_id?: string | null;
          downloaded_at?: string;
          contact_count: number;
          format?: string;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          release_id?: string | null;
          downloaded_at?: string;
          contact_count?: number;
          format?: string;
          user_agent?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          created_at: string;
          action: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          action: string;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          action?: string;
          metadata?: Json | null;
        };
        Relationships: [];
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
        Relationships: [];
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
