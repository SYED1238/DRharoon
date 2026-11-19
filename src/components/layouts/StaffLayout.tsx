'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Ticket,
  CreditCard,
  FlaskConical,
  Receipt,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronRight,
  PlusCircle,
  Tv2,
} from 'lucide-react';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useClinicStore((state) => state.settings);
  const tokens = useClinicStore((state) => state.tokens);
  const invoices = useClinicStore((state) => state.invoices);

  const waitingCount = tokens.filter((t) => t.status === 'waiting').length;
  const servingCount = tokens.filter((t) => t.status === 'called' || t.status === 'in-consultation').length;
  const todayCollections = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  const navItems = [
    { href: '/staff', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/staff/register', label: 'Register Patient', icon: <UserPlus className="w-4 h-4" />, highlight: true },
    { href: '/staff/patients', label: 'Patients Directory', icon: <Users className="w-4 h-4" /> },
    { href: '/staff/tokens', label: 'Token Queue & TV', icon: <Ticket className="w-4 h-4" />, badge: waitingCount > 0 ? String(waitingCount) : undefined },
    { href: '/staff/appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { href: '/staff/billing', label: 'Billing & Cashier', icon: <CreditCard className="w-4 h-4" /> },
    { href: '/staff/laboratory', label: 'Laboratory Orders', icon: <FlaskConical className="w-4 h-4" /> },
    { href: '/staff/invoices', label: 'Invoices & Receipts', icon: <Receipt className="w-4 h-4" /> },
    { href: '/staff/reports', label: 'Daily Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/staff/settings', label: 'Clinic Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col text-[#172D32]">
      {/* Universal Switcher Bar */}
      <PortalSwitcher />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5ECEA] shrink-0">
          <div className="p-5 border-b border-[#E5ECEA]">
            <BrandLogo size="md" />
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1C7774] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                Front Desk / Reception
              </span>
              <span className="text-[10px] text-teal-800 font-semibold">Active Shift</span>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="px-4 py-3 bg-[#FAFBFB] border-b border-[#E5ECEA] grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-[#E5ECEA]">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Waiting</span>
              <span className="text-base font-extrabold text-[#123C45]">{waitingCount}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-[#E5ECEA]">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Collections</span>
              <span className="text-xs font-bold text-emerald-700 truncate block">{formatCurrency(todayCollections)}</span>
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
                      ? 'bg-[#35A99A]/15 text-[#123C45] border border-[#35A99A]/40 hover:bg-[#35A99A]/25'
                      : 'text-[#172D32]/80 hover:bg-[#F5F8F7] hover:text-[#123C45]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#35A99A]' : 'text-[#718286]'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && <ChevronRight className="w-3.5 h-3.5 text-[#35A99A]" />}
                </Link>
              );
            })}
          </nav>

          {/* TV Display Quick Link */}
          <div className="p-3 border-t border-[#E5ECEA]">
            <Link
              href="/tv"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
            >
              <Tv2 className="w-3.5 h-3.5 text-[#35A99A]" />
              <span>Open Waiting TV (New Tab)</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar */}
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
          {/* Top Bar */}
          <header className="bg-white border-b border-[#E5ECEA] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-[#123C45] tracking-tight">Clinic Reception & Intake</h1>
                <p className="text-[11px] text-[#718286] hidden sm:block">Dr. Haroon's Medical Center • Front Desk</p>
              </div>
            </div>

            {/* Quick Action Buttons for Staff */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/staff/tokens"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-teal-50 border border-teal-200 text-[#1C7774] hover:bg-teal-100 rounded-xl text-xs font-bold transition-all"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Queue ({waitingCount} waiting)</span>
              </Link>

              <Link
                href="/staff/register"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#21865D] hover:bg-[#1a6e4c] text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Patient</span>
              </Link>
            </div>
          </header>

          <main className="p-4 md:p-8 flex-1">{children}</main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
