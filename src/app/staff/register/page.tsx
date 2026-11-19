'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClinicStore } from '@/lib/store';
import { Patient, TokenCategory } from '@/types/clinic';
import {
  UserPlus,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function StaffRegisterPatientPage() {
  const router = useRouter();
  const registerPatient = useClinicStore((state) => state.registerPatient);
  const generateToken = useClinicStore((state) => state.generateToken);
  const addToast = useClinicStore((state) => state.addToast);
  const patients = useClinicStore((state) => state.patients);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Patient['gender']>('Male');
  const [dob, setDob] = useState('1992-05-14');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState<Patient['bloodGroup']>('O+');
  const [allergies, setAllergies] = useState('None known');
  const [chronicConditions, setChronicConditions] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Family');

  const [issueTokenImmediately, setIssueTokenImmediately] = useState(true);
  const [tokenCategory, setTokenCategory] = useState<TokenCategory>('walk-in');
  const [notes, setNotes] = useState('Walk-in patient arriving for OPD consultation');

  const [registeredSuccess, setRegisteredSuccess] = useState<{
    patient: Patient;
    tokenNumber?: string;
  } | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !age) {
      addToast('Please fill out patient name, phone number, and age', 'warning');
      return;
    }

    const allergyList = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const conditionList = chronicConditions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newPatient = registerPatient({
      name: name.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender,
      dob,
      address: address.trim() || 'Indiranagar, Bengaluru',
      bloodGroup,
      allergies: allergyList.length > 0 ? allergyList : ['None known'],
      chronicConditions: conditionList,
      emergencyContact: {
        name: emergencyContactName.trim() || 'Family Contact',
        phone: emergencyContactPhone.trim() || phone.trim(),
        relation: emergencyRelation,
      },
      notes: notes.trim(),
    });

    let issuedTokenNumber: string | undefined = undefined;

    if (issueTokenImmediately) {
      const token = generateToken({
        patientId: newPatient.id,
        category: tokenCategory,
        room: 'Room 1',
        assignedDoctor: 'Dr. Haroon Rashid',
        notes,
      });
      issuedTokenNumber = token.tokenNumber;
    }

    setRegisteredSuccess({
      patient: newPatient,
      tokenNumber: issuedTokenNumber,
    });
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setAge('');
    setAddress('');
    setAllergies('None known');
    setChronicConditions('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setRegisteredSuccess(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Patient Registration & Intake</h2>
        <p className="text-xs text-[#718286]">Quick enrollment for walk-ins, phone appointments, and emergency cases</p>
      </div>

      {registeredSuccess ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#123C45]">Patient Registered Successfully!</h3>
            <p className="text-xs text-gray-600 mt-1">
              File created for <strong>{registeredSuccess.patient.name}</strong> • ID: <span className="font-mono font-bold text-[#1C7774]">{registeredSuccess.patient.id}</span>
            </p>
          </div>

          {registeredSuccess.tokenNumber && (
            <div className="max-w-xs mx-auto p-4 rounded-2xl bg-teal-50 border-2 border-[#35A99A] shadow-md">
              <span className="text-[10px] uppercase font-bold text-[#1C7774] block">OPD Waiting Token Issued</span>
              <span className="text-4xl font-mono font-black text-[#123C45] block my-1">
                {registeredSuccess.tokenNumber}
              </span>
              <span className="text-[11px] text-teal-800 font-semibold block">
                Broadcasting to Waiting TV Display
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForm}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
            >
              Register Another Patient
            </button>
            <button
              onClick={() => router.push('/staff/tokens')}
              className="px-5 py-2.5 bg-[#123C45] hover:bg-[#1C7774] text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>View Queue & Tokens</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Section 1: Demographics */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#35A99A]" />
              Patient Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-[#172D32] block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-bold text-[#123C45] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-semibold text-[#172D32] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Age *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 42"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-bold text-[#123C45] focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Patient['gender'])}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-semibold text-[#172D32] focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as Patient['bloodGroup'])}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] font-bold text-[#1C7774] focus:outline-none"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="font-bold text-[#172D32] block mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. #45 2nd Main, Indiranagar, Bengaluru"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Alerts & Emergency */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#123C45] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#35A99A]" />
              Medical History & Emergency Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#172D32] block mb-1">Drug Allergies (comma separated)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Known Chronic Conditions</label>
                <input
                  type="text"
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  placeholder="e.g. Diabetes, Hypertension"
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Spouse / Parent Name"
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#172D32] block mb-1">Emergency Phone Number</label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="Emergency phone"
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] bg-[#F5F8F7] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Instant Token Generation Checkbox */}
          <div className="bg-teal-50/50 p-6 rounded-2xl border-2 border-teal-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="issueToken"
                  checked={issueTokenImmediately}
                  onChange={(e) => setIssueTokenImmediately(e.target.checked)}
                  className="w-5 h-5 accent-[#1C7774] cursor-pointer"
                />
                <label htmlFor="issueToken" className="font-bold text-sm text-[#123C45] cursor-pointer">
                  Generate OPD Waiting Token Immediately
                </label>
              </div>
              <span className="text-xs text-[#1C7774] font-bold">Instantly updates TV Screen</span>
            </div>

            {issueTokenImmediately && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-teal-200">
                <div>
                  <label className="font-bold text-[#123C45] block mb-1">Patient Queue Priority</label>
                  <select
                    value={tokenCategory}
                    onChange={(e) => setTokenCategory(e.target.value as TokenCategory)}
                    className="w-full p-2.5 rounded-xl border border-teal-300 bg-white font-bold text-[#1C7774]"
                  >
                    <option value="walk-in">Standard Walk-in (W-prefix)</option>
                    <option value="appointment">Prior Scheduled Appointment (A-prefix)</option>
                    <option value="priority">Priority / Senior Citizen / Emergency (P-prefix)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#123C45] block mb-1">Intake Reason / Chief Symptom</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-teal-300 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#21865D] hover:bg-[#1b704d] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <UserPlus className="w-5 h-5" />
              <span>Complete Registration & Issue Patient Pass</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
