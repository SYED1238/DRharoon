'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClinicStore } from '@/lib/store';
import {
  Stethoscope,
  Users2,
  UserCheck,
  Tv2,
  Home,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';

export function PortalSwitcher() {
  const pathname = usePathname();
  const resetDemoData = useClinicStore((state) => state.resetDemoData);
  const tokens = useClinicStore((state) => state.tokens);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // If on TV display page, don't show the switcher bar to keep TV 100% immersive
  if (pathname === '/tv') {
    return null;
  }

  const currentServing = tokens.find(
    (t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation')
  );

  const links = [
    {
      href: '/doctor',
      label: 'Doctor',
      fullLabel: 'Doctor Portal',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/doctor'),
    },
    {
      href: '/staff',
      label: 'Staff',
      fullLabel: 'Staff & Desk',
      icon: <Users2 className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/staff'),
    },
    {
      href: '/patient',
      label: 'Patient',
      fullLabel: 'Patient App',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/patient'),
    },
    {
      href: '/tv',
      label: 'TV Screen',
      fullLabel: 'Waiting TV',
      icon: <Tv2 className="w-3.5 h-3.5" />,
      active: pathname === '/tv',
      target: '_blank',
    },
  ];

  return (
    <div className="bg-[#0A2227] text-white border-b border-[#1C4E57] text-xs py-1.5 px-3 sm:px-4 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Navigation items */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-teal-100 hover:text-white hover:bg-white/10 transition-colors font-medium text-[11px] sm:text-xs"
            title="Return to Clinova Demo Hub"
          >
            <Home className="w-3.5 h-3.5 text-[#35A99A]" />
            <span className="hidden xs:inline">Hub</span>
          </Link>

          <span className="text-white/20">|</span>

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.target}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-[11px] sm:text-xs whitespace-nowrap ${
                  link.active
                    ? 'bg-[#1C7774] text-white font-bold shadow-xs'
                    : 'text-teal-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span className="inline sm:hidden">{link.label}</span>
                <span className="hidden sm:inline">{link.fullLabel}</span>
                {link.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35A99A] animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side: Current Serving & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          {currentServing && (
            <div className="hidden lg:flex items-center gap-1.5 bg-[#123C45] px-2 py-0.5 rounded-md border border-[#35A99A]/30 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35A99A] animate-ping" />
              <span className="text-white/70">Serving:</span>
              <span className="font-bold text-[#35A99A]">{currentServing.tokenNumber}</span>
            </div>
          )}

          {showConfirmReset ? (
            <div className="flex items-center gap-1 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/40 text-[10px]">
              <span>Reset all?</span>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowConfirmReset(false);
                }}
                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1 px-2 py-1 rounded text-teal-200/70 hover:text-white hover:bg-white/10 transition-colors text-[11px]"
              title="Reset state to initial realistic mock data"
            >
              <RotateCcw className="w-3 h-3 text-[#35A99A]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
