/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicHeader } from './components/layout/PublicHeader';
import { MemberLayout } from './components/layout/MemberLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Member Screens
import { LandingPage } from './components/member/LandingPage';
import { RegistrationFlow } from './components/member/RegistrationFlow';
import {
  SignInScreen,
  AccountRecoveryScreen,
  VerificationPendingScreen,
} from './components/member/AuthScreens';
import { MemberDashboard } from './components/member/MemberDashboard';
import { DownloadCentre } from './components/member/DownloadCentre';
import { ProfileAndConsent } from './components/member/ProfileAndConsent';
import { ReferralsAndHelp } from './components/member/ReferralsAndHelp';

// Admin Screens
import { AdminOverview } from './components/admin/AdminOverview';
import { MemberManagement } from './components/admin/MemberManagement';
import { ConsentRemovalManagement } from './components/admin/ConsentRemovalManagement';
import { ReleaseManagement } from './components/admin/ReleaseManagement';
import { AllowanceConfig } from './components/admin/AllowanceConfig';
import { PackageConfig } from './components/admin/PackageConfig';
import { ReferralManagement } from './components/admin/ReferralManagement';
import { AbuseModeration } from './components/admin/AbuseModeration';
import { AuditLogViewer } from './components/admin/AuditLogViewer';
import { SystemSettingsView } from './components/admin/SystemSettingsView';
import { SampleDataBanner } from './components/common/Disclaimers';

const AppContent: React.FC = () => {
  const { viewMode, setViewMode, memberScreen, setMemberScreen, adminScreen, locale, setLocale, t } = useApp();

  // Public Landing Mode
  if (viewMode === 'public') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <SampleDataBanner />
        <PublicHeader />
        <main className="flex-1">
          <LandingPage />
        </main>

        {/* Public Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="font-bold text-white text-sm">GlobalSphere International Exchange</span>
              <p className="text-slate-500 text-[11px] text-center sm:text-left max-w-md">
                Phase 1 Prototype: Consensual, international contact exchange. Voluntary opt-in with revocable permission and RFC 2426 vCard format.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
              <button
                onClick={() => {
                  setViewMode('member');
                  setMemberScreen('dashboard');
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Member Portal
              </button>
              <span>·</span>
              <button
                onClick={() => setViewMode('admin')}
                className="hover:text-teal-400 text-teal-300 transition-colors cursor-pointer font-semibold"
              >
                Admin Console
              </button>
              <span>·</span>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                <button
                  onClick={() => setLocale('en')}
                  className={`px-1.5 py-0.5 rounded ${locale === 'en' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <span>/</span>
                <button
                  onClick={() => setLocale('fr')}
                  className={`px-1.5 py-0.5 rounded ${locale === 'fr' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                >
                  FR
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800/60 text-center text-[11px] text-slate-500">
            Demonstration environment. No real phone numbers are stored, crawled, or redistributed.
          </div>
        </footer>
      </div>
    );
  }

  // Admin View Mode
  if (viewMode === 'admin') {
    return (
      <AdminLayout>
        {adminScreen === 'overview' && <AdminOverview />}
        {adminScreen === 'members' && <MemberManagement />}
        {adminScreen === 'consent_removals' && <ConsentRemovalManagement />}
        {adminScreen === 'releases' && <ReleaseManagement />}
        {adminScreen === 'allowance' && <AllowanceConfig />}
        {adminScreen === 'packages' && <PackageConfig />}
        {adminScreen === 'referrals_admin' && <ReferralManagement />}
        {adminScreen === 'abuse' && <AbuseModeration />}
        {adminScreen === 'audit_logs' && <AuditLogViewer />}
        {adminScreen === 'settings' && <SystemSettingsView />}
      </AdminLayout>
    );
  }

  // Member Portal View Mode
  return (
    <MemberLayout>
      {memberScreen === 'landing' && <LandingPage />}
      {memberScreen === 'register' && <RegistrationFlow />}
      {memberScreen === 'sign_in' && <SignInScreen />}
      {memberScreen === 'recovery' && <AccountRecoveryScreen />}
      {memberScreen === 'verification_pending' && <VerificationPendingScreen />}
      {memberScreen === 'dashboard' && <MemberDashboard />}
      {memberScreen === 'downloads' && <DownloadCentre />}
      {memberScreen === 'profile' && <ProfileAndConsent />}
      {memberScreen === 'referrals' && <ReferralsAndHelp />}
    </MemberLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}
