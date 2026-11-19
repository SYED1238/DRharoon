'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FlaskConical, Search, CheckCircle, Clock } from 'lucide-react';

export default function StaffLaboratoryPage() {
  const labOrders = useClinicStore((state) => state.labOrders);
  const updateLabStatus = useClinicStore((state) => state.updateLabStatus);
  const [search, setSearch] = useState('');

  const filtered = labOrders.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return l.patientName.toLowerCase().includes(q) || l.testName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Laboratory Desk & Sample Intake</h2>
        <p className="text-xs text-[#718286]">Manage vacutainer collection, barcode labeling, and analyzer dispatch</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search lab requisitions by patient or test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Sample ID & Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Test Profile</th>
                <th className="py-3 px-4">Fasting Protocol</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Phlebotomy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAFBFB]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123C45]">
                    {order.id}
                    <span className="text-[10px] text-gray-400 block font-normal">{order.orderDate}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#172D32]">
                    {order.patientName}
                    <span className="text-[10px] text-gray-500 block">{order.patientAge}y / {order.patientGender}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#123C45] block">{order.testName}</span>
                    <span className="text-[10px] text-gray-500">{order.category}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {order.fastingRequired ? (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                        12h Fasting
                      </span>
                    ) : (
                      <span className="text-gray-400">Random</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.status !== 'Completed' && (
                      <button
                        onClick={() => updateLabStatus(order.id, 'In Progress')}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-[#1C7774] rounded-lg text-xs font-bold border border-teal-200"
                      >
                        Sample Drawn
                      </button>
                    )}
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
