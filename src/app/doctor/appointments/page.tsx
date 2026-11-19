'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Appointment, AppointmentStatus, AppointmentType } from '@/types/clinic';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  User,
  Plus,
  ChevronRight,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  X,
  Stethoscope,
} from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const appointments = useClinicStore((state) => state.appointments);
  const updateAppointmentStatus = useClinicStore((state) => state.updateAppointmentStatus);
  const rescheduleAppointment = useClinicStore((state) => state.rescheduleAppointment);
  const addToast = useClinicStore((state) => state.addToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');

  // Selected Appointment Drawer
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const todayStr = '2026-11-19';

  const filteredAppointments = appointments.filter((apt) => {
    // Tab filter
    if (activeTab === 'today' && apt.date !== todayStr) return false;
    if (activeTab === 'upcoming' && apt.date <= todayStr) return false;

    // Status filter
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && apt.type !== typeFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        apt.patientName.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q) ||
        apt.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRescheduleSubmit = () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) {
      addToast('Please provide both new date and time', 'warning');
      return;
    }
    rescheduleAppointment(selectedAppointment.id, rescheduleDate, rescheduleTime);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Appointment Scheduling</h2>
          <p className="text-xs text-[#718286]">Manage consultations, routine checkups, and scheduled follow-ups</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-xl border border-[#E5ECEA] flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'today' ? 'bg-[#123C45] text-white shadow-2xs' : 'text-[#718286] hover:text-[#123C45]'
              }`}
            >
              Today's Schedule
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upcoming' ? 'bg-[#123C45] text-white shadow-2xs' : 'text-[#718286] hover:text-[#123C45]'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-[#123C45] text-white shadow-2xs' : 'text-[#718286] hover:text-[#123C45]'
              }`}
            >
              All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] bg-[#F5F8F7] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] bg-[#F5F8F7] focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="General Consultation">General Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Lab Review">Lab Review</option>
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#123C45] block">{apt.time}</span>
                    <span className="text-[11px] text-gray-500">{apt.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#172D32] block">{apt.patientName}</span>
                    <span className="text-[10px] text-gray-500">
                      {apt.patientAge}y / {apt.patientGender} • {apt.patientPhone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1C7774]">{apt.type}</td>
                  <td className="py-3.5 px-4">
                    {apt.tokenNumber ? (
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-teal-50 text-[#123C45] border border-teal-200">
                        {apt.tokenNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={apt.status} type="appointment" />
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                    {apt.notes || 'None recorded'}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                      >
                        Details
                      </button>
                      <Link
                        href={`/doctor/consultation?patientId=${apt.patientId}`}
                        className="px-3 py-1 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white font-bold transition-colors"
                      >
                        Consult
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold">No appointments found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details & Reschedule Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F5F8F7] p-3.5 rounded-xl border border-[#E5ECEA] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Patient:</span>
                <span className="font-bold text-[#123C45]">{selectedAppointment.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-[#172D32]">{selectedAppointment.patientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Slot:</span>
                <span className="font-bold text-[#1C7774]">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <StatusBadge status={selectedAppointment.status} type="appointment" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{selectedAppointment.type}</span>
              </div>
            </div>

            {/* Reschedule Box */}
            <div className="border border-teal-200 bg-teal-50/40 p-3.5 rounded-xl space-y-2.5">
              <span className="font-bold text-xs text-[#123C45] block">Reschedule Consultation</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-0.5">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-0.5">New Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 02:30 PM"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>
              <button
                onClick={handleRescheduleSubmit}
                className="w-full py-1.5 bg-[#1C7774] hover:bg-[#123C45] text-white font-bold text-xs rounded-lg transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>

            {/* Quick Status Modifiers */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                  setSelectedAppointment(null);
                }}
                className="flex-1 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100"
              >
                Mark Confirmed
              </button>
              <button
                onClick={() => {
                  updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                  setSelectedAppointment(null);
                }}
                className="flex-1 py-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
