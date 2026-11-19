'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { AppointmentType } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, Plus, Clock, User, CheckCircle, X } from 'lucide-react';

export default function PatientAppointmentsPage() {
  const selectedPatientId = useClinicStore((state) => state.selectedPatientId);
  const patients = useClinicStore((state) => state.patients);
  const appointments = useClinicStore((state) => state.appointments);
  const createAppointment = useClinicStore((state) => state.createAppointment);
  const settings = useClinicStore((state) => state.settings);
  const addToast = useClinicStore((state) => state.addToast);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [preferredDate, setPreferredDate] = useState('2026-11-21');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [consultType, setConsultType] = useState<AppointmentType>('General Consultation');
  const [reason, setReason] = useState('Routine physician review');

  const availableSlots = [
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:15 AM',
    '12:00 PM',
    '05:30 PM',
    '06:15 PM',
    '07:00 PM',
  ];

  const handleRequestBooking = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientGender: patient.gender,
      patientAge: patient.age,
      date: preferredDate,
      time: preferredTime,
      type: consultType,
      status: 'scheduled',
      doctor: settings.doctorName,
      notes: reason,
    });
    setBookModalOpen(false);
    addToast('Appointment request confirmed', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">My Consultations & Appointments</h2>
          <p className="text-xs text-[#718286]">View confirmed doctor appointments and schedule upcoming visits</p>
        </div>

        <button
          onClick={() => setBookModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#35A99A]" />
          <span>Request New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAppointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-2xl border border-[#E5ECEA] bg-white shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1C7774] uppercase tracking-wider block">
                    {apt.type}
                  </span>
                  <h3 className="font-extrabold text-base text-[#123C45] mt-0.5">
                    {apt.date} • {apt.time}
                  </h3>
                  <p className="text-xs text-gray-500">{apt.doctor}</p>
                </div>
                <StatusBadge status={apt.status} type="appointment" />
              </div>

              {apt.notes && (
                <p className="text-xs text-gray-600 bg-[#F5F8F7] p-2.5 rounded-lg border border-[#E5ECEA] mt-2">
                  <strong>Consultation Focus:</strong> {apt.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5ECEA] flex items-center justify-between text-xs text-gray-500">
              <span>Appointment ID: <strong className="font-mono">{apt.id}</strong></span>
              <span className="text-emerald-700 font-medium">Dr. Haroon's Medical Center</span>
            </div>
          </div>
        ))}

        {myAppointments.length === 0 && (
          <div className="md:col-span-2 p-12 bg-white rounded-2xl border border-[#E5ECEA] text-center text-gray-400">
            <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-xs">No appointments booked currently</p>
          </div>
        )}
      </div>

      {/* Request Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Schedule Doctor Consultation</h3>
              <button onClick={() => setBookModalOpen(false)} className="p-1 rounded text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestBooking} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Preferred Consultation Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1.5">Available Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setPreferredTime(slot)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                        preferredTime === slot
                          ? 'bg-[#123C45] text-white border-[#123C45]'
                          : 'bg-[#F5F8F7] text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Reason for Consultation</label>
                <select
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value as AppointmentType)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold text-[#1C7774]"
                >
                  <option value="General Consultation">General Consultation / Illness</option>
                  <option value="Follow-up">Follow-up Review</option>
                  <option value="Lab Review">Laboratory Reports Review</option>
                  <option value="Routine Checkup">Annual Health Checkup</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Symptoms or Special Requests</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Mild throat pain and fatigue"
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Appointment Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
