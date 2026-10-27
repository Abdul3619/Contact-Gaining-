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
import { UnifiedAtmosphericBackground } from './components/common/UnifiedBackground';
import { ThemeToggle } from './components/common/ThemeToggle';

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
import { ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, setViewMode, memberScreen, setMemberScreen, adminScreen, locale, setLocale, t } = useApp();

  // Public Landing Mode
  if (viewMode === 'public') {
    return (
      <div className="min-h-screen bg-transparent text-[#1C1915] dark:text-[#F5F0E6] flex flex-col font-sans transition-colors duration-300 relative selection:bg-[#C5A15B] selection:text-[#0B0A08]">
        <UnifiedAtmosphericBackground />
        <SampleDataBanner />
        <PublicHeader />
        <main className="flex-1 relative z-10">
          <LandingPage />
        </main>

        {/* Public Footer */}
        <footer className="relative z-10 bg-[#FFFFFF]/90 dark:bg-[#15130F]/90 backdrop-blur-md text-[#6B6357] dark:text-[#A8A196] text-xs border-t border-[#E5DFD5] dark:border-[#2B261F] py-12 px-4 sm:px-6 transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2 max-w-md text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A15B]" />
                <span className="font-bold text-sm tracking-tight text-[#1C1915] dark:text-[#F5F0E6]">
                  {t('brandName')}
                </span>
                <span className="text-[11px] text-[#6B6357] dark:text-[#A8A196]">
                  · {t('brandTagline')}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-[#6B6357] dark:text-[#A8A196]">
                A respectful community for creators, freelancers, and small businesses expanding their WhatsApp network through mutual consent.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span>Designed &amp; built by</span>
                <a
                  href="https://abdulwahab-portfolio-tau.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#9D7B43] dark:text-[#C5A15B] hover:underline inline-flex items-center gap-1"
                >
                  Abdul Wahab
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
                <button
                  onClick={() => {
                    setViewMode('member');
                    setMemberScreen('dashboard');
                  }}
                  className="text-[#1C1915] dark:text-[#F5F0E6] hover:text-[#9D7B43] dark:hover:text-[#C5A15B] transition-colors cursor-pointer"
                >
                  {t('switchModeMember')}
                </button>
                <span className="text-[#E5DFD5] dark:text-[#2B261F]">·</span>
                <button
                  onClick={() => {
                    setViewMode('public');
                    setMemberScreen('landing');
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1C1915] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  {t('navHowItWorks')}
                </button>
                <span className="text-[#E5DFD5] dark:text-[#2B261F]">·</span>
                <a
                  href="https://abdulwahab-portfolio-tau.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9D7B43] dark:hover:text-[#C5A15B] inline-flex items-center gap-1 transition-colors"
                >
                  Founder portfolio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="flex items-center gap-1 bg-[#F0ECE1] dark:bg-[#1D1A15] p-1 rounded-lg border border-[#E5DFD5] dark:border-[#2B261F] text-xs font-medium">
                  <button
                    onClick={() => setLocale('en')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      locale === 'en'
                        ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] font-semibold shadow-xs'
                        : 'text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#F5F0E6]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLocale('fr')}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      locale === 'fr'
                        ? 'bg-[#FFFFFF] dark:bg-[#2B261F] text-[#1C1915] dark:text-[#F5F0E6] font-semibold shadow-xs'
                        : 'text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#F5F0E6]'
                    }`}
                  >
                    Français
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#E5DFD5] dark:border-[#2B261F] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B6357] dark:text-[#81796D]">
            <span>© {new Date().getFullYear()} Contact Gaining. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <span>Voluntary opt-in · Transparent privacy · Easy withdrawal</span>
              {/* Discreet management console access */}
              <button
                onClick={() => setViewMode('admin')}
                className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                title="Management console"
              >
                Console
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Admin View Mode
  if (viewMode === 'admin') {
    return (
      <div className="relative min-h-screen bg-transparent text-[#1C1915] dark:text-[#F5F0E6] transition-colors duration-300">
        <UnifiedAtmosphericBackground />
        <div className="relative z-10">
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
        </div>
      </div>
    );
  }

  // Member Portal View Mode
  return (
    <div className="relative min-h-screen bg-transparent text-[#1C1915] dark:text-[#F5F0E6] transition-colors duration-300">
      <UnifiedAtmosphericBackground />
      <div className="relative z-10">
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
      </div>
    </div>
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
