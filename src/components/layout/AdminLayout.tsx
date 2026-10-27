/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, AdminScreen } from '../../context/AppContext';
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
  Shield,
  Layers,
} from 'lucide-react';
import { SampleDataBanner } from '../common/Disclaimers';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminScreen, setAdminScreen, setViewMode, locale, setLocale, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuSections: { id: AdminScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Overview & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'members', label: '2. Member Management', icon: <Users className="w-4 h-4" /> },
    { id: 'consent_removals', label: '3. Consent & Removals', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'releases', label: '4. Release Management', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'allowance', label: '5. Weekly Allowance & Pilot', icon: <Sliders className="w-4 h-4" /> },
    { id: 'packages', label: '6. Future Package Tiers', icon: <Package className="w-4 h-4" /> },
    { id: 'referrals_admin', label: '7. Referral Operations', icon: <Share2 className="w-4 h-4" /> },
    { id: 'abuse', label: '8. Abuse Reports', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'audit_logs', label: '9. Audit Log Viewer', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'settings', label: '10. System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentLabel = menuSections.find(m => m.id === adminScreen)?.label || 'Console';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <SampleDataBanner />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-xs">
                GS
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Admin Console</span>
                <span className="text-[10px] text-amber-400 font-mono">Phase 1 Demo UI</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuSections.map(item => {
              const isActive = adminScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-teal-400' : 'text-slate-500'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800 space-y-2">
            <div className="px-2 py-1 text-[11px] text-slate-500 leading-tight">
              Notice: Server-side RBAC and real DB will be bound in Phase 2.
            </div>
            <button
              onClick={() => setViewMode('member')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Member View</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header for Admin */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800"
              aria-label="Toggle admin navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs font-bold text-white truncate max-w-[200px]">{currentLabel}</span>
          </div>
          <button
            onClick={() => setViewMode('member')}
            className="text-xs text-teal-400 hover:underline"
          >
            Member View
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 p-3 space-y-1 z-50">
            {menuSections.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setAdminScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  adminScreen === item.id
                    ? 'bg-teal-500/20 text-teal-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-x-hidden">
          {/* Top Admin Bar with Breadcrumbs & Actions */}
          <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-slate-200 font-medium">{currentLabel}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                Simulated Administrative Mode
              </span>
              <div className="flex items-center bg-slate-800 rounded p-0.5 text-xs">
                <button
                  onClick={() => setLocale('en')}
                  className={`px-2 py-0.5 rounded ${locale === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale('fr')}
                  className={`px-2 py-0.5 rounded ${locale === 'fr' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  FR
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
