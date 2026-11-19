'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { CalendarClock, AlertCircle, CheckCircle, Clock, Search, Phone, Calendar } from 'lucide-react';

export default function DoctorFollowUpsPage() {
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const patients = useClinicStore((state) => state.patients);
  const [filter, setFilter] = useState<'all' | 'due' | 'upcoming'>('all');
  const [search, setSearch] = useState('');

  const today = '2026-11-19';

  const followUpItems = prescriptions
    .filter((rx) => Boolean(rx.followUpDate))
    .map((rx) => {
      const isOverdue = (rx.followUpDate || '') < today;
      return {
        rxId: rx.id,
        patientId: rx.patientId,
        patientName: rx.patientName,
        phone: rx.patientPhone,
        diagnosis: rx.diagnosis,
        datePrescribed: rx.date,
        followUpDate: rx.followUpDate || '',
        isOverdue,
      };
    });

  const filtered = followUpItems.filter((item) => {
    if (filter === 'due' && !item.isOverdue) return false;
    if (filter === 'upcoming' && item.isOverdue) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.patientName.toLowerCase().includes(q) || item.diagnosis.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Clinical Follow-up Tracking</h2>
        <p className="text-xs text-[#718286]">Manage patient checkup recalls, chronic disease monitoring, and post-treatment progress</p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#F5F8F7] p-1 rounded-xl border border-[#E5ECEA]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'all' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            All Follow-ups ({followUpItems.length})
          </button>
          <button
            onClick={() => setFilter('due')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'due' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            Overdue Recalls
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'upcoming' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            Upcoming Scheduled
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Follow-up Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.rxId}
            className={`p-5 rounded-2xl border shadow-2xs bg-white flex flex-col justify-between ${
              item.isOverdue ? 'border-amber-300' : 'border-[#E5ECEA]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-400 font-bold">{item.rxId}</span>
                {item.isOverdue ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> Overdue
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" /> Scheduled
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-[#123C45]">{item.patientName}</h3>
              <p className="text-xs text-gray-600">Diagnosis: <strong>{item.diagnosis}</strong></p>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <p>Prescribed Date: {item.datePrescribed}</p>
                <p className="font-bold text-[#1C7774]">Due Date: {item.followUpDate}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5ECEA] mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {item.phone}
              </span>
              <Link
                href={`/doctor/consultation?patientId=${item.patientId}`}
                className="px-3 py-1 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-lg text-xs font-bold"
              >
                Consult
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
