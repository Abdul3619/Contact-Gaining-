/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwppwilumpokakzpusmo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yVhtYXq5kr1Cm5K3b9q6UA_0r9mvrtk';

/**
 * Checks whether valid Supabase credentials have been configured.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('PLACEHOLDER') &&
    !supabaseAnonKey.includes('MY_')
  );
};

// Fallback anon key for graceful initialization if not yet set in environment
const fallbackAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key-prevent-init-crash';

/**
 * Shared Supabase Client instance
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey || fallbackAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Diagnostic utility to test live backend connection
 */
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  message: string;
  details?: Record<string, unknown>;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'VITE_SUPABASE_ANON_KEY is not configured in the current environment.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('key, updated_at')
      .limit(1);

    if (error) {
      return {
        connected: false,
        message: `Database responded with error: ${error.message} (code: ${error.code})`,
        details: { code: error.code, hint: error.hint },
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase backend (eu-west-1).',
      details: { rowCount: data ? data.length : 0 },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Connection attempt failed: ${msg}`,
    };
  }
};
