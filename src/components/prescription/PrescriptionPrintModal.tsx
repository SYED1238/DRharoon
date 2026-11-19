'use client';

import React from 'react';
import { Prescription } from '@/types/clinic';
import { useClinicStore } from '@/lib/store';
import { Printer, X, Download, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

interface PrescriptionPrintModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrescriptionPrintModal({
  prescription,
  isOpen,
  onClose,
}: PrescriptionPrintModalProps) {
  const settings = useClinicStore((state) => state.settings);

  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Action Bar */}
        <div className="bg-[#123C45] text-white px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#35A99A]/20 border border-[#35A99A]/40 flex items-center justify-center text-[#35A99A]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Official Medical Prescription (Rx)</h3>
              <p className="text-xs text-white/70">ID: {prescription.id} • {prescription.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#35A99A] hover:bg-[#2e9688] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription A4 Canvas */}
        <div id="printable-content" className="p-8 md:p-12 bg-white text-[#172D32] max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b-2 border-[#123C45] pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Clinic Branding */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#123C45] text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 text-[#35A99A]">
                    <path d="M12 4v16m-8-8h16" />
                    <circle cx="12" cy="12" r="3.5" fill="#35A99A" stroke="none" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#123C45] tracking-tight">{settings.clinicName}</h1>
                  <p className="text-xs text-[#1C7774] font-medium">{settings.tagline}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-[#718286]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#35A99A]" /> {settings.address}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#35A99A]" /> {settings.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#35A99A]" /> {settings.email}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="md:text-right border-l-2 md:border-l-0 pl-3 md:pl-0 border-[#35A99A]/30">
                <h2 className="text-base font-bold text-[#123C45]">{prescription.doctorName}</h2>
                <p className="text-xs text-[#1C7774] font-medium">{prescription.doctorQualification}</p>
                <p className="text-[11px] text-[#718286] mt-0.5">Reg. No: <span className="font-semibold text-gray-800">{prescription.doctorRegNo}</span></p>
                <p className="text-[10px] text-[#718286] uppercase tracking-wider mt-1">{settings.workingHours}</p>
              </div>
            </div>
          </div>

          {/* Patient Details Ribbon */}
          <div className="bg-[#F5F8F7] rounded-xl p-4 border border-[#E5ECEA] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-6">
            <div>
              <span className="text-[#718286] block text-[10px] uppercase font-semibold">Patient Name</span>
              <span className="font-bold text-[#123C45] text-sm">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-[#718286] block text-[10px] uppercase font-semibold">Patient ID / Age / Gender</span>
              <span className="font-medium text-[#172D32]">
                {prescription.patientId} • {prescription.patientAge}y / {prescription.patientGender}
              </span>
            </div>
            <div>
              <span className="text-[#718286] block text-[10px] uppercase font-semibold">Contact</span>
              <span className="font-medium text-[#172D32]">{prescription.patientPhone}</span>
            </div>
            <div>
              <span className="text-[#718286] block text-[10px] uppercase font-semibold">Date & Prescription No.</span>
              <span className="font-bold text-[#123C45]">{prescription.date} • {prescription.id}</span>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          {prescription.vitals && (
            <div className="mb-6 pb-4 border-b border-[#E5ECEA]">
              <span className="text-[10px] uppercase font-bold text-[#1C7774] tracking-wider block mb-2">Recorded Vitals</span>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="px-2.5 py-1 rounded-md bg-white border border-[#E5ECEA]">
                  <span className="text-gray-500">BP: </span>
                  <span className="font-bold text-[#123C45]">{prescription.vitals.bp || '120/80'} mmHg</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white border border-[#E5ECEA]">
                  <span className="text-gray-500">Pulse: </span>
                  <span className="font-bold text-[#123C45]">{prescription.vitals.heartRate || 72} bpm</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white border border-[#E5ECEA]">
                  <span className="text-gray-500">Temp: </span>
                  <span className="font-bold text-[#123C45]">{prescription.vitals.temp || 98.4}°F</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white border border-[#E5ECEA]">
                  <span className="text-gray-500">SpO2: </span>
                  <span className="font-bold text-[#123C45]">{prescription.vitals.spo2 || 99}%</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-white border border-[#E5ECEA]">
                  <span className="text-gray-500">BMI: </span>
                  <span className="font-bold text-[#123C45]">{prescription.vitals.bmi || '22.4'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Findings & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#FAFBFB] p-3.5 rounded-lg border border-[#E5ECEA]">
              <span className="text-[10px] uppercase font-bold text-[#718286] tracking-wider block mb-1">Chief Complaint & Symptoms</span>
              <p className="text-xs text-[#172D32] leading-relaxed">{prescription.chiefComplaint}</p>
              {prescription.symptoms && prescription.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {prescription.symptoms.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-teal-50 text-teal-800 border border-teal-200">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200/60">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">Clinical Diagnosis</span>
              <p className="text-sm font-bold text-[#123C45]">{prescription.diagnosis}</p>
              {prescription.treatmentPlan && (
                <p className="text-xs text-gray-700 mt-1 italic">{prescription.treatmentPlan}</p>
              )}
            </div>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-serif font-black text-[#123C45] italic">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C7774]">Prescribed Medications</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#E5ECEA]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#123C45] text-white">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Medicine Name & Generic</th>
                    <th className="py-2.5 px-3 font-semibold">Dosage</th>
                    <th className="py-2.5 px-3 font-semibold">Frequency (M-A-N)</th>
                    <th className="py-2.5 px-3 font-semibold">Timing</th>
                    <th className="py-2.5 px-3 font-semibold">Duration</th>
                    <th className="py-2.5 px-3 font-semibold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECEA]">
                  {prescription.medicines.map((med, idx) => (
                    <tr key={med.id || idx} className="hover:bg-[#FAFBFB]">
                      <td className="py-2.5 px-3 font-medium text-gray-500">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#123C45] block">{med.name}</span>
                        {med.genericName && (
                          <span className="text-[10px] text-gray-500 italic block">{med.genericName}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-700">{med.dosage}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-[#1C7774] font-bold border border-teal-200">
                          {med.frequency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-700">{med.timing}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#123C45]">{med.duration}</td>
                      <td className="py-2.5 px-3 text-gray-600">{med.instructions || 'As advised'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice & Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {prescription.labTestsAdvised && prescription.labTestsAdvised.length > 0 && (
              <div className="p-3.5 rounded-lg border border-[#E5ECEA] bg-[#FAFBFB]">
                <span className="text-[10px] uppercase font-bold text-[#1C7774] tracking-wider block mb-1.5">Lab Investigations Advised</span>
                <ul className="list-disc list-inside text-xs text-[#172D32] space-y-1">
                  {prescription.labTestsAdvised.map((test, i) => (
                    <li key={i}>{test}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3.5 rounded-lg border border-[#E5ECEA] bg-[#FAFBFB]">
              <span className="text-[10px] uppercase font-bold text-[#1C7774] tracking-wider block mb-1.5">General Advice & Lifestyle</span>
              <p className="text-xs text-[#172D32] leading-relaxed">{prescription.generalAdvice || 'Rest adequately, maintain hydration, and take medications on scheduled time.'}</p>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="pt-6 border-t border-[#E5ECEA] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {prescription.followUpDate ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs">
                  <span className="text-[#1C7774] font-semibold">Recommended Follow-up:</span>
                  <span className="font-bold text-[#123C45]">{prescription.followUpDate}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">Follow-up as needed or in case of worsening symptoms.</span>
              )}
              <p className="text-[10px] text-gray-400 mt-2">
                * This is a digitally verified medical prescription generated through Clinova ClinicOS. Valid for pharmacy dispensing.
              </p>
            </div>

            {/* Doctor Signature Stamp */}
            <div className="text-center md:text-right">
              <div className="inline-block border-b-2 border-dashed border-[#123C45] pb-1 mb-1 px-4">
                <span className="font-serif italic text-lg text-[#123C45] block font-bold">Dr. Haroon Rashid</span>
                <span className="text-[9px] text-[#35A99A] uppercase tracking-wider block font-semibold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#35A99A]" /> Digitally Authenticated
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#123C45]">{prescription.doctorName}</p>
              <p className="text-[10px] text-gray-500">Reg. #{prescription.doctorRegNo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
