'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
  clickable?: boolean;
}

export function BrandLogo({
  size = 'md',
  theme = 'light',
  showSubtitle = true,
  clickable = true,
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
    xl: 'text-3xl font-extrabold tracking-tight',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs',
  };

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`relative ${iconSizes[size]} rounded-xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-gradient-to-br from-[#1C7774] to-[#123C45] text-white border border-[#35A99A]/30'
            : 'bg-gradient-to-br from-[#123C45] to-[#1C7774] text-white shadow-md'
        }`}
      >
        {/* Medical Cross / Pulse Icon SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/9 h-5/9 text-[#35A99A]"
        >
          <path d="M12 4v16m-8-8h16" />
          <circle cx="12" cy="12" r="3" fill="#35A99A" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`${textSizes[size]} font-sans ${
              isDark ? 'text-white' : 'text-[#123C45]'
            }`}
          >
            CLINOVA
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-[#35A99A]/15 text-[#1C7774] border border-[#35A99A]/20">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subSizes[size]} font-medium tracking-wide uppercase ${
              isDark ? 'text-white/60' : 'text-[#718286]'
            }`}
          >
            Clinic Management OS
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="group inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
