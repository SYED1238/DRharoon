'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'token' | 'appointment' | 'payment' | 'patient' | 'general';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, type = 'general', size = 'sm' }: StatusBadgeProps) {
  const norm = status.toLowerCase();

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  let dotColor = 'bg-gray-400';

  if (
    norm === 'completed' ||
    norm === 'paid' ||
    norm === 'active' ||
    norm === 'confirmed'
  ) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotColor = 'bg-emerald-600';
  } else if (
    norm === 'waiting' ||
    norm === 'scheduled' ||
    norm === 'sample collected' ||
    norm === 'pending'
  ) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500 animate-pulse';
  } else if (
    norm === 'called' ||
    norm === 'in-consultation' ||
    norm === 'in-progress' ||
    norm === 'under treatment'
  ) {
    colorClasses = 'bg-teal-50 text-[#123C45] border-teal-300 font-semibold';
    dotColor = 'bg-[#35A99A] animate-ping';
  } else if (
    norm === 'cancelled' ||
    norm === 'skipped' ||
    norm === 'no-show' ||
    norm === 'inactive'
  ) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
    dotColor = 'bg-rose-500';
  } else if (norm === 'partially paid' || norm === 'follow-up due') {
    colorClasses = 'bg-orange-50 text-orange-800 border-orange-200/80';
    dotColor = 'bg-orange-500';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${padding} ${colorClasses} capitalize`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status.replace('-', ' ')}</span>
    </span>
  );
}
