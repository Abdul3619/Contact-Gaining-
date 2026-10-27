/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Locale, ThemeMode } from '../types';
import { mockDataService } from '../services/mockDataService';
import { TRANSLATIONS } from '../data/translations';

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

  useEffect(() => {
    setActiveMember(mockDataService.getActiveMember());
    setAllMembers(mockDataService.getMembers());
  }, []);

  const refreshData = () => {
    setActiveMember(mockDataService.getActiveMember());
    setAllMembers(mockDataService.getMembers());
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const dict = TRANSLATIONS[locale] || TRANSLATIONS.en;
    return (dict as Record<string, string>)[key] || TRANSLATIONS.en[key] || String(key);
  };

  const switchActiveMember = (memberId: string) => {
    mockDataService.setActiveMemberId(memberId);
    const m = mockDataService.getActiveMember();
    setActiveMember(m);
    addToast(`Switched active demonstration account to ${m.displayName}`, 'info');
  };

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const resetDemonstrationData = () => {
    mockDataService.resetToInitial();
    refreshData();
    addToast('Demonstration data restored to initial baseline.', 'info');
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
