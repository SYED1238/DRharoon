'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, FileText, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

export default function DoctorReportsPage() {
  const patients = useClinicStore((state) => state.patients);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const invoices = useClinicStore((state) => state.invoices);

  const monthlyVolume = [
    { month: 'Jun', patients: 120, revenue: 84000 },
    { month: 'Jul', patients: 145, revenue: 101500 },
    { month: 'Aug', patients: 160, revenue: 112000 },
    { month: 'Sep', patients: 190, revenue: 133000 },
    { month: 'Oct', patients: 215, revenue: 150500 },
    { month: 'Nov', patients: 240, revenue: 168000 },
  ];

  const diseasePrevalence = [
    { disease: 'Type 2 Diabetes', count: 18, color: '#123C45' },
    { disease: 'Essential Hypertension', count: 15, color: '#1C7774' },
    { disease: 'Dyslipidemia', count: 11, color: '#35A99A' },
    { disease: 'GERD & Acidity', count: 9, color: '#718286' },
    { disease: 'Bronchial Asthma', count: 6, color: '#D99A37' },
  ];

  const totalPatients = patients.length;
  const totalPrescriptions = prescriptions.length;
  const totalCollections = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Clinical & Operational Intelligence</h2>
        <p className="text-xs text-[#718286]">Monthly consultation metrics, epidemiology, and patient outcomes</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-xs font-bold text-[#718286] uppercase block mb-1">Total Active Cohort</span>
          <span className="text-2xl font-extrabold text-[#123C45] block">{totalPatients} Patients</span>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">94% compliance rate</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-xs font-bold text-[#718286] uppercase block mb-1">Prescriptions Dispatched</span>
          <span className="text-2xl font-extrabold text-[#123C45] block">{totalPrescriptions} Records</span>
          <span className="text-xs text-teal-700 font-semibold mt-1 block">Digital A4 + WhatsApp verified</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-xs font-bold text-[#718286] uppercase block mb-1">Total OPD Collections</span>
          <span className="text-2xl font-extrabold text-[#123C45] block">{formatCurrency(totalCollections)}</span>
          <span className="text-xs text-blue-700 font-semibold mt-1 block">₹0 bad debt / zero discrepancy</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Patient Inflow Trend */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-[#123C45]">Monthly Consultation Growth (Last 6 Months)</h3>
            <span className="text-xs text-[#1C7774] font-bold">+28% growth QoQ</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#718286" fontSize={11} />
                <YAxis stroke="#718286" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#123C45', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="patients" stroke="#35A99A" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chronic Disease Burden */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <h3 className="font-bold text-sm text-[#123C45] mb-1">Primary Chronic Disease Cohorts</h3>
          <p className="text-xs text-[#718286] mb-4">Top diagnosed clinical conditions</p>

          <div className="space-y-3">
            {diseasePrevalence.map((item) => (
              <div key={item.disease} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#172D32]">{item.disease}</span>
                  <span className="font-semibold text-gray-500">{item.count} patients</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.count / 20) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
