'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Appointment, AppointmentType } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, Plus, Search, Clock, User, X } from 'lucide-react';

export default function StaffAppointmentsPage() {
  const appointments = useClinicStore((state) => state.appointments);
  const patients = useClinicStore((state) => state.patients);
  const createAppointment = useClinicStore((state) => state.createAppointment);
  const updateAppointmentStatus = useClinicStore((state) => state.updateAppointmentStatus);
  const settings = useClinicStore((state) => state.settings);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState<AppointmentType>('General Consultation');
  const [notes, setNotes] = useState('Scheduled via reception desk');

  const filtered = appointments.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.patientName.toLowerCase().includes(q) || a.patientPhone.includes(q) || a.id.toLowerCase().includes(q);
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === patientId);
    if (!p) return;

    createAppointment({
      patientId: p.id,
      patientName: p.name,
      patientPhone: p.phone,
      patientGender: p.gender,
      patientAge: p.age,
      date,
      time,
      type,
      status: 'confirmed',
      doctor: settings.doctorName,
      notes,
    });

    setBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Clinic Appointment Bookings</h2>
          <p className="text-xs text-[#718286]">Book consultations, confirm patient arrivals, and coordinate slots</p>
        </div>

        <button
          onClick={() => setBookModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#35A99A]" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or appointment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Physician</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#123C45] block">{apt.time}</span>
                    <span className="text-[10px] text-gray-500">{apt.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#172D32] block">{apt.patientName}</span>
                    <span className="text-[10px] text-gray-500">{apt.patientPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1C7774]">{apt.type}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={apt.status} type="appointment" />
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{apt.doctor}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold"
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Schedule Patient Appointment</h3>
              <button onClick={() => setBookModalOpen(false)} className="p-1 rounded text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full p-2 rounded-xl border border-gray-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Consultation Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AppointmentType)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold text-[#1C7774]"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Lab Review">Lab Review</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold rounded-xl"
                >
                  Confirm & Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
