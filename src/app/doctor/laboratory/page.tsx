'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { LabOrder, LabResultItem } from '@/types/clinic';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  FlaskConical,
  Search,
  Plus,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorLaboratoryPage() {
  const labOrders = useClinicStore((state) => state.labOrders);
  const patients = useClinicStore((state) => state.patients);
  const createLabOrder = useClinicStore((state) => state.createLabOrder);
  const addLabResults = useClinicStore((state) => state.addLabResults);
  const addToast = useClinicStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState<LabOrder | null>(null);
  const [addResultModalOpen, setAddResultModalOpen] = useState(false);
  const [targetOrderForResult, setTargetOrderForResult] = useState<LabOrder | null>(null);

  // New order form state
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [testName, setTestName] = useState('Comprehensive Diabetic & Lipid Profile');
  const [category, setCategory] = useState<LabOrder['category']>('Biochemistry');
  const [fastingRequired, setFastingRequired] = useState(true);
  const [orderNotes, setOrderNotes] = useState('Routine investigation');

  // Add mock results form state
  const [mockParam1, setMockParam1] = useState('Fasting Blood Glucose');
  const [mockVal1, setMockVal1] = useState('110');
  const [mockUnit1, setMockUnit1] = useState('mg/dL');
  const [mockRef1, setMockRef1] = useState('70 - 99');
  const [mockAbnormal1, setMockAbnormal1] = useState(true);

  const filteredOrders = labOrders.filter((o) => {
    if (activeTab === 'pending' && o.status === 'Completed') return false;
    if (activeTab === 'completed' && o.status !== 'Completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.patientName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.testName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === selectedPatientId);
    if (!p) return;

    createLabOrder({
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      patientGender: p.gender,
      testName,
      category,
      orderedBy: 'Dr. Haroon Rashid',
      fastingRequired,
      status: 'Sample Collected',
      notes: orderNotes,
    });

    setNewOrderModalOpen(false);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrderForResult) return;

    const results: LabResultItem[] = [
      {
        parameter: mockParam1,
        value: mockVal1,
        unit: mockUnit1,
        referenceRange: mockRef1,
        isAbnormal: mockAbnormal1,
      },
      {
        parameter: 'Serum Creatinine',
        value: '0.92',
        unit: 'mg/dL',
        referenceRange: '0.70 - 1.20',
        isAbnormal: false,
      },
    ];

    addLabResults(targetOrderForResult.id, results);
    setAddResultModalOpen(false);
    setTargetOrderForResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Clinical Pathology & Laboratory</h2>
          <p className="text-xs text-[#718286]">Diagnostic orders, automated analyzers, and verified result reports</p>
        </div>

        <button
          onClick={() => setNewOrderModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#35A99A]" />
          <span>Order Laboratory Test</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#F5F8F7] p-1 rounded-xl border border-[#E5ECEA]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-[#123C45] text-white' : 'text-[#718286] hover:text-[#123C45]'
            }`}
          >
            All Orders ({labOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pending' ? 'bg-[#123C45] text-white' : 'text-[#718286] hover:text-[#123C45]'
            }`}
          >
            In Progress / Pending
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'completed' ? 'bg-[#123C45] text-white' : 'text-[#718286] hover:text-[#123C45]'
            }`}
          >
            Completed Reports
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by test or patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Test Name & Category</th>
                <th className="py-3 px-4">Fasting</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#123C45] block">{o.id}</span>
                    <span className="text-[10px] text-gray-500">{o.orderDate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#172D32] block">{o.patientName}</span>
                    <span className="text-[10px] text-gray-500">
                      {o.patientAge}y / {o.patientGender}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#123C45] block">{o.testName}</span>
                    <span className="text-[10px] text-[#1C7774] font-medium">{o.category}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {o.fastingRequired ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        12h Fasting
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Not required</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {o.results && o.results.length > 0 ? (
                        <button
                          onClick={() => setSelectedLabReport(o)}
                          className="px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#1C7774] font-bold"
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setTargetOrderForResult(o);
                            setAddResultModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white font-bold"
                        >
                          Add Mock Results
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detailed Lab Report Modal */}
      {selectedLabReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#123C45]">Diagnostic Laboratory Report</h3>
                <p className="text-xs text-gray-500">Order ID: {selectedLabReport.id} • Completed {selectedLabReport.completionDate}</p>
              </div>
              <button
                onClick={() => setSelectedLabReport(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F5F8F7] p-3.5 rounded-xl border border-[#E5ECEA] grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Patient</span>
                <span className="font-bold text-[#123C45]">{selectedLabReport.patientName}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Investigation</span>
                <span className="font-bold text-[#1C7774]">{selectedLabReport.testName}</span>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="overflow-x-auto rounded-lg border border-[#E5ECEA]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#123C45] text-white">
                  <tr>
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Measured Result</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Biological Reference Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECEA]">
                  {selectedLabReport.results?.map((res, i) => (
                    <tr key={i} className={res.isAbnormal ? 'bg-rose-50/60 font-semibold' : ''}>
                      <td className="py-2.5 px-3 text-[#123C45]">{res.parameter}</td>
                      <td className="py-2.5 px-3">
                        <span className={res.isAbnormal ? 'text-rose-700 font-extrabold' : 'font-bold'}>
                          {res.value} {res.isAbnormal && '▲ (High)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{res.unit}</td>
                      <td className="py-2.5 px-3 text-gray-500">{res.referenceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedLabReport.notes && (
              <p className="text-xs text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <strong>Pathologist Notes:</strong> {selectedLabReport.notes}
              </p>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedLabReport(null)}
                className="px-4 py-2 bg-[#123C45] text-white rounded-xl text-xs font-bold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Mock Results Modal */}
      {addResultModalOpen && targetOrderForResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Enter Diagnostic Results</h3>
              <button
                onClick={() => setAddResultModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Parameter Name</label>
                <input
                  type="text"
                  value={mockParam1}
                  onChange={(e) => setMockParam1(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Value</label>
                  <input
                    type="text"
                    value={mockVal1}
                    onChange={(e) => setMockVal1(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Unit</label>
                  <input
                    type="text"
                    value={mockUnit1}
                    onChange={(e) => setMockUnit1(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Biological Reference Range</label>
                <input
                  type="text"
                  value={mockRef1}
                  onChange={(e) => setMockRef1(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="abnormalCheck"
                  checked={mockAbnormal1}
                  onChange={(e) => setMockAbnormal1(e.target.checked)}
                  className="rounded text-[#35A99A]"
                />
                <label htmlFor="abnormalCheck" className="font-bold text-rose-700 cursor-pointer">
                  Flag as Abnormal / Out-of-range Value
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1C7774] hover:bg-[#123C45] text-white font-bold rounded-xl"
                >
                  Save & Publish Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Lab Order Modal */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Create Lab Test Requisition</h3>
              <button
                onClick={() => setNewOrderModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Assign Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.gender}, {p.age}y
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Test Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LabOrder['category'])}
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Radiology">Radiology</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Fasting Required</label>
                  <select
                    value={fastingRequired ? 'yes' : 'no'}
                    onChange={(e) => setFastingRequired(e.target.value === 'yes')}
                    className="w-full p-2 rounded-lg border border-gray-300"
                  >
                    <option value="yes">Yes (10-12 hours)</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Clinical Indication / Notes</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#123C45] hover:bg-[#1C7774] text-white font-bold rounded-xl"
                >
                  Generate Lab Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
