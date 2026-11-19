'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Users,
  UserPlus,
  Ticket,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Volume2,
  ArrowRight,
  Tv2,
  Plus,
} from 'lucide-react';

export default function StaffDashboardPage() {
  const patients = useClinicStore((state) => state.patients);
  const tokens = useClinicStore((state) => state.tokens);
  const appointments = useClinicStore((state) => state.appointments);
  const invoices = useClinicStore((state) => state.invoices);
  const callToken = useClinicStore((state) => state.callToken);
  const completeToken = useClinicStore((state) => state.completeToken);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  // Stats computation
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const servingToken = tokens.find(
    (t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation')
  );
  const completedTokens = tokens.filter((t) => t.status === 'completed');
  const todayAppointments = appointments.filter((a) => a.date === '2026-11-19');

  const todayCollections = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const pendingCollections = invoices.reduce((sum, inv) => sum + inv.balance, 0);

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Registration Callout */}
      <div className="bg-gradient-to-r from-[#1C7774] via-[#165a58] to-[#123C45] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
              Reception Desk Active
            </span>
            <span className="text-teal-100 text-xs">Indiranagar Medical Clinic</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Front Desk Operations Center</h2>
          <p className="text-teal-100/80 text-xs mt-1 max-w-lg">
            Register arriving patients, issue OPD waiting queue tokens, handle patient inquiries, and record consultation payments.
          </p>
        </div>

        {/* Big Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/staff/register"
            className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-extrabold shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            <span>Register New Patient</span>
          </Link>

          <Link
            href="/staff/tokens"
            className="px-4 py-3.5 bg-white text-[#123C45] hover:bg-teal-50 rounded-xl text-sm font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <Ticket className="w-5 h-5 text-[#35A99A]" />
            <span>Generate Token</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Total Intake</span>
          <span className="text-xl font-extrabold text-[#123C45] block">{tokens.length}</span>
          <span className="text-[10px] text-gray-500">Patients today</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">Waiting in OPD</span>
          <span className="text-xl font-extrabold text-amber-700 block">{waitingTokens.length}</span>
          <span className="text-[10px] text-amber-600">Est. ~{waitingTokens.length * 12} mins</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-teal-200 bg-teal-50/30 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#1C7774] block mb-1">Now Serving</span>
          <span className="text-xl font-mono font-extrabold text-[#123C45] block">
            {servingToken ? servingToken.tokenNumber : '--'}
          </span>
          <span className="text-[10px] text-teal-700 truncate block">
            {servingToken ? servingToken.patientName.split(' ')[0] : 'Idle'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">Completed</span>
          <span className="text-xl font-extrabold text-emerald-700 block">{completedTokens.length}</span>
          <span className="text-[10px] text-emerald-600">Consulted & billed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Appointments</span>
          <span className="text-xl font-extrabold text-[#123C45] block">{todayAppointments.length}</span>
          <span className="text-[10px] text-gray-500">Booked slots</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Collections</span>
          <span className="text-sm font-extrabold text-emerald-700 truncate block mt-1">
            {formatCurrency(todayCollections)}
          </span>
          <span className="text-[10px] text-rose-600">Due: {formatCurrency(pendingCollections)}</span>
        </div>
      </div>

      {/* Split Section: Real-time Waiting Queue & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waiting Queue List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#35A99A]" />
                Live OPD Waiting Queue (TV Display Sync)
              </h3>
              <p className="text-xs text-[#718286]">Patients seated in the waiting lounge</p>
            </div>
            <Link
              href="/staff/tokens"
              className="text-xs text-[#1C7774] font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage Full Queue ({tokens.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {waitingTokens.map((token, index) => (
              <div
                key={token.id}
                className="p-3.5 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] flex items-center justify-between gap-3 hover:border-teal-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#123C45] text-white flex items-center justify-center font-mono font-bold text-xs">
                    {token.tokenNumber}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#123C45] block">{token.patientName}</span>
                    <span className="text-[10px] text-[#718286]">
                      {token.patientAge}y • {token.patientGender} • {token.category} • In at {token.arrivalTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Pos #{index + 1}
                  </span>
                  <button
                    onClick={() => callToken(token.id)}
                    className="px-3 py-1.5 bg-[#1C7774] hover:bg-[#123C45] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Call to TV</span>
                  </button>
                </div>
              </div>
            ))}

            {waitingTokens.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                <p className="text-xs font-semibold">No patients currently waiting</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Cashier Billing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Cashier Invoices */}
          <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Recent Billing Invoices
                </h3>
                <p className="text-xs text-[#718286]">Front desk cashier collection log</p>
              </div>
              <Link href="/staff/billing" className="text-xs text-[#1C7774] font-bold hover:underline">
                New Invoice →
              </Link>
            </div>

            <div className="space-y-2.5">
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="p-3 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#123C45] block">{inv.patientName}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{inv.id} • {inv.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#172D32] block">{formatCurrency(inv.totalAmount)}</span>
                    <StatusBadge status={inv.paymentStatus} type="payment" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Room TV Quick Launcher */}
          <div className="bg-[#0A2227] text-white p-5 rounded-2xl border border-[#1C7774]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#35A99A]/20 flex items-center justify-center text-[#35A99A]">
                <Tv2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">OPD Waiting Room TV</h4>
                <p className="text-[11px] text-teal-200/70">Displaying in waiting hall</p>
              </div>
            </div>
            <Link
              href="/tv"
              target="_blank"
              className="px-3.5 py-2 bg-[#35A99A] hover:bg-[#2fa092] text-[#0A2227] rounded-xl text-xs font-black transition-colors"
            >
              Open TV Display
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
