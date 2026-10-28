/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Member, Locale, ThemeMode, ConsentRecord } from '../types';
import { mockDataService } from '../services/mockDataService';
import { TRANSLATIONS } from '../data/translations';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { supabaseService, SignUpParams } from '../services/supabaseService';
import { generateRealVcfString, triggerVcfDownload } from '../services/vcfGenerator';

export type AppViewMode = 'public' | 'member' | 'admin';
export type MemberScreen = 
  | 'landing' 
  | 'register' 
  | 'sign_in' 
  | 'recovery' 
  | 'verification_pending' 
  | 'dashboard' 
  | 'downloads' 
  | 'profile' 
  | 'referrals';

export type AdminScreen =
  | 'overview'
  | 'members'
  | 'consent_removals'
  | 'releases'
  | 'allowance'
  | 'packages'
  | 'referrals_admin'
  | 'abuse'
  | 'audit_logs'
  | 'settings';

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  themeMode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setThemeMode: (m: ThemeMode) => void;
  toggleTheme: () => void;
  viewMode: AppViewMode;
  setViewMode: (m: AppViewMode) => void;
  memberScreen: MemberScreen;
  setMemberScreen: (s: MemberScreen) => void;
  adminScreen: AdminScreen;
  setAdminScreen: (s: AdminScreen) => void;
  activeMember: Member;
  switchActiveMember: (memberId: string) => void;
  allMembers: Member[];
  refreshData: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  resetDemonstrationData: () => void;

  // Supabase Backend Integration
  isBackendConfigured: boolean;
  isSupabaseConnected: boolean;
  currentUser: { id: string; email?: string } | null;
  isAdmin: boolean;
  allocatedContacts: Member[];
  loadAllocatedContacts: () => Promise<void>;
  allocateNewContacts: (count?: number) => Promise<{ count: number; error?: string }>;
  downloadAllocatedVcfFile: () => Promise<{ success: boolean; count: number; error?: string }>;
  signUpWithSupabase: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOutSupabase: () => Promise<void>;
  updateConsentWithSupabase: (granted: boolean, reason?: string) => Promise<{ success: boolean; error?: string }>;
  testBackendConnection: () => Promise<{ connected: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'contact_gaining_theme';
const LOCALE_STORAGE_KEY = 'contact_gaining_locale';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === 'en' || saved === 'fr') return saved;
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) {
        return 'fr';
      }
    } catch {}
    return 'en';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {}
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const resolvedTheme: 'dark' | 'light' =
    themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
  };

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {}
  };

  const [viewMode, setViewMode] = useState<AppViewMode>('public');
  const [memberScreen, setMemberScreen] = useState<MemberScreen>('landing');
  const [adminScreen, setAdminScreen] = useState<AdminScreen>('overview');
  const [activeMember, setActiveMember] = useState<Member>(mockDataService.getActiveMember());
  const [allMembers, setAllMembers] = useState<Member[]>(mockDataService.getMembers());
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Supabase Integration State
  const [isBackendConfigured] = useState<boolean>(isSupabaseConfigured());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [allocatedContacts, setAllocatedContacts] = useState<Member[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Test backend connection on startup if configured
  useEffect(() => {
    if (isBackendConfigured) {
      testSupabaseConnection().then(res => {
        setIsSupabaseConnected(res.connected);
        if (res.connected) {
          console.log('Supabase backend connected successfully.');
        } else {
          console.warn('Supabase backend connection notice:', res.message);
        }
      });
    }
  }, [isBackendConfigured]);

  // Auth State Listener for Supabase sessions
  useEffect(() => {
    if (!isBackendConfigured) return;

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id, email: session.user.email });
        // Check admin role
        supabaseService.checkAdminRole(session.user.id).then(setIsAdmin);
        // Load member profile
        supabaseService.getMemberByUserId(session.user.id).then(mem => {
          if (mem) {
            setActiveMember(mem);
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id, email: session.user.email });
        const isAdm = await supabaseService.checkAdminRole(session.user.id);
        setIsAdmin(isAdm);
        const mem = await supabaseService.getMemberByUserId(session.user.id);
        if (mem) {
          setActiveMember(mem);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isBackendConfigured]);

  // Load allocated contacts for current member
  const loadAllocatedContacts = useCallback(async () => {
    if (isBackendConfigured && currentUser) {
      const res = await supabaseService.getAllocatedContactsForRecipient(activeMember.id);
      if (res.contacts.length > 0) {
        setAllocatedContacts(res.contacts);
        return;
      }
    }
    // Fallback: derive allocated contacts from sample data for demonstration
    const allocated = mockDataService.getAllocatedContactsForActiveMember();
    setAllocatedContacts(allocated);
  }, [isBackendConfigured, currentUser, activeMember.id]);

  useEffect(() => {
    loadAllocatedContacts();
  }, [loadAllocatedContacts]);

  const refreshData = () => {
    if (isBackendConfigured && currentUser) {
      supabaseService.getMemberByUserId(currentUser.id).then(mem => {
        if (mem) setActiveMember(mem);
      });
      loadAllocatedContacts();
    } else {
      setActiveMember(mockDataService.getActiveMember());
      setAllMembers(mockDataService.getMembers());
      loadAllocatedContacts();
    }
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const dict = TRANSLATIONS[locale] || TRANSLATIONS.en;
    return (dict as Record<string, string>)[key] || TRANSLATIONS.en[key] || String(key);
  };

  const switchActiveMember = (memberId: string) => {
    mockDataService.setActiveMemberId(memberId);
    const m = mockDataService.getActiveMember();
    setActiveMember(m);
    loadAllocatedContacts();
    addToast(`Switched active profile to ${m.displayName}`, 'info');
  };

  const resetDemonstrationData = () => {
    mockDataService.resetToInitial();
    refreshData();
    addToast('Demonstration data restored to initial baseline.', 'info');
  };

  // Real Supabase Actions
  const signUpWithSupabase = async (params: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    if (!isBackendConfigured) {
      // In local mode without Supabase key, complete registration cleanly in local session
      const res = mockDataService.registerMember({
        displayName: params.displayName,
        countryCode: params.countryCode,
        phoneCallingCode: params.phoneCallingCode,
        rawPhone: params.rawPhone,
        normalizedE164: params.rawPhone,
        preferredLanguage: params.preferredLanguage,
        referralCode: params.referralCode,
        consentedToExport: true,
        acknowledgedNoRemoteWipe: true,
      });

      if (res.success) {
        setActiveMember(res.member);
        addToast(`Registered as ${res.member.displayName} (Local preview mode).`, 'success');
        return { success: true };
      }
      return { success: false, error: res.error };
    }

    const res = await supabaseService.signUp(params);
    if (res.error) {
      return { success: false, error: res.error };
    }
    if (res.data?.member) {
      setActiveMember(res.data.member);
      addToast(`Account created successfully. Welcome, ${res.data.member.displayName}!`, 'success');
      return { success: true };
    }
    return { success: false, error: 'Registration incomplete.' };
  };

  const signInWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isBackendConfigured) {
      addToast('Supabase anon key not set in environment. Signed in to preview profile.', 'info');
      return { success: true };
    }

    const res = await supabaseService.signIn(email, password);
    if (res.error) {
      return { success: false, error: res.error };
    }
    if (res.data?.member) {
      setActiveMember(res.data.member);
      addToast(`Signed in as ${res.data.member.displayName}`, 'success');
    }
    return { success: true };
  };

  const signOutSupabase = async () => {
    if (isBackendConfigured) {
      await supabaseService.signOut();
    }
    setCurrentUser(null);
    setIsAdmin(false);
    setViewMode('public');
    setMemberScreen('landing');
    addToast('You have been signed out.', 'info');
  };

  const updateConsentWithSupabase = async (granted: boolean, reason?: string): Promise<{ success: boolean; error?: string }> => {
    if (isBackendConfigured) {
      const res = await supabaseService.recordConsentChange(activeMember.id, granted, reason);
      if (!res.success) {
        return { success: false, error: res.error || 'Failed to update consent.' };
      }
    }

    // Update in memory/state
    mockDataService.requestContactRemoval(activeMember.id, reason || 'Member consent toggle');
    const updatedConsent: ConsentRecord = {
      ...activeMember.consent,
      consentedToExport: granted,
      revokedAt: granted ? undefined : new Date().toISOString(),
      revocationReason: granted ? undefined : reason,
    };
    setActiveMember(prev => ({
      ...prev,
      eligibility: granted ? 'eligible' : 'withdrawn',
      consent: updatedConsent,
    }));

    addToast(
      granted
        ? 'Consent granted. Your contact is eligible for upcoming release batches.'
        : 'Consent withdrawn. Your contact is excluded from future contact releases.',
      granted ? 'success' : 'warning'
    );
    return { success: true };
  };

  // Atomic Allocation Handler
  const allocateNewContacts = async (count: number = 20): Promise<{ count: number; error?: string }> => {
    if (isBackendConfigured && currentUser) {
      const res = await supabaseService.allocateContactsForMember(activeMember.id, count);
      if (res.error) {
        return { count: 0, error: res.error };
      }
      await loadAllocatedContacts();
      return { count: res.allocatedCount };
    }

    // Fallback allocation from sample pool
    const pool = allMembers.filter(
      m => m.id !== activeMember.id && m.consent.consentedToExport && m.eligibility === 'eligible'
    );
    const existingIds = new Set((activeMember.previouslyAllocatedContactIds || []));
    const newPool = pool.filter(m => !existingIds.has(m.id)).slice(0, count);

    if (newPool.length > 0) {
      activeMember.previouslyAllocatedContactIds = [
        ...(activeMember.previouslyAllocatedContactIds || []),
        ...newPool.map(m => m.id),
      ];
      await loadAllocatedContacts();
    }
    return { count: newPool.length };
  };

  // Real VCF Download Handler
  const downloadAllocatedVcfFile = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    // 1. Fetch current allocated contacts excluding any that withdrew consent
    let exportContacts = allocatedContacts;
    if (isBackendConfigured) {
      const res = await supabaseService.getAllocatedContactsForRecipient(activeMember.id);
      if (res.error) {
        return { success: false, count: 0, error: res.error };
      }
      exportContacts = res.contacts;
    }

    // 2. Filter out self and any withdrawn contacts
    const filtered = exportContacts.filter(
      c => c.normalizedE164 !== activeMember.normalizedE164 && c.eligibility === 'eligible' && c.consent.consentedToExport
    );

    if (filtered.length === 0) {
      return {
        success: false,
        count: 0,
        error: 'No eligible allocated contacts are currently available to download. Request an allocation batch first.',
      };
    }

    // 3. Generate RFC 2426 compliant VCF string
    const exportData = filtered.map(c => ({
      id: c.id,
      displayName: c.displayName,
      normalizedE164: c.normalizedE164,
      countryCode: c.countryCode,
      referralCode: c.referralCode,
    }));

    const { vcfString, count } = generateRealVcfString(exportData, activeMember.normalizedE164);
    const fileName = `contact-gaining-allocated-${new Date().toISOString().slice(0, 10)}.vcf`;

    const downloaded = triggerVcfDownload(vcfString, fileName);
    if (!downloaded) {
      return { success: false, count: 0, error: 'Browser download blocked. Please check your browser download permissions.' };
    }

    // 4. Log download in database
    if (isBackendConfigured) {
      await supabaseService.logDownload(activeMember.id, null, count, 'full');
    }

    addToast(`Downloaded ${count} verified contacts in standard .vcf format.`, 'success');
    return { success: true, count };
  };

  const testBackendConnection = async () => {
    return await testSupabaseConnection();
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        themeMode,
        resolvedTheme,
        setThemeMode,
        toggleTheme,
        viewMode,
        setViewMode,
        memberScreen,
        setMemberScreen,
        adminScreen,
        setAdminScreen,
        activeMember,
        switchActiveMember,
        allMembers,
        refreshData,
        toasts,
        addToast,
        removeToast,
        resetDemonstrationData,
        isBackendConfigured,
        isSupabaseConnected,
        currentUser,
        isAdmin,
        allocatedContacts,
        loadAllocatedContacts,
        allocateNewContacts,
        downloadAllocatedVcfFile,
        signUpWithSupabase,
        signInWithSupabase,
        signOutSupabase,
        updateConsentWithSupabase,
        testBackendConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
