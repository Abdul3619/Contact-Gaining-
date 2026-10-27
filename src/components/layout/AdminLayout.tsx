/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, AdminScreen } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  CalendarCheck,
  Sliders,
  Package,
  Share2,
  ShieldAlert,
  ClipboardList,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { SampleDataBanner } from '../common/Disclaimers';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminScreen, setAdminScreen, setViewMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuSections: { id: AdminScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview & Activity', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'members', label: 'Member Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'consent_removals', label: 'Contact Withdrawals', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'releases', label: 'Release Batches', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'allowance', label: 'Access Policy & Limits', icon: <Sliders className="w-4 h-4" /> },
    { id: 'packages', label: 'Future Tier Preview', icon: <Package className="w-4 h-4" /> },
    { id: 'referrals_admin', label: 'Referral Operations', icon: <Share2 className="w-4 h-4" /> },
    { id: 'abuse', label: 'Safety & Moderation', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'audit_logs', label: 'Audit Trail', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentLabel = menuSections.find(m => m.id === adminScreen)?.label || 'Console';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors text-[#1C1915] dark:text-[#F5F0E6] relative z-10">
      <SampleDataBanner />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-[#FFFFFF]/90 dark:bg-[#0B0A08]/95 border-r border-[#E5DFD5] dark:border-[#2B261F] shrink-0 transition-colors">
          <div className="p-4 border-b border-[#E5DFD5] dark:border-[#2B261F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#15130F] dark:bg-[#1D1A15] text-[#C5A15B] border border-[#9D7B43]/50 dark:border-[#C5A15B]/50 flex items-center justify-center font-bold text-xs shadow-xs">
                CG
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight text-[#1C1915] dark:text-[#F5F0E6]">
                  Management
                </span>
                <span className="text-[10px] text-[#6B6357] dark:text-[#A8A196]">
                  Community Console
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuSections.map(item => {
              const isActive = adminScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminScreen(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] font-semibold'
                      : 'text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#FFFFFF] hover:bg-[#F0ECE1] dark:hover:bg-[#1D1A15]'
                  }`}
                >
                  <span className={isActive ? 'text-[#C5A15B]' : 'text-[#6B6357] dark:text-[#81796D]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#E5DFD5] dark:border-[#2B261F]">
            <button
              onClick={() => setViewMode('member')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-[#F0ECE1] hover:bg-[#E5DFD5] text-[#1C1915] dark:bg-[#1D1A15] dark:hover:bg-[#2B261F] dark:text-[#F5F0E6] rounded-lg transition-colors cursor-pointer border border-[#E5DFD5] dark:border-[#2B261F]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to member view</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header for Admin */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#FFFFFF]/90 dark:bg-[#0B0A08]/95 border-b border-[#E5DFD5] dark:border-[#2B261F]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#6B6357] dark:text-[#A8A196] hover:text-[#1C1915] dark:hover:text-[#FFFFFF] rounded-lg border border-[#E5DFD5] dark:border-[#2B261F]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold truncate max-w-[180px]">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setViewMode('member')}
              className="text-xs text-[#9D7B43] dark:text-[#C5A15B] font-semibold hover:underline"
            >
              Member view
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFFF] dark:bg-[#0B0A08] border-b border-[#E5DFD5] dark:border-[#2B261F] p-3 space-y-1 z-50">
            {menuSections.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setAdminScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  adminScreen === item.id
                    ? 'bg-[#15130F] text-[#F5F0E6] dark:bg-[#2B261F] dark:text-[#C5A15B] font-semibold'
                    : 'text-[#6B6357] dark:text-[#A8A196]'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Admin Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
