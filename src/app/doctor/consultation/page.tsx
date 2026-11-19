'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinicStore } from '@/lib/store';
import { Patient, MedicineItem, Prescription } from '@/types/clinic';
import { calculateBMI, formatCurrency } from '@/lib/utils';
import { MOCK_MEDICINES_LIBRARY } from '@/lib/mockData';
import { PrescriptionPrintModal } from '@/components/prescription/PrescriptionPrintModal';
import { WhatsAppShareModal } from '@/components/prescription/WhatsAppShareModal';
import {
  Stethoscope,
  Plus,
  Trash2,
  Printer,
  Share2,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Scale,
  Sparkles,
  Calendar,
  Clock,
  User,
  FlaskConical,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

function DoctorConsultationContent() {
  const searchParams = useSearchParams();
  const requestedPatientId = searchParams.get('patientId');

  const patients = useClinicStore((state) => state.patients);
  const tokens = useClinicStore((state) => state.tokens);
  const settings = useClinicStore((state) => state.settings);
  const createPrescription = useClinicStore((state) => state.createPrescription);
  const completeToken = useClinicStore((state) => state.completeToken);
  const addToast = useClinicStore((state) => state.addToast);
  const currentServingTokenId = useClinicStore((state) => state.currentServingTokenId);

  // Selected Patient
  const initialPatient = requestedPatientId
    ? patients.find((p) => p.id === requestedPatientId) || patients[0]
    : tokens.find((t) => t.id === currentServingTokenId)
    ? patients.find((p) => p.id === tokens.find((t) => t.id === currentServingTokenId)?.patientId) || patients[0]
    : patients[0];

  const [selectedPatient, setSelectedPatient] = useState<Patient>(initialPatient);

  // Vitals State
  const latestVitals = selectedPatient.vitalsHistory[0] || {
    bp: '120/80',
    heartRate: 72,
    temp: 98.4,
    spo2: 99,
    weight: 70,
    height: 170,
    bmi: 24.2,
  };

  const [vitals, setVitals] = useState({
    bp: latestVitals.bp,
    heartRate: latestVitals.heartRate,
    temp: latestVitals.temp,
    spo2: latestVitals.spo2,
    weight: latestVitals.weight,
    height: latestVitals.height,
  });

  const bmiInfo = calculateBMI(vitals.weight, vitals.height);

  // Consultation Details State
  const [chiefComplaint, setChiefComplaint] = useState(
    selectedPatient.notes || 'Routine follow-up consultation and medication review.'
  );
  const [symptomsInput, setSymptomsInput] = useState('Mild fatigue, occasional headache');
  const [clinicalObservations, setClinicalObservations] = useState(
    'Chest clear bilaterally, normal heart sounds, abdomen soft, no edema.'
  );
  const [diagnosis, setDiagnosis] = useState(
    selectedPatient.chronicConditions.length > 0
      ? `${selectedPatient.chronicConditions.join(', ')}`
      : 'Acute Upper Respiratory Tract Symptoms'
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    'Symptomatic relief, lifestyle counseling, and scheduled review.'
  );
  const [generalAdvice, setGeneralAdvice] = useState(
    'Adequate hydration (2.5L daily), light non-spicy diet, avoid strenuous exertion for 48 hours.'
  );
  const [followUpDate, setFollowUpDate] = useState('2026-12-05');
  const [doctorNotes, setDoctorNotes] = useState('Patient educated on warning signs and compliance.');

  // Medicines List
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'MED-1',
      name: 'Tab. Pan-D',
      genericName: 'Pantoprazole 40mg + Domperidone 30mg SR',
      dosage: '1 capsule',
      frequency: '1-0-0',
      timing: 'Before Food',
      duration: '14 Days',
      instructions: 'Take 30 mins before breakfast',
    },
    {
      id: 'MED-2',
      name: 'Tab. Dolo 650',
      genericName: 'Paracetamol 650mg',
      dosage: '1 tablet',
      frequency: '1-0-1',
      timing: 'After Food',
      duration: '3 Days',
      instructions: 'Take after meals if headache or fever exceeds 99.5F',
    },
  ]);

  // Modals
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);

  // Quick medicine library selector
  const handleAddFromLibrary = (med: (typeof MOCK_MEDICINES_LIBRARY)[0]) => {
    const newItem: MedicineItem = {
      id: 'MED-' + Math.random().toString(36).substring(2, 7),
      name: med.name,
      genericName: med.generic,
      dosage: med.defaultDosage,
      frequency: med.defaultFreq,
      timing: med.defaultTiming,
      duration: med.defaultDuration,
      instructions: med.instructions,
    };
    setMedicines([...medicines, newItem]);
    addToast(`Added ${med.name} to prescription`, 'info');
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, updates: Partial<MedicineItem>) => {
    setMedicines(medicines.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleAddNewBlankMedicine = () => {
    const blank: MedicineItem = {
      id: 'MED-' + Math.random().toString(36).substring(2, 7),
      name: '',
      genericName: '',
      dosage: '1 tablet',
      frequency: '1-0-1',
      timing: 'After Food',
      duration: '5 Days',
      instructions: 'Take after meals',
    };
    setMedicines([...medicines, blank]);
  };

  // Switch patient handler
  const handlePatientChange = (patientId: string) => {
    const p = patients.find((pt) => pt.id === patientId);
    if (!p) return;
    setSelectedPatient(p);
    const vit = p.vitalsHistory[0] || {
      bp: '120/80',
      heartRate: 72,
      temp: 98.4,
      spo2: 99,
      weight: 68,
      height: 168,
      bmi: 24.1,
    };
    setVitals({
      bp: vit.bp,
      heartRate: vit.heartRate,
      temp: vit.temp,
      spo2: vit.spo2,
      weight: vit.weight,
      height: vit.height,
    });
    setDiagnosis(p.chronicConditions.length > 0 ? p.chronicConditions.join(', ') : 'Routine Consultation');
  };

  // Save Prescription Action
  const handleSavePrescription = () => {
    if (medicines.length === 0) {
      addToast('Please prescribe at least one medication', 'warning');
      return;
    }

    const calculatedBMI = bmiInfo.bmi;

    const symptomsList = symptomsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newRx = createPrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      patientPhone: selectedPatient.phone,
      doctorName: settings.doctorName,
      doctorQualification: settings.doctorQualification,
      doctorRegNo: settings.doctorRegNo,
      vitals: {
        bp: vitals.bp,
        heartRate: Number(vitals.heartRate),
        temp: Number(vitals.temp),
        spo2: Number(vitals.spo2),
        weight: Number(vitals.weight),
        height: Number(vitals.height),
        bmi: calculatedBMI,
      },
      chiefComplaint,
      symptoms: symptomsList,
      clinicalObservations,
      diagnosis,
      treatmentPlan,
      medicines,
      generalAdvice,
      followUpDate,
      doctorNotes,
      labTestsAdvised: ['Complete Blood Count', 'Blood Glucose Fasting'],
    });

    // Check if there is an active token for this patient and mark completed
    const matchingToken = tokens.find(
      (t) => t.patientId === selectedPatient.id && (t.status === 'called' || t.status === 'in-consultation')
    );
    if (matchingToken) {
      completeToken(matchingToken.id);
    }

    setActivePrescription(newRx);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Patient Header & Switcher */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#123C45] to-[#1C7774] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-[#123C45] tracking-tight">
                  {selectedPatient.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                  {selectedPatient.id}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-[#1C7774]">
                  {selectedPatient.age} yrs • {selectedPatient.gender}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700">
                  Blood Group: {selectedPatient.bloodGroup}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#718286] mt-1.5">
                <span>Phone: <strong className="text-[#172D32]">{selectedPatient.phone}</strong></span>
                <span>Last Visited: <strong className="text-[#172D32]">{selectedPatient.lastVisit}</strong></span>
                <span>Status: <strong className="text-emerald-700">{selectedPatient.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Switch Patient Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#718286] font-medium hidden sm:inline">Select Patient:</span>
            <select
              value={selectedPatient.id}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-bold text-[#123C45] bg-[#F5F8F7] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - {p.gender}, {p.age}y
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Known Allergies & Chronic Conditions Alert */}
        {(selectedPatient.allergies.length > 0 || selectedPatient.chronicConditions.length > 0) && (
          <div className="mt-4 pt-4 border-t border-[#E5ECEA] flex flex-wrap items-center gap-4 text-xs">
            {selectedPatient.allergies.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Allergies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.allergies.map((alg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedPatient.chronicConditions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#123C45] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#35A99A]" /> Conditions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.chronicConditions.map((cond, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#1C7774] border border-teal-200">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vitals Recording Strip */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-sm text-[#123C45]">Patient Vitals (Pre-Consultation Assessment)</h3>
          </div>
          <span className="text-xs text-[#718286]">Auto-calculating BMI & Cardiovascular Status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Blood Pressure</label>
            <input
              type="text"
              value={vitals.bp}
              onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
              placeholder="120/80"
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">mmHg</span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Heart Rate</label>
            <input
              type="number"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">bpm</span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              value={vitals.temp}
              onChange={(e) => setVitals({ ...vitals, temp: Number(e.target.value) })}
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">°F</span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">SpO2 Oxygen</label>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">%</span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Weight</label>
            <input
              type="number"
              value={vitals.weight}
              onChange={(e) => setVitals({ ...vitals, weight: Number(e.target.value) })}
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">kg</span>
          </div>

          <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5ECEA]">
            <label className="text-[10px] uppercase font-bold text-[#718286] block mb-1">Height</label>
            <input
              type="number"
              value={vitals.height}
              onChange={(e) => setVitals({ ...vitals, height: Number(e.target.value) })}
              className="w-full bg-white font-bold text-sm text-[#123C45] px-2 py-1 rounded border border-[#E5ECEA] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 block mt-1">cm</span>
          </div>

          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200">
            <label className="text-[10px] uppercase font-bold text-[#1C7774] block mb-1">Calculated BMI</label>
            <span className="font-extrabold text-lg text-[#123C45] block">{bmiInfo.bmi || '23.4'}</span>
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${bmiInfo.color}`}>
              {bmiInfo.category}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Notes & Diagnosis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#35A99A]" />
            Clinical Presentation & Examination
          </h3>

          <div>
            <label className="text-xs font-bold text-[#172D32] block mb-1">Chief Complaint</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
              placeholder="e.g. Headache and fever for past 2 days"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#172D32] block mb-1">Presenting Symptoms (comma separated)</label>
            <input
              type="text"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
              placeholder="e.g. Nausea, dry cough, sore throat"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#172D32] block mb-1">Doctor's Clinical Observations</label>
            <textarea
              rows={3}
              value={clinicalObservations}
              onChange={(e) => setClinicalObservations(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#35A99A]" />
            Diagnosis & Treatment Strategy
          </h3>

          <div>
            <label className="text-xs font-bold text-[#172D32] block mb-1">Working Clinical Diagnosis *</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-teal-300 bg-teal-50/20 text-xs font-bold text-[#123C45] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
              placeholder="e.g. Type 2 Diabetes Mellitus with Essential Hypertension"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#172D32] block mb-1">Treatment Plan & Action Items</label>
            <textarea
              rows={2}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#172D32] block mb-1">Recommended Follow-up</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-semibold text-[#123C45] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#172D32] block mb-1">Internal Doctor Notes</label>
              <input
                type="text"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs text-[#172D32] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Builder */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5ECEA] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black text-[#123C45] italic">℞</span>
              <h3 className="font-bold text-sm text-[#123C45]">Digital Prescription Builder</h3>
            </div>
            <p className="text-xs text-[#718286]">Add medicines, adjust dosage, frequency, and instructions</p>
          </div>

          {/* Quick Presets from Mock Library */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewBlankMedicine}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#172D32] rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Medicine</span>
            </button>
          </div>
        </div>

        {/* Quick Pick Chips */}
        <div>
          <span className="text-[11px] font-bold text-[#718286] uppercase tracking-wider block mb-2">
            Quick Add from Pharmacy Formulary:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_MEDICINES_LIBRARY.slice(0, 8).map((med) => (
              <button
                key={med.name}
                onClick={() => handleAddFromLibrary(med)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F5F8F7] hover:bg-teal-50 hover:text-[#1C7774] border border-[#E5ECEA] text-[#172D32] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-[#35A99A]" />
                <span>{med.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Table / List */}
        <div className="space-y-3">
          {medicines.map((med, index) => (
            <div
              key={med.id}
              className="p-4 rounded-xl border border-[#E5ECEA] bg-[#FAFBFB] hover:border-teal-300 transition-all space-y-3"
            >
              <div className="grid grid-cols-2 sm:grid-cols-12 gap-2.5 items-center">
                {/* Index & Name */}
                <div className="col-span-2 sm:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#123C45] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleUpdateMedicine(med.id, { name: e.target.value })}
                      placeholder="Medicine Name (e.g. Tab. Telma 40)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5ECEA] bg-white font-bold text-xs text-[#123C45] focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={med.genericName || ''}
                    onChange={(e) => handleUpdateMedicine(med.id, { genericName: e.target.value })}
                    placeholder="Generic Composition (optional)"
                    className="w-full mt-1 ml-8 text-[11px] text-gray-500 italic px-2 py-0.5 border-b border-transparent focus:border-gray-300 focus:outline-none"
                  />
                </div>

                {/* Dosage */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Dosage</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleUpdateMedicine(med.id, { dosage: e.target.value })}
                    placeholder="1 tablet"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5ECEA] bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Frequency */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Frequency</label>
                  <select
                    value={med.frequency}
                    onChange={(e) => handleUpdateMedicine(med.id, { frequency: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#E5ECEA] bg-white text-xs font-bold text-[#1C7774] focus:outline-none"
                  >
                    <option value="1-0-1">1-0-1 (M & N)</option>
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="1-1-1">1-1-1 (Thrice)</option>
                    <option value="0-1-0">0-1-0 (Afternoon)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                </div>

                {/* Timing */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Timing</label>
                  <select
                    value={med.timing}
                    onChange={(e) =>
                      handleUpdateMedicine(med.id, { timing: e.target.value as MedicineItem['timing'] })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-[#E5ECEA] bg-white text-xs font-semibold focus:outline-none"
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Food">With Food</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="col-span-1 sm:col-span-1">
                  <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Duration</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => handleUpdateMedicine(med.id, { duration: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#E5ECEA] bg-white text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Delete */}
                <div className="col-span-2 sm:col-span-1 text-right sm:text-center pt-1 sm:pt-0">
                  <button
                    onClick={() => handleRemoveMedicine(med.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs sm:inline-block"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden text-rose-600 font-semibold text-[11px]">Remove</span>
                  </button>
                </div>
              </div>

              {/* Instructions row */}
              <div className="pt-1 flex items-center gap-2">
                <span className="text-[11px] text-gray-400 font-medium">Instructions:</span>
                <input
                  type="text"
                  value={med.instructions}
                  onChange={(e) => handleUpdateMedicine(med.id, { instructions: e.target.value })}
                  placeholder="e.g. Take with warm water, complete full course"
                  className="flex-1 text-xs text-gray-700 bg-transparent border-b border-gray-200 focus:border-[#35A99A] focus:outline-none px-1"
                />
              </div>
            </div>
          ))}
        </div>

        {/* General Advice */}
        <div>
          <label className="text-xs font-bold text-[#172D32] block mb-1">
            Dietary, Lifestyle & General Medical Advice
          </label>
          <input
            type="text"
            value={generalAdvice}
            onChange={(e) => setGeneralAdvice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E5ECEA] text-xs font-medium text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#E5ECEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[#718286] text-center sm:text-left">
            Total {medicines.length} medications prescribed • All changes saved locally
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                if (activePrescription) {
                  setWhatsappModalOpen(true);
                } else {
                  handleSavePrescription();
                  setTimeout(() => setWhatsappModalOpen(true), 300);
                }
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border border-[#25D366]/40 font-bold text-xs transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#25D366]" />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={handleSavePrescription}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#123C45] hover:bg-[#164a55] text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4 text-[#35A99A]" />
              <span>Save & Generate Prescription (Rx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prescription A4 Print Modal */}
      <PrescriptionPrintModal
        prescription={activePrescription}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />

      {/* WhatsApp Share Simulation Modal */}
      <WhatsAppShareModal
        prescription={activePrescription}
        isOpen={whatsappModalOpen}
        onClose={() => setWhatsappModalOpen(false)}
      />
    </div>
  );
}

export default function DoctorConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white p-12 rounded-2xl border border-[#E5ECEA] text-center text-xs text-gray-500">
          Loading Physician Consultation Workspace...
        </div>
      }
    >
      <DoctorConsultationContent />
    </Suspense>
  );
}
