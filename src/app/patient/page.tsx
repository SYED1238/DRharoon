'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { Prescription } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PrescriptionPrintModal } from '@/components/prescription/PrescriptionPrintModal';
import {
  Calendar,
  FileText,
  FlaskConical,
  Heart,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Activity,
  Pill,
  Download,
  AlertCircle,
  Ticket,
} from 'lucide-react';

export default function PatientHomePage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const appointments = useClinicStore((state) => state.appointments);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const labOrders = useClinicStore((state) => state.labOrders);
  const tokens = useClinicStore((state) => state.tokens);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Active Patient
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Filtered only to this patient
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);
  const upcomingAppointment = myAppointments.find((a) => a.status !== 'completed' && a.status !== 'cancelled');

  const myPrescriptions = prescriptions.filter((rx) => rx.patientId === patient.id);
  const latestPrescription = myPrescriptions[0];

  const myLabOrders = labOrders.filter((l) => l.patientId === patient.id);
  const latestLab = myLabOrders[0];

  const myActiveToken = tokens.find(
    (t) => t.patientId === patient.id && (t.status === 'waiting' || t.status === 'called' || t.status === 'in-consultation')
  );
  const servingToken = tokens.find((t) => t.id === currentServingTokenId);

  const latestVitals = patient.vitalsHistory[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#123C45] via-[#164a55] to-[#1C7774] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#35A99A]/20 text-[#35A99A] border border-[#35A99A]/40">
              Verified Patient Health Space
            </span>
            <span className="text-white/60 text-xs">Patient ID: {patient.id}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hello, {patient.name}
          </h2>
          <p className="text-teal-100/80 text-xs sm:text-sm mt-1 max-w-lg">
            Welcome to your personal clinical portal. View your physician consultations, download digital prescriptions, and check lab reports.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/patient/appointments"
            className="px-4 py-2.5 bg-[#35A99A] hover:bg-[#2b9688] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {/* Live OPD Queue Alert if Patient holds a token today */}
      {myActiveToken && (
        <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-[#35A99A] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#123C45] text-[#35A99A] flex items-center justify-center font-mono font-black text-2xl border-2 border-[#35A99A] shadow-sm">
              {myActiveToken.tokenNumber}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#1C7774] block">Your OPD Waiting Token</span>
              <h3 className="text-base font-bold text-[#123C45]">
                {myActiveToken.status === 'called' ? 'YOUR TOKEN IS CALLED! Proceed to Room 1' : 'You are in queue for Dr. Haroon Rashid'}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Current Serving: <strong>{servingToken ? servingToken.tokenNumber : '--'}</strong> • Room: {myActiveToken.room}
              </p>
            </div>
          </div>

          <Link
            href="/tv"
            target="_blank"
            className="px-4 py-2 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>View Live Waiting Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Grid: Upcoming Appointment & Latest Rx */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Scheduled Appointment */}
        <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#35A99A]" />
                <h3 className="font-bold text-sm text-[#123C45]">Upcoming Appointment</h3>
              </div>
              <Link href="/patient/appointments" className="text-xs text-[#1C7774] font-bold hover:underline">
                View All
              </Link>
            </div>

            {upcomingAppointment ? (
              <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E5ECEA] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1C7774] uppercase block">
                      {upcomingAppointment.type}
                    </span>
                    <h4 className="text-base font-extrabold text-[#123C45] mt-0.5">
                      {upcomingAppointment.date} at {upcomingAppointment.time}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{upcomingAppointment.doctor}</p>
                  </div>
                  <StatusBadge status={upcomingAppointment.status} type="appointment" />
                </div>
                {upcomingAppointment.notes && (
                  <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-[#E5ECEA]">
                    <strong>Note:</strong> {upcomingAppointment.notes}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-[#FAFBFB] rounded-xl border border-dashed border-[#E5ECEA]">
                <Clock className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                <p className="text-xs font-semibold">No upcoming appointments booked</p>
                <Link
                  href="/patient/appointments"
                  className="text-xs text-[#1C7774] font-bold hover:underline mt-2 inline-block"
                >
                  Schedule an appointment now →
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E5ECEA] mt-4 flex items-center justify-between text-xs text-[#718286]">
            <span>Need to reschedule?</span>
            <Link href="/patient/appointments" className="text-[#1C7774] font-bold hover:underline">
              Manage Booking
            </Link>
          </div>
        </div>

        {/* Latest Digital Prescription */}
        <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#123C45]">Latest Medical Prescription</h3>
              </div>
              <Link href="/patient/prescriptions" className="text-xs text-[#1C7774] font-bold hover:underline">
                All Prescriptions ({myPrescriptions.length})
              </Link>
            </div>

            {latestPrescription ? (
              <div className="p-4 rounded-xl bg-[#FAFBFB] border border-[#E5ECEA] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-gray-400 font-bold block">
                      {latestPrescription.id} • {latestPrescription.date}
                    </span>
                    <h4 className="text-sm font-bold text-[#123C45] mt-0.5">
                      {latestPrescription.diagnosis}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Regimen
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Medications ({latestPrescription.medicines.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {latestPrescription.medicines.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-white border border-[#E5ECEA] font-medium">
                        {m.name} ({m.frequency})
                      </span>
                    ))}
                  </div>
                </div>

                {latestPrescription.followUpDate && (
                  <p className="text-[11px] text-[#1C7774] font-semibold">
                    Follow-up advised: {latestPrescription.followUpDate}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-[#FAFBFB] rounded-xl border border-dashed border-[#E5ECEA]">
                <FileText className="w-6 h-6 mx-auto text-gray-300 mb-1" />
                <p className="text-xs font-semibold">No prescriptions found on file</p>
              </div>
            )}
          </div>

          {latestPrescription && (
            <div className="pt-4 border-t border-[#E5ECEA] mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Digitally verified by Dr. Haroon</span>
              <button
                onClick={() => {
                  setSelectedRx(latestPrescription);
                  setPrintModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download A4 PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row: Recorded Health Vitals & Latest Lab Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vitals Summary Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#E5ECEA] pb-3">
            <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Latest Recorded Health Vitals
            </h3>
            <span className="text-xs text-gray-400">Date: {latestVitals ? latestVitals.date : patient.lastVisit}</span>
          </div>

          {latestVitals ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F5F8F7] border border-[#E5ECEA]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Blood Pressure</span>
                <span className="text-base font-extrabold text-[#123C45] block">{latestVitals.bp}</span>
                <span className="text-[10px] text-gray-400">mmHg</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8F7] border border-[#E5ECEA]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Heart Pulse</span>
                <span className="text-base font-extrabold text-[#123C45] block">{latestVitals.heartRate}</span>
                <span className="text-[10px] text-gray-400">bpm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8F7] border border-[#E5ECEA]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Body Temp</span>
                <span className="text-base font-extrabold text-[#123C45] block">{latestVitals.temp}°</span>
                <span className="text-[10px] text-gray-400">Fahrenheit</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F8F7] border border-[#E5ECEA]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">BMI Index</span>
                <span className="text-base font-extrabold text-[#1C7774] block">{latestVitals.bmi}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Optimal</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-4 text-center">No vitals on record yet.</p>
          )}
        </div>

        {/* Diagnostic Lab Report Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#35A99A]" />
                Recent Diagnostic Laboratory Test
              </h3>
              <Link href="/patient/laboratory" className="text-xs text-[#1C7774] font-bold hover:underline">
                View All
              </Link>
            </div>

            {latestLab ? (
              <div className="p-3.5 rounded-xl bg-[#FAFBFB] border border-[#E5ECEA] space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#123C45] text-xs block">{latestLab.testName}</span>
                    <span className="text-[10px] text-gray-500">Ordered by {latestLab.orderedBy} on {latestLab.orderDate}</span>
                  </div>
                  <StatusBadge status={latestLab.status} />
                </div>
                {latestLab.results && latestLab.results.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    {latestLab.results.slice(0, 2).map((res, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-gray-600">{res.parameter}:</span>
                        <span className={res.isAbnormal ? 'font-bold text-rose-600' : 'font-bold text-[#123C45]'}>
                          {res.value} {res.unit} {res.isAbnormal && '▲'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No lab tests ordered recently.</p>
            )}
          </div>

          <div className="pt-3 border-t border-[#E5ECEA] mt-4 text-right">
            <Link
              href="/patient/laboratory"
              className="text-xs text-[#1C7774] font-bold hover:underline"
            >
              Access Complete Lab History →
            </Link>
          </div>
        </div>
      </div>

      {/* Prescription Print Modal */}
      <PrescriptionPrintModal
        prescription={selectedRx}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
