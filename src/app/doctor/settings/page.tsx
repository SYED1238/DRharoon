'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Settings, Save, ShieldCheck, Volume2, Clock, DollarSign, Building } from 'lucide-react';

export default function DoctorSettingsPage() {
  const settings = useClinicStore((state) => state.settings);
  const updateSettings = useClinicStore((state) => state.updateSettings);
  const resetDemoData = useClinicStore((state) => state.resetDemoData);
  const addToast = useClinicStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    clinicName: settings.clinicName,
    doctorName: settings.doctorName,
    doctorQualification: settings.doctorQualification,
    doctorRegNo: settings.doctorRegNo,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    consultationFee: settings.consultationFee,
    followupFee: settings.followupFee,
    workingHours: settings.workingHours,
    voiceEnabled: settings.voiceEnabled,
    activeVoiceLanguage: settings.activeVoiceLanguage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      consultationFee: Number(formData.consultationFee),
      followupFee: Number(formData.followupFee),
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Clinic & Physician Settings</h2>
        <p className="text-xs text-[#718286]">Configure clinic metadata, consultation tariffs, TV speech synthesis, and doctor credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#35A99A]" />
            Physician Identity & Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#172D32] block mb-1">Doctor Full Name & Title</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#123C45]"
              />
            </div>

            <div>
              <label className="font-bold text-[#172D32] block mb-1">Medical Registration Number</label>
              <input
                type="text"
                value={formData.doctorRegNo}
                onChange={(e) => setFormData({ ...formData, doctorRegNo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-mono font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-[#172D32] block mb-1">Medical Qualifications & Degrees</label>
              <input
                type="text"
                value={formData.doctorQualification}
                onChange={(e) => setFormData({ ...formData, doctorQualification: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>
          </div>
        </div>

        {/* Clinic Details & Tariffs */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#35A99A]" />
            Clinic Infrastructure & OPD Fees
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#172D32] block mb-1">Clinic Brand Name</label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#172D32] block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-[#172D32] block mb-1">Clinic Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>

            <div>
              <label className="font-bold text-[#172D32] block mb-1">General Consultation Fee (₹)</label>
              <input
                type="number"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#123C45]"
              />
            </div>

            <div>
              <label className="font-bold text-[#172D32] block mb-1">Follow-up Consultation Fee (₹)</label>
              <input
                type="number"
                value={formData.followupFee}
                onChange={(e) => setFormData({ ...formData, followupFee: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#123C45]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-[#172D32] block mb-1">OPD Working Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
              />
            </div>
          </div>
        </div>

        {/* TV Voice Announcement Config */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#35A99A]" />
            Waiting Room TV Audio Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB]">
              <div>
                <span className="font-bold block">Automated Token Speech Call</span>
                <span className="text-[11px] text-gray-500">Announces tokens when called by doctor</span>
              </div>
              <input
                type="checkbox"
                checked={formData.voiceEnabled}
                onChange={(e) => setFormData({ ...formData, voiceEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#35A99A] cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-[#172D32] block mb-1">Broadcast Language</label>
              <select
                value={formData.activeVoiceLanguage}
                onChange={(e) => setFormData({ ...formData, activeVoiceLanguage: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#1C7774]"
              >
                <option value="en">English (Token number A104...)</option>
                <option value="hi">Hindi (टोकन संख्या...)</option>
                <option value="kn">Kannada (ಟೋಕನ್ ಸಂಖ್ಯೆ...)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetDemoData}
            className="px-4 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
          >
            Reset All Demo Mock Data
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#35A99A]" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
