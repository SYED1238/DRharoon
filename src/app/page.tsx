'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/common/BrandLogo';
import { PortalSwitcher } from '@/components/common/PortalSwitcher';
import { ToastContainer } from '@/components/common/ToastContainer';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  Stethoscope,
  Users2,
  UserCheck,
  Tv2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Volume2,
  Clock,
  FileText,
  CreditCard,
  HeartPulse,
  Share2,
  ExternalLink,
} from 'lucide-react';

export default function DemoLauncherPage() {
  const settings = useClinicStore((state) => state.settings);
  const patients = useClinicStore((state) => state.patients);
  const tokens = useClinicStore((state) => state.tokens);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const invoices = useClinicStore((state) => state.invoices);
  const resetDemoData = useClinicStore((state) => state.resetDemoData);
  const callToken = useClinicStore((state) => state.callToken);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const servingToken = tokens.find((t) => t.id === currentServingTokenId);
  const totalCollections = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  // Walkthrough Simulator State
  const [activeStep, setActiveStep] = useState(1);

  const portalCards = [
    {
      title: 'Doctor Portal',
      subtitle: 'Physician Workstation & Clinical EMR',
      description:
        'Streamlined clinical workspace for patient consultations, ICD-aligned diagnosis, digital A4 prescription builder, vitals tracking, and simulated WhatsApp dispatch.',
      icon: <Stethoscope className="w-6 h-6 text-[#35A99A]" />,
      href: '/doctor',
      badge: 'Clinical Workstation',
      accentColor: 'from-[#123C45] to-[#1C7774]',
      features: [
        'Interactive Vitals Entry & Auto-BMI Calculator',
        'Digital A4 Prescription Generator with Signature',
        'WhatsApp Sharing Experience Simulation',
        'Direct "Call Next" TV Queue Trigger & Speech Audio',
      ],
      previewDetails: 'Dr. Haroon Rashid, MD • Room 1',
    },
    {
      title: 'Receptionist & Staff Portal',
      subtitle: 'Fast Front Desk Intake & Token Dispatch',
      description:
        'Zero-learning-curve reception interface for lightning-fast patient registration, automatic OPD queue token generation, cashier billing, and collection reconciliation.',
      icon: <Users2 className="w-6 h-6 text-emerald-400" />,
      href: '/staff',
      badge: 'Front Desk & Cashier',
      accentColor: 'from-[#1C7774] to-[#21865D]',
      features: [
        '5-Second Patient Registration with Auto-ID',
        'Advanced Queue Controller (Call, Skip, Recall, Done)',
        'Cashier Invoicing (Cash, UPI, Card, Discounts)',
        'Printable Tax Invoice & Receipt Generator',
      ],
      previewDetails: `${tokens.length} Tokens Issued Today • ${formatCurrency(totalCollections)} Collected`,
    },
    {
      title: 'Patient Health Portal',
      subtitle: 'Patient-Facing Mobile-Adapted Web App',
      description:
        'Welcoming, privacy-first interface adapted for mobile and desktop. Patients view active queue positions, download official prescriptions, and request appointment slots.',
      icon: <UserCheck className="w-6 h-6 text-teal-300" />,
      href: '/patient',
      badge: 'Patient Health Space',
      accentColor: 'from-[#16454F] to-[#123C45]',
      features: [
        'Live OPD Waiting Queue Alert & Position',
        'Full Prescription History with A4 PDF Preview',
        'Diagnostic Laboratory Reports with Abnormal Markers',
        'Live Patient Switcher to inspect all 30 mock cohorts',
      ],
      previewDetails: `Viewing as ${patients[0]?.name} (${patients[0]?.id})`,
    },
    {
      title: 'Live Clinic TV Display',
      subtitle: '1920x1080 Waiting Room Queue Screen',
      description:
        'Distraction-free, massive typography designed for large waiting-room screens. Features real-time token transitions, upcoming queue order, and multilingual speech announcements.',
      icon: <Tv2 className="w-6 h-6 text-[#35A99A]" />,
      href: '/tv',
      badge: 'Waiting Hall Display',
      accentColor: 'from-[#0A2227] to-[#0F353C]',
      target: '_blank',
      features: [
        'Massive High-Contrast Token Typography',
        'Speech Synthesis in English, Hindi & Kannada',
        'Strict Privacy Guarantee (No Medical Data Shown)',
        'Live Scrolling Announcement Ticker & Real-time Sync',
      ],
      previewDetails: `Currently Serving: ${servingToken ? servingToken.tokenNumber : 'A-104'} • Room 1`,
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: '1. Intake & Token Issue',
      portal: 'Staff Portal',
      description: 'Receptionist registers arriving patient and generates token (e.g. W-104 or A-103).',
      link: '/staff/register',
      actionLabel: 'Go to Register',
    },
    {
      step: 2,
      title: '2. TV Screen Updates & Calls',
      portal: 'Waiting TV Display',
      description: 'Token appears instantly on the TV. Doctor clicks "Call Next" and browser speech announces.',
      link: '/tv',
      actionLabel: 'View Waiting TV',
    },
    {
      step: 3,
      title: '3. Consultation & Vitals',
      portal: 'Doctor Workstation',
      description: 'Doctor enters BP, pulse, symptoms, diagnosis, and adds medicines from pharmacy formulary.',
      link: '/doctor/consultation',
      actionLabel: 'Open Consultation',
    },
    {
      step: 4,
      title: '4. Digital Rx & WhatsApp',
      portal: 'Doctor Workstation',
      description: 'Generates branded A4 prescription. Launches realistic WhatsApp share modal with PDF preview.',
      link: '/doctor/prescriptions',
      actionLabel: 'View Prescriptions',
    },
    {
      step: 5,
      title: '5. Cashier Billing & Patient Sync',
      portal: 'Staff & Patient Portals',
      description: 'Staff creates invoice (UPI/Cash/Card). Patient portal immediately reflects new Rx and vitals.',
      link: '/patient',
      actionLabel: 'Check Patient Portal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F7] text-[#172D32] flex flex-col font-sans">
      <PortalSwitcher />

      {/* Top Hero Brand Header */}
      <header className="bg-gradient-to-b from-white to-[#F5F8F7] border-b border-[#E5ECEA] pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#35A99A]/15 border border-[#35A99A]/30 text-[#123C45] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#35A99A]" />
            <span>Interactive Multi-Portal Clinic Demonstration</span>
          </div>

          <div className="flex justify-center">
            <BrandLogo size="xl" showSubtitle={false} clickable={false} />
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#123C45] leading-tight">
              Premium Healthcare Clinic Ecosystem
            </h1>
            <p className="text-sm sm:text-base text-[#718286] leading-relaxed">
              An integrated, production-grade frontend clinic management platform designed for Dr. Haroon's Medical Center. Seamlessly connecting doctors, reception staff, patients, and waiting room TV displays through reactive shared state.
            </p>
          </div>

          {/* Key Metric Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5ECEA] text-[#123C45] shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {patients.length} Seeded Patients
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5ECEA] text-[#123C45] shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {tokens.length} Queue Tokens
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5ECEA] text-[#123C45] shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {prescriptions.length} Digital Prescriptions
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E5ECEA] text-[#123C45] shadow-2xs flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#35A99A]" />
              Web Speech Synthesis (EN, HI, KN)
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Section 1: The 4 Connected Portals Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#1C7774] block">
                CORE SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-2xl font-bold text-[#123C45] tracking-tight">
                Four Connected Interfaces, One Unified Data Store
              </h2>
            </div>
            <span className="text-xs text-[#718286]">Click any portal to enter without login</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portalCards.map((portal) => (
              <div
                key={portal.title}
                className="bg-white rounded-3xl border border-[#E5ECEA] overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Visual Header */}
                  <div className={`p-6 bg-gradient-to-r ${portal.accentColor} text-white relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-md">
                        {portal.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                        {portal.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-white">{portal.title}</h3>
                    <p className="text-xs text-white/80 font-medium mt-0.5">{portal.subtitle}</p>

                    <div className="mt-3 inline-block px-2.5 py-1 rounded-lg bg-black/20 text-[11px] text-white/90 font-mono">
                      {portal.previewDetails}
                    </div>
                  </div>

                  {/* Body Features */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#718286] leading-relaxed">{portal.description}</p>

                    <div className="space-y-2 pt-2 border-t border-[#E5ECEA]">
                      {portal.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#172D32]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#35A99A] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={portal.href}
                    target={portal.target}
                    className="w-full py-3 px-4 rounded-xl bg-[#123C45] group-hover:bg-[#1C7774] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch {portal.title}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Complete Interactive Workflow Guide */}
        <section className="bg-white rounded-3xl border border-[#E5ECEA] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5ECEA] pb-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#1C7774] block">
                DEMONSTRATION WALKTHROUGH
              </span>
              <h3 className="text-lg font-bold text-[#123C45]">
                End-to-End Clinic Workflow Simulation
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#718286]">Try the real flow across portals:</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {workflowSteps.map((wf) => (
              <div
                key={wf.step}
                className="p-4 rounded-2xl bg-[#F5F8F7] border border-[#E5ECEA] flex flex-col justify-between space-y-3 hover:border-teal-300 transition-all"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#123C45] text-white">
                    {wf.portal}
                  </span>
                  <h4 className="font-bold text-xs text-[#123C45] mt-2">{wf.title}</h4>
                  <p className="text-[11px] text-[#718286] mt-1 leading-relaxed">{wf.description}</p>
                </div>
                <Link
                  href={wf.link}
                  className="text-xs font-bold text-[#1C7774] hover:text-[#123C45] flex items-center gap-1 pt-2 border-t border-gray-200"
                >
                  <span>{wf.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Reset Demo & Live Architecture Banner */}
        <section className="bg-[#FAFBFB] rounded-2xl border border-[#E5ECEA] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#1C7774] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#123C45]">Persistent Local Demonstration Mode</h4>
              <p className="text-[11px] text-gray-500">
                All records, tokens, prescriptions, and invoices persist in your browser via localStorage. Click anytime to restore initial state.
              </p>
            </div>
          </div>

          <button
            onClick={resetDemoData}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-[#E5ECEA] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#35A99A]" />
            <span>Reset Demo Data</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5ECEA] py-8 px-4 text-center text-xs text-[#718286]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" clickable={false} />
            <span className="text-gray-400">|</span>
            <span>Dr. Haroon's Medical Center • Bengaluru, Karnataka</span>
          </div>
          <p className="text-[11px]">
            Frontend Prototype • Built with Next.js App Router, Tailwind CSS, TypeScript & Zustand
          </p>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
