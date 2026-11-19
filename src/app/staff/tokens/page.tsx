'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinicStore } from '@/lib/store';
import { Token, TokenCategory, TokenStatus } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Ticket,
  Volume2,
  CheckCircle,
  XCircle,
  RotateCcw,
  SkipForward,
  UserX,
  Plus,
  Tv2,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Play,
  X,
} from 'lucide-react';

export default function StaffTokenManagementPage() {
  const tokens = useClinicStore((state) => state.tokens);
  const patients = useClinicStore((state) => state.patients);
  const settings = useClinicStore((state) => state.settings);
  const generateToken = useClinicStore((state) => state.generateToken);
  const callToken = useClinicStore((state) => state.callToken);
  const startConsultation = useClinicStore((state) => state.startConsultation);
  const completeToken = useClinicStore((state) => state.completeToken);
  const skipToken = useClinicStore((state) => state.skipToken);
  const recallToken = useClinicStore((state) => state.recallToken);
  const updateTokenStatus = useClinicStore((state) => state.updateTokenStatus);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Quick Generate Token Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [category, setCategory] = useState<TokenCategory>('walk-in');
  const [room, setRoom] = useState('Room 1');
  const [tokenNotes, setTokenNotes] = useState('General consultation');

  const currentlyServing = tokens.find(
    (t) => t.id === currentServingTokenId && (t.status === 'called' || t.status === 'in-consultation')
  );

  const filteredTokens = tokens.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.tokenNumber.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.patientPhone.includes(q)
      );
    }
    return true;
  });

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    generateToken({
      patientId: selectedPatientId,
      category,
      room,
      assignedDoctor: settings.doctorName,
      notes: tokenNotes,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Queue & Token Management Engine</h2>
          <p className="text-xs text-[#718286]">
            Real-time OPD queue controller synced with Waiting Room TV & Doctor Workstation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tv"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Tv2 className="w-3.5 h-3.5 text-[#35A99A]" />
            <span>Launch Waiting TV Display</span>
          </Link>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#35A99A]" />
            <span>Generate New Token</span>
          </button>
        </div>
      </div>

      {/* Currently Serving Banner */}
      <div className="bg-gradient-to-r from-[#123C45] to-[#1C7774] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-[#35A99A] flex items-center justify-center font-mono font-black text-2xl text-white shadow-inner">
            {currentlyServing ? currentlyServing.tokenNumber : '--'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35A99A] animate-ping" />
              <span className="text-xs uppercase font-bold tracking-wider text-teal-200">
                ACTIVE PATIENT IN CONSULTATION
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {currentlyServing ? currentlyServing.patientName : 'No Token Currently Called'}
            </h3>
            {currentlyServing && (
              <p className="text-xs text-teal-100/70">
                Assigned: {currentlyServing.assignedDoctor} • {currentlyServing.room} • Called at {currentlyServing.calledTime}
              </p>
            )}
          </div>
        </div>

        {currentlyServing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => recallToken(currentlyServing.id)}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Repeat TV voice announcement"
            >
              <Volume2 className="w-4 h-4 text-[#35A99A]" />
              <span>Recall on TV</span>
            </button>
            <button
              onClick={() => completeToken(currentlyServing.id)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by token number (e.g. A-101), patient name, or phone..."
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
            <option value="all">All Queue Statuses</option>
            <option value="waiting">Waiting</option>
            <option value="called">Called</option>
            <option value="in-consultation">In Consultation</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
            <option value="no-show">No Show</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] bg-[#F5F8F7] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="walk-in">Walk-in</option>
            <option value="appointment">Appointment</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient Name (Staff Only)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Arrival Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Room & Doctor</th>
                <th className="py-3 px-4 text-right">Queue Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filteredTokens.map((token) => (
                <tr key={token.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg font-mono font-black text-sm bg-teal-50 text-[#123C45] border border-teal-200">
                      {token.tokenNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#172D32] block">{token.patientName}</span>
                    <span className="text-[10px] text-gray-500">
                      {token.patientAge}y • {token.patientGender} • {token.patientPhone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-gray-700">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        token.category === 'priority'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : token.category === 'appointment'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {token.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium whitespace-nowrap">
                    {token.arrivalTime}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={token.status} type="token" />
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <span className="block font-medium text-gray-800">{token.room}</span>
                    <span className="text-[10px] text-gray-500">{token.assignedDoctor}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {token.status === 'waiting' && (
                        <button
                          onClick={() => callToken(token.id)}
                          className="px-2.5 py-1 bg-[#1C7774] hover:bg-[#123C45] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                          title="Call token on TV display with speech announcement"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Call TV</span>
                        </button>
                      )}

                      {token.status === 'called' && (
                        <>
                          <button
                            onClick={() => startConsultation(token.id)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                          >
                            In Consult
                          </button>
                          <button
                            onClick={() => recallToken(token.id)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                            title="Recall on speech"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </>
                      )}

                      {(token.status === 'waiting' || token.status === 'called') && (
                        <button
                          onClick={() => skipToken(token.id)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold"
                          title="Skip token"
                        >
                          Skip
                        </button>
                      )}

                      {(token.status === 'in-consultation' || token.status === 'called') && (
                        <button
                          onClick={() => completeToken(token.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Done
                        </button>
                      )}

                      {token.status === 'skipped' && (
                        <button
                          onClick={() => updateTokenStatus(token.id, 'waiting')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold"
                        >
                          Re-queue
                        </button>
                      )}

                      <button
                        onClick={() => updateTokenStatus(token.id, 'cancelled')}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded-lg"
                        title="Cancel token"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Generate Token Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Generate OPD Queue Token</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateToken} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#172D32] block mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#123C45]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.gender}, {p.age}y
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#172D32] block mb-1">Queue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TokenCategory)}
                    className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-semibold text-[#1C7774]"
                  >
                    <option value="walk-in">Walk-in (W-prefix)</option>
                    <option value="appointment">Appointment (A-prefix)</option>
                    <option value="priority">Priority (P-prefix)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#172D32] block mb-1">Consultation Room</label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-semibold"
                  >
                    <option value="Room 1">Room 1 (Dr. Haroon)</option>
                    <option value="Room 2">Room 2 (Triage / Vitals)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={tokenNotes}
                  onChange={(e) => setTokenNotes(e.target.value)}
                  placeholder="e.g. Fever checkup or follow-up"
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket className="w-4 h-4 text-[#35A99A]" />
                  <span>Issue Token & Broadcast to TV</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
