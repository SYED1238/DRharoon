'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { Patient } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  User,
  Heart,
  FileText,
  Activity,
  Calendar,
  Phone,
  MapPin,
  Clock,
  X,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const patients = useClinicStore((state) => state.patients);
  const prescriptions = useClinicStore((state) => state.prescriptions);
  const labOrders = useClinicStore((state) => state.labOrders);
  const appointments = useClinicStore((state) => state.appointments);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'history' | 'prescriptions' | 'labs'>('overview');

  const filteredPatients = patients.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.chronicConditions.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Data for active patient profile drawer
  const patientPrescriptions = selectedPatient
    ? prescriptions.filter((rx) => rx.patientId === selectedPatient.id)
    : [];
  const patientLabOrders = selectedPatient
    ? labOrders.filter((l) => l.patientId === selectedPatient.id)
    : [];
  const patientAppointments = selectedPatient
    ? appointments.filter((a) => a.patientId === selectedPatient.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Patient Medical Records (EMR)</h2>
          <p className="text-xs text-[#718286]">Comprehensive health dossiers, historical vitals, and diagnosis tracking</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E5ECEA] text-xs font-bold text-[#123C45] shadow-2xs">
            {patients.length} Registered Patients
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by patient name, ID, phone number, or chronic condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] bg-[#F5F8F7] focus:outline-none"
          >
            <option value="all">All Patient Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Follow-up Due">Follow-up Due</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Chronic Conditions</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123C45]">{p.id}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setSelectedPatient(p);
                        setProfileTab('overview');
                      }}
                      className="font-bold text-[#123C45] hover:text-[#1C7774] text-left block"
                    >
                      {p.name}
                    </button>
                    <span className="text-[10px] text-gray-500">Blood Group: {p.bloodGroup}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    {p.age} yrs • {p.gender}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{p.phone}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.chronicConditions.length > 0 ? (
                        p.chronicConditions.map((cond, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] bg-teal-50 text-[#1C7774] font-medium border border-teal-200"
                          >
                            {cond}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">None reported</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">{p.lastVisit}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={p.status} type="patient" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedPatient(p);
                          setProfileTab('overview');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                      >
                        Profile
                      </button>
                      <Link
                        href={`/doctor/consultation?patientId=${p.id}`}
                        className="px-3 py-1 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white font-bold transition-colors"
                      >
                        Consult
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Patient Dossier Modal / Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#123C45] text-white p-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-white border border-white/20">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                  <p className="text-xs text-teal-200/80 mt-0.5">
                    {selectedPatient.id} • {selectedPatient.age} yrs • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/60 mt-1">
                    <span>Phone: {selectedPatient.phone}</span>
                    <span>•</span>
                    <span>Registered: {selectedPatient.registeredDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/doctor/consultation?patientId=${selectedPatient.id}`}
                  className="px-3 py-1.5 bg-[#35A99A] hover:bg-[#2fa092] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Start Consultation
                </Link>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Tab Navigation */}
            <div className="bg-[#FAFBFB] border-b border-[#E5ECEA] px-6 flex gap-2">
              <button
                onClick={() => setProfileTab('overview')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  profileTab === 'overview'
                    ? 'border-[#1C7774] text-[#123C45]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Overview & Vitals
              </button>
              <button
                onClick={() => setProfileTab('prescriptions')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  profileTab === 'prescriptions'
                    ? 'border-[#1C7774] text-[#123C45]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Prescriptions ({patientPrescriptions.length})
              </button>
              <button
                onClick={() => setProfileTab('labs')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  profileTab === 'labs'
                    ? 'border-[#1C7774] text-[#123C45]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Lab Orders ({patientLabOrders.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {profileTab === 'overview' && (
                <div className="space-y-4">
                  {/* Demographics and Address */}
                  <div className="grid grid-cols-2 gap-3 bg-[#F5F8F7] p-4 rounded-xl border border-[#E5ECEA]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Residential Address</span>
                      <span className="font-medium text-[#172D32]">{selectedPatient.address}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Emergency Contact</span>
                      <span className="font-medium text-[#172D32]">
                        {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relation}) - {selectedPatient.emergencyContact.phone}
                      </span>
                    </div>
                  </div>

                  {/* Vitals History Table */}
                  <div>
                    <h4 className="font-bold text-xs text-[#123C45] mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Historical Vitals Trend
                    </h4>
                    {selectedPatient.vitalsHistory.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-[#E5ECEA]">
                        <table className="w-full text-left">
                          <thead className="bg-[#FAFBFB] text-gray-500 text-[10px] uppercase font-bold">
                            <tr>
                              <th className="py-2 px-3">Date</th>
                              <th className="py-2 px-3">Blood Pressure</th>
                              <th className="py-2 px-3">Pulse</th>
                              <th className="py-2 px-3">Temp</th>
                              <th className="py-2 px-3">SpO2</th>
                              <th className="py-2 px-3">Weight</th>
                              <th className="py-2 px-3">BMI</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5ECEA]">
                            {selectedPatient.vitalsHistory.map((vit, idx) => (
                              <tr key={idx} className="hover:bg-[#FAFBFB]">
                                <td className="py-2 px-3 font-semibold text-[#123C45]">{vit.date}</td>
                                <td className="py-2 px-3 font-bold text-gray-800">{vit.bp} mmHg</td>
                                <td className="py-2 px-3 text-gray-700">{vit.heartRate} bpm</td>
                                <td className="py-2 px-3 text-gray-700">{vit.temp}°F</td>
                                <td className="py-2 px-3 text-gray-700">{vit.spo2}%</td>
                                <td className="py-2 px-3 text-gray-700">{vit.weight} kg</td>
                                <td className="py-2 px-3 font-bold text-[#1C7774]">{vit.bmi}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No historical vitals logged yet.</p>
                    )}
                  </div>
                </div>
              )}

              {profileTab === 'prescriptions' && (
                <div className="space-y-3">
                  {patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#123C45]">{rx.id} • {rx.date}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {rx.diagnosis}
                        </span>
                      </div>
                      <div className="text-gray-700 text-xs">
                        <strong>Medicines:</strong> {rx.medicines.map((m) => m.name).join(', ')}
                      </div>
                      {rx.generalAdvice && (
                        <p className="text-[11px] text-gray-500 italic">Advice: {rx.generalAdvice}</p>
                      )}
                    </div>
                  ))}
                  {patientPrescriptions.length === 0 && (
                    <p className="text-gray-400 text-center py-6">No previous prescriptions recorded.</p>
                  )}
                </div>
              )}

              {profileTab === 'labs' && (
                <div className="space-y-3">
                  {patientLabOrders.map((lab) => (
                    <div key={lab.id} className="p-4 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#123C45]">{lab.id} • {lab.testName}</span>
                        <StatusBadge status={lab.status} />
                      </div>
                      <p className="text-gray-600 text-xs">Ordered on {lab.orderDate} by {lab.orderedBy}</p>
                    </div>
                  ))}
                  {patientLabOrders.length === 0 && (
                    <p className="text-gray-400 text-center py-6">No laboratory orders recorded for this patient.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
