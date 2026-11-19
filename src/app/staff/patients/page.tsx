'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Users, Search, Ticket, UserPlus, Phone, Calendar } from 'lucide-react';

export default function StaffPatientsDirectoryPage() {
  const patients = useClinicStore((state) => state.patients);
  const generateToken = useClinicStore((state) => state.generateToken);
  const [search, setSearch] = useState('');

  const filtered = patients.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.id.toLowerCase().includes(q);
  });

  const handleIssueToken = (patientId: string) => {
    generateToken({
      patientId,
      category: 'walk-in',
      room: 'Room 1',
      notes: 'Existing patient arrived at desk',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Patient Directory & Quick Intake</h2>
          <p className="text-xs text-[#718286]">Lookup existing patient files and issue queue tokens with one click</p>
        </div>

        <Link
          href="/staff/register"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#21865D] hover:bg-[#1a6e4c] text-white rounded-xl text-xs font-bold shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, contact phone, or patient ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123C45]">{p.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#172D32]">{p.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{p.age}y / {p.gender} • {p.bloodGroup}</td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">{p.phone}</td>
                  <td className="py-3.5 px-4 text-gray-600">{p.lastVisit}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={p.status} type="patient" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleIssueToken(p.id)}
                      className="px-3 py-1.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs ml-auto transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#35A99A]" />
                      <span>Issue Token</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
