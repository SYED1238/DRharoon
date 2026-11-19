'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { FileText, Heart, Activity, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function PatientRecordsPage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const addToast = useClinicStore((state) => state.addToast);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const myPrescriptions = prescriptions.filter((rx) => rx.patientId === patient.id);

  const handleDownloadSummary = () => {
    addToast('Electronic Health Summary prepared for download', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Electronic Medical Dossier (EMR)</h2>
          <p className="text-xs text-[#718286]">Your historical vitals, diagnosed conditions, and consultation summaries</p>
        </div>

        <button
          onClick={handleDownloadSummary}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Medical Summary</span>
        </button>
      </div>

      {/* Allergies and Chronic Conditions Ribbon */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#35A99A]" />
          Health Alerts & Chronic Conditions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200">
            <span className="font-bold text-rose-800 block mb-1">Documented Drug Allergies</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patient.allergies.map((alg, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-rose-900 border border-rose-300">
                  {alg}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200">
            <span className="font-bold text-[#1C7774] block mb-1">Ongoing Chronic Conditions</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {patient.chronicConditions.length > 0 ? (
                patient.chronicConditions.map((cond, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#123C45] border border-teal-300">
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No chronic medical conditions recorded.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vitals History */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-500" />
          Clinical Vitals Log
        </h3>

        {patient.vitalsHistory.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#E5ECEA]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Blood Pressure</th>
                  <th className="py-2.5 px-3">Pulse</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3">SpO2</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">BMI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEA]">
                {patient.vitalsHistory.map((vit, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFBFB]">
                    <td className="py-2.5 px-3 font-semibold text-[#123C45]">{vit.date}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-800">{vit.bp} mmHg</td>
                    <td className="py-2.5 px-3 text-gray-700">{vit.heartRate} bpm</td>
                    <td className="py-2.5 px-3 text-gray-700">{vit.temp}°F</td>
                    <td className="py-2.5 px-3 text-gray-700">{vit.spo2}%</td>
                    <td className="py-2.5 px-3 text-gray-700">{vit.weight} kg</td>
                    <td className="py-2.5 px-3 font-bold text-[#1C7774]">{vit.bmi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400">No vitals entries on record.</p>
        )}
      </div>

      {/* Consultations History */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#35A99A]" />
          Doctor Consultation Notes
        </h3>

        <div className="space-y-3">
          {myPrescriptions.map((rx) => (
            <div key={rx.id} className="p-4 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#123C45]">{rx.date} • {rx.doctorName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#1C7774] border border-teal-200">
                  {rx.id}
                </span>
              </div>
              <p className="text-gray-700"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
              <p className="text-gray-600"><strong>Chief Complaint:</strong> {rx.chiefComplaint}</p>
              {rx.treatmentPlan && (
                <p className="text-gray-500 italic"><strong>Treatment:</strong> {rx.treatmentPlan}</p>
              )}
            </div>
          ))}
          {myPrescriptions.length === 0 && (
            <p className="text-xs text-gray-400 py-3 text-center">No consultation notes recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
