'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Award, Printer, X, ShieldCheck, FileCheck } from 'lucide-react';

export default function DoctorCertificatesPage() {
  const patients = useClinicStore((state) => state.patients);
  const settings = useClinicStore((state) => state.settings);
  const addToast = useClinicStore((state) => state.addToast);

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [certType, setCertType] = useState<'Medical Leave / Sickness' | 'Fitness Certificate' | 'Travel Clearance'>('Medical Leave / Sickness');
  const [startDate, setStartDate] = useState('2026-11-19');
  const [endDate, setEndDate] = useState('2026-11-23');
  const [diagnosis, setDiagnosis] = useState('Acute Viral Upper Respiratory Infection with Pyrexia');
  const [recommendation, setRecommendation] = useState('Complete physical bed rest and symptomatic medical management.');

  const [previewOpen, setPreviewOpen] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Medical Certificates & Clearances</h2>
        <p className="text-xs text-[#718286]">Generate signed medical fitness, sick leave, and occupational clearance certificates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Certificate Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#35A99A]" />
            Certificate Parameters
          </h3>

          <div className="text-xs space-y-3">
            <div>
              <label className="font-bold block mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-semibold text-[#123C45]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.gender}, {p.age}y
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Certificate Type</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-bold text-[#1C7774]"
              >
                <option value="Medical Leave / Sickness">Medical Leave / Sick Leave Certificate</option>
                <option value="Fitness Certificate">Physical Fitness / Duty Resumption Certificate</option>
                <option value="Travel Clearance">Fit to Fly / Travel Medical Clearance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Period From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#E5ECEA]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Period To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#E5ECEA]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Clinical Diagnosis / Reason</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Medical Recommendation</label>
              <textarea
                rows={3}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="w-full py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-[#35A99A]" />
                <span>Generate & Preview Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-6 bg-[#FAFBFB] p-6 rounded-2xl border-2 border-dashed border-[#1C7774]/40 flex flex-col justify-between">
          <div>
            <div className="text-center border-b border-[#E5ECEA] pb-4 mb-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Official Letterhead</span>
              <h4 className="font-bold text-base text-[#123C45]">{settings.clinicName}</h4>
              <p className="text-[11px] text-[#1C7774] font-medium">{settings.doctorName} • Reg. #{settings.doctorRegNo}</p>
            </div>

            <div className="text-center my-4">
              <span className="inline-block px-4 py-1 rounded-full bg-[#123C45] text-white font-serif font-bold text-xs tracking-wider uppercase">
                {certType}
              </span>
            </div>

            <div className="text-xs text-[#172D32] space-y-3 leading-relaxed">
              <p>
                This is to certify that <strong>{activePatient.name}</strong> ({activePatient.age}y / {activePatient.gender}), resident of <em>{activePatient.address}</em>, has been under my medical care.
              </p>
              <p>
                The patient was examined and diagnosed with: <strong className="text-[#123C45] underline">{diagnosis}</strong>.
              </p>
              <p>
                <strong>Physician Recommendation:</strong> {recommendation} The patient is advised rest from <strong>{startDate}</strong> to <strong>{endDate}</strong>.
              </p>
            </div>
          </div>

          <div className="border-t border-[#E5ECEA] pt-4 flex items-center justify-between mt-6">
            <div>
              <span className="text-[10px] text-gray-400 block">Date of Issue: {startDate}</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Digitally Authenticated
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif italic text-sm font-bold text-[#123C45] block">Dr. Haroon Rashid</span>
              <span className="text-[10px] text-gray-500">Consultant Physician</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <div className="flex justify-between items-center no-print">
              <span className="font-bold text-sm text-[#123C45]">Print Preview: {certType}</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-[#35A99A] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1 rounded text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div id="printable-content" className="border-2 border-[#123C45] p-8 rounded-xl bg-white text-center space-y-6">
              <div className="border-b-2 border-[#123C45] pb-4">
                <h1 className="text-xl font-bold text-[#123C45]">{settings.clinicName}</h1>
                <p className="text-xs text-[#1C7774]">{settings.tagline}</p>
                <p className="text-[11px] text-gray-500 mt-1">{settings.address} • Ph: {settings.phone}</p>
              </div>

              <div className="py-2">
                <h2 className="text-base font-bold uppercase tracking-widest text-[#123C45] underline">
                  {certType}
                </h2>
              </div>

              <div className="text-left text-xs leading-loose space-y-3">
                <p>
                  This is to certify that <strong>Mr./Ms. {activePatient.name}</strong>, aged <strong>{activePatient.age}</strong> years, {activePatient.gender}, was examined at this clinic on <strong>{startDate}</strong>.
                </p>
                <p>
                  <strong>Clinical Assessment:</strong> {diagnosis}
                </p>
                <p>
                  I consider that period of absence from duty / rest from <strong>{startDate}</strong> to <strong>{endDate}</strong> is necessary for restoration of health.
                </p>
                <p>
                  <strong>Medical Advice:</strong> {recommendation}
                </p>
              </div>

              <div className="pt-8 flex justify-between items-end text-xs text-left">
                <div>
                  <p>Date: {startDate}</p>
                  <p>Place: Bengaluru</p>
                </div>
                <div className="text-right">
                  <p className="font-serif italic font-bold text-sm text-[#123C45]">Dr. Haroon Rashid</p>
                  <p className="font-semibold">{settings.doctorQualification}</p>
                  <p className="text-[10px] text-gray-500">Reg. #{settings.doctorRegNo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
