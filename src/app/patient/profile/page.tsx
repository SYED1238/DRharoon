'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { User, Phone, MapPin, Heart, ShieldCheck, Mail, Calendar } from 'lucide-react';

export default function PatientProfilePage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const settings = useClinicStore((state) => state.settings);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Patient Personal Profile & Privacy</h2>
        <p className="text-xs text-[#718286]">Manage contact information, emergency representatives, and verified clinical demographics</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-5">
        <div className="flex items-center gap-4 border-b border-[#E5ECEA] pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123C45] to-[#1C7774] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#123C45]">{patient.name}</h3>
            <p className="text-xs text-gray-500">
              Patient ID: <span className="font-mono font-bold text-[#1C7774]">{patient.id}</span> • Registered on {patient.registeredDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Age & Gender</span>
            <span className="font-bold text-[#172D32] text-sm">{patient.age} years • {patient.gender}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Date of Birth</span>
            <span className="font-semibold text-gray-700">{patient.dob}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Contact Phone Number</span>
            <span className="font-bold text-[#123C45] text-sm">{patient.phone}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Blood Group</span>
            <span className="font-extrabold text-rose-700 text-sm">{patient.bloodGroup}</span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Residential Address</span>
            <span className="font-medium text-gray-800">{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
          Emergency Contact Representative
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F5F8F7] border border-[#E5ECEA]">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Name</span>
            <span className="font-bold text-[#123C45] text-sm">{patient.emergencyContact.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Relationship</span>
            <span className="font-semibold text-gray-700">{patient.emergencyContact.relation}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Emergency Phone</span>
            <span className="font-bold text-emerald-700">{patient.emergencyContact.phone}</span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#35A99A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#123C45] space-y-1">
          <h4 className="font-bold">Patient Confidentiality & Data Privacy</h4>
          <p className="text-gray-600 leading-relaxed">
            Your clinical consultations, diagnostic tests, and medication records are protected under clinical confidentiality standards. Only Dr. Haroon Rashid and authorized medical staff have access to your health dossier.
          </p>
        </div>
      </div>
    </div>
  );
}
