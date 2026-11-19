'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Prescription } from '@/types/clinic';
import { PrescriptionPrintModal } from '@/components/prescription/PrescriptionPrintModal';
import { Pill, Printer, Download, Calendar, ShieldCheck, FileText } from 'lucide-react';

export default function PatientPrescriptionsPage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const prescriptions = useClinicStore((state) => state.prescriptions);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const myPrescriptions = prescriptions.filter((rx) => rx.patientId === patient.id);

  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleOpenModal = (rx: Prescription) => {
    setSelectedRx(rx);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Prescriptions & Medication Plans</h2>
        <p className="text-xs text-[#718286]">View active medication schedules, dosage instructions, and download official A4 prescriptions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {myPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs hover:border-teal-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5ECEA] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#1C7774] block">{rx.id}</span>
                <h3 className="font-bold text-base text-[#123C45]">{rx.diagnosis}</h3>
                <span className="text-xs text-gray-500">Issued on {rx.date} by {rx.doctorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Digitally Verified
                </span>
                <button
                  onClick={() => handleOpenModal(rx)}
                  className="px-3.5 py-1.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View / Print A4</span>
                </button>
              </div>
            </div>

            {/* Medicines Detailed List */}
            <div className="overflow-x-auto rounded-xl border border-[#E5ECEA]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Timing</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECEA]">
                  {rx.medicines.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFBFB]">
                      <td className="py-2.5 px-3 font-bold text-[#123C45]">{m.name}</td>
                      <td className="py-2.5 px-3 text-gray-700">{m.dosage}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-[#1C7774] font-bold">
                          {m.frequency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">{m.timing}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#123C45]">{m.duration}</td>
                      <td className="py-2.5 px-3 text-gray-600">{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rx.generalAdvice && (
              <p className="text-xs text-gray-700 bg-[#F5F8F7] p-3 rounded-xl border border-[#E5ECEA]">
                <strong>General Advice & Instructions:</strong> {rx.generalAdvice}
              </p>
            )}
          </div>
        ))}

        {myPrescriptions.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-[#E5ECEA] text-center text-gray-400">
            <Pill className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-xs">No prescriptions on record</p>
          </div>
        )}
      </div>

      <PrescriptionPrintModal
        prescription={selectedRx}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
