'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useClinicStore } from '@/lib/store';
import { announceToken } from '@/lib/speech';
import {
  Play,
  RotateCcw,
  Stethoscope,
  Users2,
  UserCheck,
  Tv2,
  CheckCircle2,
  Volume2,
  Share2,
  Receipt,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function DemoInteractiveScenariosPage() {
  const settings = useClinicStore((state) => state.settings);
  const tokens = useClinicStore((state) => state.tokens);
  const patients = useClinicStore((state) => state.patients);
  const callToken = useClinicStore((state) => state.callToken);
  const resetDemoData = useClinicStore((state) => state.resetDemoData);
  const addToast = useClinicStore((state) => state.addToast);

  const handleTestAudio = () => {
    announceToken('A-104', "Dr. Haroon's Consultation Room", {
      lang: settings.activeVoiceLanguage,
    });
    addToast('Speech synthesis announced: Token A-104', 'info');
  };

  const scenarios = [
    {
      title: 'Scenario 1: Walk-in Patient & Immediate Queue Call',
      desc: 'Simulate a new patient arriving at the front desk, receiving token W-104, appearing instantly on the waiting room TV display, and being called into Room 1 with multilingual voice speech synthesis.',
      steps: [
        'Open Staff Portal (/staff/register) to register patient',
        'Check Live Waiting TV (/tv) in a split tab to observe real-time token list update',
        'Doctor clicks "Call Next" from Physician Workstation (/doctor)',
        'Speech synthesis sounds: "Token number W, one zero four, please proceed to Doctor Room"',
      ],
      primaryLink: '/staff/register',
      primaryLabel: 'Start Scenario 1',
    },
    {
      title: 'Scenario 2: Physician Consultation & WhatsApp Prescription',
      desc: 'Open patient Ahmed Khan in Consultation Workspace, review previous vitals, enter new blood pressure & pulse, add medicines from pharmacy formulary, and preview the WhatsApp message dispatch simulation.',
      steps: [
        'Open Doctor Consultation Desk (/doctor/consultation)',
        'Review auto-calculated BMI and select prescribed medications',
        'Click "Save & Generate Prescription" to see official A4 preview',
        'Click "Share via WhatsApp" to view formatted message and simulated PDF payload',
      ],
      primaryLink: '/doctor/consultation',
      primaryLabel: 'Start Scenario 2',
    },
    {
      title: 'Scenario 3: Cashier Billing & Multi-Mode Invoicing',
      desc: 'Receptionist handles checkout: bill consultation fees, laboratory investigation fees, apply concession discount, and generate an official printable tax invoice receipt with Cash/UPI/Card tracking.',
      steps: [
        'Navigate to Staff Cashier (/staff/billing)',
        'Click "Create New Invoice" and select patient',
        'Add items: Doctor Consultation (₹700) + Blood Chemistry (₹850)',
        'Mark payment as Paid via UPI or Card and print A4 receipt',
      ],
      primaryLink: '/staff/billing',
      primaryLabel: 'Start Scenario 3',
    },
    {
      title: 'Scenario 4: Patient Health Space & Records Verification',
      desc: 'Experience the patient-facing web app. Switch between different patients in the top dropdown (e.g. Ahmed Khan vs Fatima Zahra) to verify that each patient only sees their own mock appointments, vitals history, and prescriptions.',
      steps: [
        'Navigate to Patient Portal (/patient)',
        'Inspect the active OPD Queue banner if a token is active',
        'Switch patient identity in the top ribbon to view individual records',
        'Request an upcoming consultation slot via interactive booking modal',
      ],
      primaryLink: '/patient',
      primaryLabel: 'Start Scenario 4',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#172D32] flex flex-col font-sans">
      <PortalSwitcher />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5ECEA] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#35A99A]/15 text-[#1C7774]">
                Interactive Demo Suite
              </span>
              <span className="text-xs text-gray-500">Clinova ClinicOS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#123C45] tracking-tight">
              Guided Demonstration Scenarios
            </h1>
            <p className="text-xs sm:text-sm text-[#718286] mt-1">
              Explore how all four interfaces synchronize across consultations, tokens, TV announcements, and billing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTestAudio}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#1C7774] border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#35A99A]" />
              <span>Test Audio Speech</span>
            </button>

            <button
              onClick={resetDemoData}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-[#E5ECEA] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#35A99A]" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((sc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#E5ECEA] p-6 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#35A99A] block mb-1">
                  Guided Flow #{idx + 1}
                </span>
                <h3 className="text-base font-bold text-[#123C45]">{sc.title}</h3>
                <p className="text-xs text-[#718286] mt-1 leading-relaxed">{sc.desc}</p>

                <div className="mt-4 pt-3 border-t border-[#E5ECEA] space-y-1.5 text-xs text-[#172D32]">
                  <span className="font-bold text-[11px] text-gray-400 uppercase block">Walkthrough Checklist:</span>
                  {sc.steps.map((st, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-50 text-[#1C7774] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="text-[11px] text-gray-700">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={sc.primaryLink}
                  className="w-full py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <span>{sc.primaryLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
