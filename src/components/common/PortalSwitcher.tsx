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
  Check,
} from 'lucide-react';

export function PortalSwitcher() {
  const pathname = usePathname();
  const resetDemoData = useClinicStore((state) => state.resetDemoData);
  const tokens = useClinicStore((state) => state.tokens);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // If on TV display page, don't show the switcher bar to keep TV 100% immersive,
  // unless user hovers at the top or presses Esc
  if (pathname === '/tv') {
    return null;
  }

  const currentServing = tokens.find((t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation'));

  const links = [
    {
      href: '/doctor',
      label: 'Doctor Portal',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/doctor'),
      badge: 'Clinical',
    },
    {
      href: '/staff',
      label: 'Staff & Reception',
      icon: <Users2 className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/staff'),
      badge: 'Desk',
    },
    {
      href: '/patient',
      label: 'Patient Portal',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      active: pathname.startsWith('/patient'),
      badge: 'Patient App',
    },
    {
      href: '/tv',
      label: 'Live Waiting TV',
      icon: <Tv2 className="w-3.5 h-3.5" />,
      active: pathname === '/tv',
      badge: 'OPD Queue',
      target: '_blank',
    },
  ];

  return (
    <div className="bg-[#0F2E35] text-white border-b border-[#1C4E57] text-xs py-1.5 px-4 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Quick Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-teal-100 hover:text-white hover:bg-white/10 transition-colors font-medium"
            title="Return to Clinova Demo Hub"
          >
            <Home className="w-3.5 h-3.5 text-[#35A99A]" />
            <span className="hidden sm:inline">Hub</span>
          </Link>

          <span className="text-white/20">|</span>

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.target}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  link.active
                    ? 'bg-[#1C7774] text-white font-semibold shadow-xs'
                    : 'text-teal-100/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35A99A] animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Live Queue Status & Reset */}
        <div className="flex items-center gap-3">
          {currentServing ? (
            <div className="hidden md:flex items-center gap-2 bg-[#123C45] px-2.5 py-1 rounded-md border border-[#35A99A]/30">
              <span className="w-2 h-2 rounded-full bg-[#35A99A] animate-ping" />
              <span className="text-white/70">Now Serving:</span>
              <span className="font-bold text-[#35A99A]">{currentServing.tokenNumber}</span>
              <span className="text-white/80 truncate max-w-[120px]">
                ({currentServing.patientName.split(' ')[0]})
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 text-white/50">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Queue Ready</span>
            </div>
          )}

          {showConfirmReset ? (
            <div className="flex items-center gap-1.5 bg-rose-900/50 px-2 py-0.5 rounded border border-rose-500/40">
              <span className="text-[11px] text-rose-200">Reset all?</span>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowConfirmReset(false);
                }}
                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-1.5 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded text-[11px]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1 px-2 py-1 rounded text-teal-200/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset state to initial realistic mock data"
            >
              <RotateCcw className="w-3 h-3 text-[#35A99A]" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 text-[11px] bg-[#35A99A]/15 text-[#35A99A] px-2 py-0.5 rounded-full border border-[#35A99A]/30">
            <Sparkles className="w-3 h-3" />
            <span>Frontend-Only Prototype</span>
          </div>
        </div>
      </div>
    </div>
  );
}
