/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Locale } from '../types';
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
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

  const setLocale = (l: Locale) => {
    setLocaleState(l);
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
