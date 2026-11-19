'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Stethoscope,
  Volume2,
  Play,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Activity,
  DollarSign,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DoctorOverviewPage() {
  const patients = useClinicStore((state) => state.patients);
  const appointments = useClinicStore((state) => state.appointments);
  const tokens = useClinicStore((state) => state.tokens);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const invoices = useClinicStore((state) => state.invoices);
  const callToken = useClinicStore((state) => state.callToken);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  // Compute metrics
  const waitingTokens = tokens.filter((t) => t.status === 'waiting');
  const nextWaiting = waitingTokens[0];
  const currentlyServing = tokens.find(
    (t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation')
  );
  const completedTokensCount = tokens.filter((t) => t.status === 'completed').length;
  const todayAppointments = appointments.filter((a) => a.date === '2026-11-19');
  const todayRevenue = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);

  // Weekly Statistics Mock Data
  const weeklyData = [
    { day: 'Mon', consultations: 18, followUps: 8 },
    { day: 'Tue', consultations: 22, followUps: 11 },
    { day: 'Wed', consultations: 26, followUps: 14 },
    { day: 'Thu', consultations: 24, followUps: 9 },
    { day: 'Fri', consultations: 29, followUps: 16 },
    { day: 'Sat', consultations: 34, followUps: 18 },
  ];

  // Appointment Distribution Data
  const distributionData = [
    { name: 'Follow-ups', value: 38, color: '#1C7774' },
    { name: 'General Illness', value: 28, color: '#35A99A' },
    { name: 'Diabetic Care', value: 20, color: '#123C45' },
    { name: 'Cardiac / BP', value: 14, color: '#D99A37' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Call Next Hero */}
      <div className="bg-gradient-to-r from-[#123C45] via-[#16454F] to-[#1C7774] rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#35A99A]/20 text-[#35A99A] border border-[#35A99A]/40">
              Clinical Shift Live
            </span>
            <span className="text-white/60 text-xs">Room 1 • Morning Session</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, Dr. Haroon Rashid
          </h2>
          <p className="text-teal-100/80 text-xs mt-1 leading-relaxed">
            You have <strong className="text-white font-bold">{waitingTokens.length} patients</strong> waiting in the OPD queue today. Your average consultation turnaround is 14 minutes.
          </p>
        </div>

        {/* Quick Action Station */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {nextWaiting ? (
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-200/80 block">Next Patient</span>
                <span className="text-sm font-bold text-white block">
                  {nextWaiting.tokenNumber} • {nextWaiting.patientName}
                </span>
                <span className="text-[10px] text-white/60 block">{nextWaiting.patientAge}y / {nextWaiting.patientGender} • {nextWaiting.category}</span>
              </div>
              <button
                onClick={() => callToken(nextWaiting.id)}
                className="px-3.5 py-2 bg-[#35A99A] hover:bg-[#2b9688] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                title="Broadcasts token call to Waiting TV and announces via speech synthesis"
              >
                <Volume2 className="w-4 h-4" />
                <span>Call ({nextWaiting.tokenNumber})</span>
              </button>
            </div>
          ) : (
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs text-white/70">
              No patients waiting in queue
            </div>
          )}

          <Link
            href="/doctor/consultation"
            className="px-4 py-3 bg-white text-[#123C45] hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-[#123C45]" />
            <span>Open Consultation Desk</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#718286] uppercase tracking-wider">Today's Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1C7774] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#123C45]">{todayAppointments.length}</span>
            <span className="text-xs font-medium text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs yesterday
            </span>
          </div>
          <p className="text-[11px] text-[#718286] mt-1">{completedTokensCount} patients completed so far</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#718286] uppercase tracking-wider">Patients in Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#123C45]">{waitingTokens.length}</span>
            <span className="text-xs font-medium text-amber-700">
              {currentlyServing ? `Now: ${currentlyServing.tokenNumber}` : 'Waiting next'}
            </span>
          </div>
          <p className="text-[11px] text-[#718286] mt-1">Estimated wait time: ~{waitingTokens.length * 12} mins</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#718286] uppercase tracking-wider">Prescriptions Issued</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#123C45]">{prescriptions.length}</span>
            <span className="text-xs font-medium text-emerald-700">Digital Rx</span>
          </div>
          <p className="text-[11px] text-[#718286] mt-1">100% digitally verified & WhatsApp-ready</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#718286] uppercase tracking-wider">Today's Collections</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#123C45]">{formatCurrency(todayRevenue)}</span>
            <span className="text-xs font-medium text-blue-700">Gross</span>
          </div>
          <p className="text-[11px] text-[#718286] mt-1">Consultation & diagnostics revenue</p>
        </div>
      </div>

      {/* Charts Section: Weekly Trends & Patient Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consultations Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-[#123C45]">Weekly Patient Consultation Volume</h3>
              <p className="text-xs text-[#718286]">New consultations vs scheduled follow-ups</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#123C45]" />
                <span className="text-[#718286]">New Consults</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#35A99A]" />
                <span className="text-[#718286]">Follow-ups</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#718286" fontSize={11} tickLine={false} />
                <YAxis stroke="#718286" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#123C45',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="consultations" fill="#123C45" radius={[4, 4, 0, 0]} />
                <Bar dataKey="followUps" fill="#35A99A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Specialty Distribution Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#123C45]">Clinical Caseload Mix</h3>
            <p className="text-xs text-[#718286]">Categorization of ongoing treatments</p>

            <div className="h-44 w-full my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#123C45',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#E5ECEA]">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#172D32] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#123C45]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Split Section: Today's Appointments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Appointments Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#123C45]">Today's Scheduled Consultations</h3>
              <p className="text-xs text-[#718286]">Real-time patient schedule</p>
            </div>
            <Link
              href="/doctor/appointments"
              className="text-xs text-[#1C7774] font-semibold hover:text-[#123C45] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F7] text-[#718286] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Time</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEA]">
                {todayAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAFBFB] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#123C45] whitespace-nowrap">{apt.time}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#172D32] block">{apt.patientName}</span>
                      <span className="text-[10px] text-gray-500">{apt.patientAge}y / {apt.patientGender}</span>
                    </td>
                    <td className="py-3 px-3 text-[#718286]">{apt.type}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={apt.status} type="appointment" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/doctor/consultation?patientId=${apt.patientId}`}
                        className="px-2.5 py-1 rounded-md bg-teal-50 text-[#1C7774] font-bold hover:bg-teal-100 transition-colors inline-block"
                      >
                        Consult
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Queue & Waiting Patients */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#123C45]">Live OPD Queue Order</h3>
                <p className="text-xs text-[#718286]">Synced with waiting room TV display</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#1C7774] border border-teal-200">
                {waitingTokens.length} in queue
              </span>
            </div>

            <div className="space-y-2.5">
              {waitingTokens.slice(0, 4).map((token, idx) => (
                <div
                  key={token.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    idx === 0
                      ? 'bg-teal-50/60 border-teal-300'
                      : 'bg-[#FAFBFB] border-[#E5ECEA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#123C45] text-white flex items-center justify-center font-mono font-bold text-xs">
                      {token.tokenNumber}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-[#123C45] block">{token.patientName}</span>
                      <span className="text-[10px] text-[#718286]">
                        {token.category} • Arrived {token.arrivalTime}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => callToken(token.id)}
                    className="px-2.5 py-1 bg-[#1C7774] hover:bg-[#123C45] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Call</span>
                  </button>
                </div>
              ))}

              {waitingTokens.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-semibold">No patients waiting in queue</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E5ECEA] flex items-center justify-between text-xs text-[#718286]">
            <span>Next token will be broadcast to TV</span>
            <Link href="/tv" target="_blank" className="text-[#1C7774] font-bold hover:underline">
              Preview TV View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
