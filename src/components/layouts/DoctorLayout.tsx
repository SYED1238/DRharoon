'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useClinicStore } from '@/lib/store';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  FileText,
  FlaskConical,
  Award,
  CalendarClock,
  BarChart3,
  Settings,
  Menu,
  X,
  Play,
  Volume2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useClinicStore((state) => state.settings);
  const tokens = useClinicStore((state) => state.tokens);
  const callToken = useClinicStore((state) => state.callToken);

  const nextWaiting = tokens.find((t) => t.status === 'waiting');
  const currentlyServing = tokens.find((t) => t.status === 'called' || t.status === 'in-consultation');

  const navItems = [
    { href: '/doctor', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/doctor/appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { href: '/doctor/patients', label: 'Patient Records', icon: <Users className="w-4 h-4" /> },
    { href: '/doctor/consultation', label: 'Consultations', icon: <Stethoscope className="w-4 h-4" />, highlight: true },
    { href: '/doctor/prescriptions', label: 'Prescriptions', icon: <FileText className="w-4 h-4" /> },
    { href: '/doctor/laboratory', label: 'Laboratory', icon: <FlaskConical className="w-4 h-4" /> },
    { href: '/doctor/certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { href: '/doctor/follow-ups', label: 'Follow-ups', icon: <CalendarClock className="w-4 h-4" /> },
    { href: '/doctor/reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/doctor/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Mobile Bottom Bar Primary Tabs
  const mobileBottomTabs = [
    { href: '/doctor', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/doctor/consultation', label: 'Consult', icon: <Stethoscope className="w-5 h-5" />, primary: true },
    { href: '/doctor/appointments', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
    { href: '/doctor/patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { href: '/doctor/prescriptions', label: 'Rx', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col text-[#172D32]">
      {/* Universal Portal Switcher */}
      <PortalSwitcher />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5ECEA] shrink-0">
          <div className="p-5 border-b border-[#E5ECEA]">
            <BrandLogo size="md" />
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#F5F8F7] border border-[#E5ECEA] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#123C45] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Doctor Station
              </span>
              <span className="text-[10px] text-[#718286] font-medium">Room 1</span>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#123C45] text-white shadow-xs'
                      : item.highlight
                      ? 'bg-teal-50 text-[#1C7774] hover:bg-teal-100/70 border border-teal-200/60'
                      : 'text-[#172D32]/80 hover:bg-[#F5F8F7] hover:text-[#123C45]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#35A99A]' : 'text-[#718286]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#35A99A]" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5ECEA] bg-[#FAFBFB]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#123C45] text-white flex items-center justify-center font-bold text-xs shrink-0 border-2 border-[#35A99A]/40">
                DR
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#123C45] truncate">{settings.doctorName.split(',')[0]}</p>
                <p className="text-[10px] text-[#718286] truncate">Internal Medicine</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Fullscreen Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <BrandLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-teal-50 border-b border-teal-100 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-[#123C45]">Dr. Haroon's Workstation</span>
              </div>

              <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-[#123C45] text-white shadow-xs'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={isActive ? 'text-[#35A99A]' : 'text-gray-500'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs">
                <Link
                  href="/tv"
                  target="_blank"
                  className="w-full py-2.5 bg-[#123C45] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Open Waiting TV</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-[#E5ECEA] px-3 sm:px-8 py-3 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#123C45] tracking-tight">
                  Physician Workstation
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#718286] hidden sm:block">
                  {settings.clinicName}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {nextWaiting && (
                <button
                  onClick={() => callToken(nextWaiting.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#1C7774] hover:bg-[#123C45] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-xs active:scale-95 transition-all"
                  title="Broadcasts token call to Waiting TV"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#35A99A]" />
                  <span>Call {nextWaiting.tokenNumber}</span>
                </button>
              )}

              <Link
                href="/doctor/consultation"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#35A99A] hover:bg-[#2b9688] text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-xs transition-all"
              >
                <Play className="w-3 h-3 fill-white" />
                <span className="hidden sm:inline">Start Consult</span>
                <span className="sm:hidden">Consult</span>
              </Link>
            </div>
          </header>

          {/* Page Body with safe bottom padding for mobile bar */}
          <main className="p-3 sm:p-6 md:p-8 flex-1 pb-24 lg:pb-8">{children}</main>
        </div>
      </div>

      {/* Mobile Sticky Bottom Tab Bar (App-like thumb navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5ECEA] shadow-lg px-2 py-1.5 flex items-center justify-around">
        {mobileBottomTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all min-w-[56px] ${
                tab.primary
                  ? 'bg-[#123C45] text-[#35A99A] shadow-xs'
                  : isActive
                  ? 'text-[#1C7774]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.href === '/doctor/consultation' && nextWaiting && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <ToastContainer />
    </div>
  );
}
