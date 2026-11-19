'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { Settings, User, Building, Ticket, RotateCcw } from 'lucide-react';

export default function StaffSettingsPage() {
  const settings = useClinicStore((state) => state.settings);
  const resetDemoData = useClinicStore((state) => state.resetDemoData);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Staff & Reception Configuration</h2>
        <p className="text-xs text-[#718286]">Front desk preferences, default OPD tokens, and printer settings</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <User className="w-4 h-4 text-[#35A99A]" />
          Front Desk Staff Profile
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 font-bold block mb-1">Staff Member on Duty</span>
            <span className="font-bold text-[#123C45] text-sm block">Amina Sheikh</span>
            <span className="text-[11px] text-gray-500">Front Desk Supervisor</span>
          </div>
          <div>
            <span className="text-gray-500 font-bold block mb-1">Assigned Workstation</span>
            <span className="font-bold text-[#123C45] text-sm block">Desk 1 (Intake & Billing)</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Active Session</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#35A99A]" />
          Token & Waiting Display Settings
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <span className="font-bold text-[#123C45] block">Token Number Format</span>
            <span className="text-[11px] text-gray-600 block mt-1">Walk-in: <strong>W-100+</strong></span>
            <span className="text-[11px] text-gray-600 block">Appointment: <strong>A-100+</strong></span>
            <span className="text-[11px] text-gray-600 block">Priority: <strong>P-001+</strong></span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <span className="font-bold text-[#123C45] block">TV Waiting Hall Audio</span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">
              {settings.voiceEnabled ? 'Automated Voice Enabled' : 'Muted'}
            </span>
            <span className="text-[11px] text-gray-500 block">Language: {settings.activeVoiceLanguage.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 shadow-2xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-rose-900">Reset Demo State</h4>
          <p className="text-xs text-rose-700">Restore all patients, tokens, prescriptions, and invoices to initial demo data</p>
        </div>
        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
}
