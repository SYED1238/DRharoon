'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useClinicStore } from '@/lib/store';
import {
  Home,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  User,
  ShieldCheck,
  Phone,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const patients = useClinicStore((state) => state.patients);
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const setSelectedPatientId = useClinicStore((state) => state.setSelectedPatientId);
  const settings = useClinicStore((state) => state.settings);

  // Active Patient
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const navItems = [
    { href: '/patient', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/patient/appointments', label: 'My Appointments', icon: <Calendar className="w-4 h-4" /> },
    { href: '/patient/records', label: 'Medical History', icon: <FileText className="w-4 h-4" /> },
    { href: '/patient/prescriptions', label: 'Prescriptions', icon: <Pill className="w-4 h-4" /> },
    { href: '/patient/laboratory', label: 'Lab Reports', icon: <FlaskConical className="w-4 h-4" /> },
    { href: '/patient/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col text-[#172D32]">
      {/* Universal Portal Switcher */}
      <PortalSwitcher />

      {/* Patient App Header */}
      <header className="bg-white border-b border-[#E5ECEA] sticky top-8 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <BrandLogo size="sm" />
          </div>

          {/* Reviewer Patient Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#F5F8F7] px-3 py-1.5 rounded-xl border border-[#E5ECEA]">
              <span className="text-[11px] text-[#718286] font-medium hidden sm:inline">Viewing as:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#123C45] focus:outline-none cursor-pointer pr-1"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}y / {p.gender})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Session</span>
            </div>
          </div>
        </div>

        {/* Desktop Horizontal Navigation Ribbon */}
        <div className="hidden md:block bg-[#FAFBFB] border-t border-[#E5ECEA]">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
                    isActive
                      ? 'border-[#1C7774] text-[#123C45] bg-white'
                      : 'border-transparent text-[#718286] hover:text-[#123C45] hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-[#35A99A]' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E5ECEA] p-3 space-y-1">
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
          </div>
        )}
      </header>

      {/* Patient Page Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">{children}</main>

      {/* Patient Footer */}
      <footer className="bg-white border-t border-[#E5ECEA] py-6 px-4 text-center text-xs text-[#718286]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#123C45]">{settings.clinicName}</span>
            <span>•</span>
            <span>Patient Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#35A99A]" /> Clinic Helpline: {settings.phone}
            </span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
