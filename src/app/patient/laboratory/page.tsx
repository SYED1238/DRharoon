'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { LabOrder } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import { FlaskConical, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PatientLaboratoryPage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const labOrders = useClinicStore((state) => state.labOrders);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const myLabs = labOrders.filter((l) => l.patientId === patient.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Diagnostic Test Reports</h2>
        <p className="text-xs text-[#718286]">View pathology findings, automated analyzer results, and reference ranges</p>
      </div>

      <div className="space-y-4">
        {myLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5ECEA] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#1C7774] block">{lab.id}</span>
                <h3 className="font-bold text-base text-[#123C45]">{lab.testName}</h3>
                <span className="text-xs text-gray-500">
                  Category: {lab.category} • Ordered on {lab.orderDate}
                </span>
              </div>
              <div>
                <StatusBadge status={lab.status} />
              </div>
            </div>

            {lab.results && lab.results.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#E5ECEA]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Your Result</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Standard Reference Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5ECEA]">
                    {lab.results.map((r, i) => (
                      <tr key={i} className={r.isAbnormal ? 'bg-rose-50/50 font-semibold' : 'hover:bg-[#FAFBFB]'}>
                        <td className="py-2.5 px-3 text-[#123C45] font-medium">{r.parameter}</td>
                        <td className="py-2.5 px-3">
                          <span className={r.isAbnormal ? 'text-rose-700 font-extrabold' : 'font-bold text-emerald-800'}>
                            {r.value} {r.isAbnormal && '▲ (Out of range)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{r.unit}</td>
                        <td className="py-2.5 px-3 text-gray-500">{r.referenceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-[#F5F8F7] rounded-xl text-xs text-gray-600">
                Sample collected and currently processing in analyzer. Results will appear once verified by Dr. Haroon.
              </div>
            )}

            {lab.notes && (
              <p className="text-xs text-gray-600 italic bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <strong>Doctor's Pathology Note:</strong> {lab.notes}
              </p>
            )}
          </div>
        ))}

        {myLabs.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-[#E5ECEA] text-center text-gray-400">
            <FlaskConical className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-xs">No laboratory test records on file</p>
          </div>
        )}
      </div>
    </div>
  );
}
