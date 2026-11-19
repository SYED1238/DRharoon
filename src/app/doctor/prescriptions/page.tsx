'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { Prescription } from '@/types/clinic';
import { PrescriptionPrintModal } from '@/components/prescription/PrescriptionPrintModal';
import { WhatsAppShareModal } from '@/components/prescription/WhatsAppShareModal';
import {
  FileText,
  Search,
  Printer,
  Share2,
  Calendar,
  User,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(q) ||
      rx.id.toLowerCase().includes(q) ||
      rx.diagnosis.toLowerCase().includes(q) ||
      rx.medicines.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const handleOpenPrint = (rx: Prescription) => {
    setSelectedRx(rx);
    setPrintModalOpen(true);
  };

  const handleOpenWhatsApp = (rx: Prescription) => {
    setSelectedRx(rx);
    setWhatsappModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Prescriptions Registry</h2>
          <p className="text-xs text-[#718286]">View, print, and simulate WhatsApp dispatch of medical prescriptions</p>
        </div>

        <Link
          href="/doctor/consultation"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123C45] hover:bg-[#1C7774] text-white font-bold text-xs shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#35A99A]" />
          <span>New Consultation & Rx</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, Rx ID, diagnosis, or medicine name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>
      </div>

      {/* Prescriptions Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-[#E5ECEA] p-5 shadow-2xs hover:border-teal-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#1C7774] block">{rx.id}</span>
                  <h3 className="font-bold text-sm text-[#123C45]">{rx.patientName}</h3>
                  <span className="text-[11px] text-[#718286]">
                    {rx.patientAge}y • {rx.patientGender} • Phone: {rx.patientPhone}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium block">{rx.date}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200 mt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Signed
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-[#F5F8F7] p-3 rounded-xl border border-[#E5ECEA] mb-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#718286] block">Diagnosis</span>
                <span className="font-bold text-[#123C45] text-xs">{rx.diagnosis}</span>
              </div>

              {/* Medicines Summary */}
              <div className="text-xs space-y-1 mb-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Medications ({rx.medicines.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {rx.medicines.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-white border border-[#E5ECEA] font-medium text-gray-800"
                    >
                      {m.name} ({m.frequency})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#E5ECEA] flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 font-medium">
                {rx.followUpDate ? `Review on ${rx.followUpDate}` : 'SOS Review'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenWhatsApp(rx)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] text-xs font-bold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => handleOpenPrint(rx)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print A4</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-[#E5ECEA] text-center text-gray-400">
          <FileText className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="font-semibold text-xs">No prescriptions found</p>
        </div>
      )}

      {/* Modals */}
      <PrescriptionPrintModal
        prescription={selectedRx}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />

      <WhatsAppShareModal
        prescription={selectedRx}
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
      />
    </div>
  );
}
