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
  Bell,
  Volume2,
  ChevronRight,
  Menu,
  X,
  Play,
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

  // Find next waiting patient in queue
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

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col text-[#172D32]">
      {/* Universal Portal Switcher */}
      <PortalSwitcher />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5ECEA] shrink-0">
          {/* Logo Area */}
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

          {/* Navigation Links */}
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

          {/* Quick Doctor Profile Footer */}
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

        {/* Mobile Sidebar Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 bg-white flex flex-col z-10">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <BrandLogo size="sm" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      pathname === item.href ? 'bg-[#123C45] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-[#E5ECEA] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-[#123C45] tracking-tight">Physician Workstation</h1>
                <p className="text-[11px] text-[#718286] hidden sm:block">{settings.clinicName}</p>
              </div>
            </div>

            {/* Quick Action: Call Next Patient from Queue */}
            <div className="flex items-center gap-3">
              {nextWaiting ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-[#718286]">Next in Queue:</span>
                    <span className="text-xs font-bold text-[#123C45]">
                      {nextWaiting.tokenNumber} • {nextWaiting.patientName}
                    </span>
                  </div>
                  <button
                    onClick={() => callToken(nextWaiting.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C7774] hover:bg-[#123C45] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                    title="Calls token on TV screen and triggers speech announcement"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#35A99A]" />
                    <span>Call Next ({nextWaiting.tokenNumber})</span>
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#718286] bg-[#F5F8F7] px-3 py-1.5 rounded-lg border border-[#E5ECEA]">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No patients waiting</span>
                </div>
              )}

              <Link
                href="/doctor/consultation"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#35A99A] hover:bg-[#2b9688] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Start Consultation</span>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 md:p-8 flex-1">{children}</main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
