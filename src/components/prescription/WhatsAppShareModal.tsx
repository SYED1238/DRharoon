'use client';

import React, { useState } from 'react';
import { Prescription } from '@/types/clinic';
import { useClinicStore } from '@/lib/store';
import {
  MessageSquare,
  X,
  FileText,
  Send,
  ExternalLink,
  CheckCheck,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';

interface WhatsAppShareModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppShareModal({
  prescription,
  isOpen,
  onClose,
}: WhatsAppShareModalProps) {
  const settings = useClinicStore((state) => state.settings);
  const addToast = useClinicStore((state) => state.addToast);
  const [copied, setCopied] = useState(false);
  const [isSimulatedSent, setIsSimulatedSent] = useState(false);

  if (!isOpen || !prescription) return null;

  const cleanPhone = prescription.patientPhone.replace(/\s+/g, '').replace('+', '');
  const medicineSummary = prescription.medicines
    .map((m, i) => `${i + 1}. *${m.name}* (${m.dosage}) - ${m.frequency} [${m.timing}] for ${m.duration}`)
    .join('\n');

  const preparedMessage = `*Prescription Summary from ${settings.clinicName}*
----------------------------------------
*Patient:* ${prescription.patientName} (${prescription.patientAge}y/${prescription.patientGender})
*Rx Date:* ${prescription.date}
*Doctor:* ${prescription.doctorName} (${prescription.doctorQualification})

*Diagnosis:* ${prescription.diagnosis}

*Prescribed Medications:*
${medicineSummary}

${prescription.followUpDate ? `*Follow-up Date:* ${prescription.followUpDate}` : ''}
*Advice:* ${prescription.generalAdvice || 'Take medications on time and stay well hydrated.'}

Clinic Helpdesk: ${settings.phone}
_Note: Attached is your official digital prescription PDF._`;

  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(preparedMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(preparedMessage);
    setCopied(true);
    addToast('Message text copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    setIsSimulatedSent(true);
    addToast('Prescription dispatched to WhatsApp simulator queue', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#075E54] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">WhatsApp Prescription Dispatch</h3>
              <p className="text-[11px] text-white/80">Clinova Patient Communication Hub</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSimulatedSent(false);
              onClose();
            }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Transparency Disclaimer */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Frontend Demonstration Mode:</span>
              <p className="mt-0.5 text-amber-800">
                This is a realistic WhatsApp sharing interface simulation. No external WhatsApp Business API charges or actual messaging traffic are incurred.
              </p>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-[#F5F8F7] p-3.5 rounded-xl border border-[#E5ECEA] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#718286] block">Recipient Patient</span>
              <span className="font-bold text-[#123C45] text-sm">{prescription.patientName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#718286] block">Registered Phone</span>
              <span className="font-mono font-bold text-[#172D32] text-sm">{prescription.patientPhone}</span>
            </div>
          </div>

          {/* Message Preview in WhatsApp Bubble Style */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#172D32] uppercase tracking-wider">
                Prepared Message Preview
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-[#1C7774] hover:text-[#123C45] font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="bg-[#ECE5DD] p-4 rounded-xl border border-[#D1D7DB] text-xs font-sans text-[#111B21] max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              <div className="bg-[#DCF8C6] p-3.5 rounded-lg shadow-xs border border-[#C5E1A5] space-y-2">
                <div>{preparedMessage}</div>

                {/* PDF Simulation Attachment Chip */}
                <div className="mt-2 bg-white/90 p-2.5 rounded-md border border-gray-200 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 block truncate text-[11px]">
                      {prescription.id}_Prescription_{prescription.patientName.replace(/\s+/g, '_')}.pdf
                    </span>
                    <span className="text-[10px] text-gray-500">142 KB • Digitally Signed</span>
                  </div>
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>

                <div className="flex justify-end items-center gap-1 text-[10px] text-gray-500 pt-1">
                  <span>10:45 AM</span>
                  <CheckCheck className={`w-3.5 h-3.5 ${isSimulatedSent ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleSimulateSend}
              disabled={isSimulatedSent}
              className={`flex-1 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                isSimulatedSent
                  ? 'bg-emerald-700 cursor-default'
                  : 'bg-[#075E54] hover:bg-[#128C7E]'
              }`}
            >
              {isSimulatedSent ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  <span>Prescription Dispatched (Demo Sent)</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send via Simulation</span>
                </>
              )}
            </button>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white border border-[#25D366] text-[#075E54] hover:bg-[#25D366]/10 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Real WhatsApp (wa.me)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
