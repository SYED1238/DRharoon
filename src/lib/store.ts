'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Patient,
  Token,
  Appointment,
  Prescription,
  LabOrder,
  Invoice,
  ClinicSettings,
  TokenStatus,
  TokenCategory,
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
  Vitals,
} from '@/types/clinic';
import {
  INITIAL_CLINIC_SETTINGS,
  INITIAL_PATIENTS,
  INITIAL_TOKENS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_ORDERS,
  INITIAL_INVOICES,
} from '@/lib/mockData';
import { announceToken } from '@/lib/speech';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface ClinicStore {
  // Data
  settings: ClinicSettings;
  patients: Patient[];
  tokens: Token[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  invoices: Invoice[];
  currentServingTokenId: string | null;
  selectedPatientId: string;
  toasts: ToastMessage[];

  // Toast actions
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<ClinicSettings>) => void;

  // Patient Actions
  registerPatient: (patientData: {
    name: string;
    age: number;
    gender: Patient['gender'];
    phone: string;
    dob?: string;
    address: string;
    bloodGroup?: Patient['bloodGroup'];
    allergies?: string[];
    chronicConditions?: string[];
    emergencyContact?: Patient['emergencyContact'];
    notes?: string;
  }) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addVitalsRecord: (patientId: string, vitals: Vitals) => void;
  setSelectedPatientId: (id: string) => void;

  // Token & Queue Actions
  generateToken: (data: {
    patientId: string;
    category?: TokenCategory;
    room?: string;
    assignedDoctor?: string;
    notes?: string;
  }) => Token;
  updateTokenStatus: (tokenId: string, status: TokenStatus) => void;
  callToken: (tokenId: string) => void;
  startConsultation: (tokenId: string) => void;
  completeToken: (tokenId: string) => void;
  skipToken: (tokenId: string) => void;
  recallToken: (tokenId: string) => void;
  cancelToken: (tokenId: string) => void;

  // Appointments
  createAppointment: (data: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;

  // Prescriptions
  createPrescription: (rx: Omit<Prescription, 'id' | 'date'>) => Prescription;

  // Lab Orders
  createLabOrder: (order: Omit<LabOrder, 'id' | 'orderDate'>) => LabOrder;
  updateLabStatus: (id: string, status: LabOrder['status']) => void;
  addLabResults: (id: string, results: NonNullable<LabOrder['results']>) => void;

  // Invoices & Billing
  createInvoice: (inv: Omit<Invoice, 'id' | 'date'>) => Invoice;
  updateInvoicePayment: (id: string, paidAmount: number, method: PaymentMethod, status: PaymentStatus) => void;

  // Reset
  resetDemoData: () => void;
}

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      settings: INITIAL_CLINIC_SETTINGS,
      patients: INITIAL_PATIENTS,
      tokens: INITIAL_TOKENS,
      appointments: INITIAL_APPOINTMENTS,
      prescriptions: INITIAL_PRESCRIPTIONS,
      labOrders: INITIAL_LAB_ORDERS,
      invoices: INITIAL_INVOICES,
      currentServingTokenId: "TOK-003", // Initially Mohammed Zameer
      selectedPatientId: "CL-2026-001", // Default patient for Patient portal
      toasts: [],

      addToast: (message, type = 'success') => {
        const id = 'toast-' + Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        get().addToast('Clinic settings updated', 'info');
      },

      registerPatient: (patientData) => {
        const nextNum = get().patients.length + 1;
        const id = `CL-2026-${String(nextNum).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const newPatient: Patient = {
          id,
          name: patientData.name.trim(),
          age: patientData.age,
          gender: patientData.gender,
          phone: patientData.phone.trim(),
          dob: patientData.dob || '1990-01-01',
          address: patientData.address.trim(),
          bloodGroup: patientData.bloodGroup || 'O+',
          allergies: patientData.allergies || ['None known'],
          chronicConditions: patientData.chronicConditions || [],
          emergencyContact: patientData.emergencyContact || {
            name: 'Primary Contact',
            relation: 'Family',
            phone: patientData.phone,
          },
          lastVisit: today,
          registeredDate: today,
          status: 'Active',
          notes: patientData.notes || '',
          vitalsHistory: [],
        };

        set((state) => ({
          patients: [newPatient, ...state.patients],
        }));

        get().addToast(`Patient registered: ${newPatient.name} (${newPatient.id})`, 'success');
        return newPatient;
      },

      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        get().addToast('Patient record updated', 'info');
      },

      addVitalsRecord: (patientId, vitals) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          patients: state.patients.map((p) => {
            if (p.id !== patientId) return p;
            const updatedHistory = [{ ...vitals, date: today }, ...p.vitalsHistory];
            return {
              ...p,
              lastVisit: today,
              vitalsHistory: updatedHistory,
            };
          }),
        }));
        get().addToast('Patient vitals recorded successfully', 'success');
      },

      setSelectedPatientId: (id) => {
        set({ selectedPatientId: id });
      },

      generateToken: (data) => {
        const patient = get().patients.find((p) => p.id === data.patientId);
        const tokens = get().tokens;
        const count = tokens.length + 1;
        const category = data.category || 'walk-in';
        const prefix = category === 'priority' ? 'P' : category === 'appointment' ? 'A' : 'W';
        const tokenNumber = `${prefix}-${String(count + 100).slice(-3)}`;

        const now = new Date();
        const arrivalTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const newToken: Token = {
          id: `TOK-${String(count).padStart(3, '0')}`,
          tokenNumber,
          patientId: data.patientId,
          patientName: patient ? patient.name : 'Unknown Patient',
          patientPhone: patient ? patient.phone : '',
          patientAge: patient ? patient.age : 30,
          patientGender: patient ? patient.gender : 'Male',
          category,
          status: 'waiting',
          assignedDoctor: data.assignedDoctor || get().settings.doctorName,
          room: data.room || 'Room 1',
          arrivalTime,
          priorityRank: category === 'priority' ? 1 : 10,
          notes: data.notes || '',
        };

        set((state) => ({
          tokens: [...state.tokens, newToken],
        }));

        get().addToast(`Generated Token ${tokenNumber} for ${newToken.patientName}`, 'success');
        return newToken;
      },

      updateTokenStatus: (tokenId, status) => {
        set((state) => ({
          tokens: state.tokens.map((t) => (t.id === tokenId ? { ...t, status } : t)),
        }));
      },

      callToken: (tokenId) => {
        const token = get().tokens.find((t) => t.id === tokenId);
        if (!token) return;

        const now = new Date();
        const calledTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        set((state) => ({
          currentServingTokenId: tokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId
              ? { ...t, status: 'called', calledTime }
              : t.status === 'called'
              ? { ...t, status: 'waiting' }
              : t
          ),
        }));

        // Voice announcement
        if (get().settings.voiceEnabled) {
          announceToken(token.tokenNumber, token.room || "Doctor's Room", {
            lang: get().settings.activeVoiceLanguage,
          });
        }

        get().addToast(`Called Token ${token.tokenNumber} to ${token.room || 'Doctor Room'}`, 'info');
      },

      startConsultation: (tokenId) => {
        set((state) => ({
          currentServingTokenId: tokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, status: 'in-consultation' } : t
          ),
        }));
        const token = get().tokens.find((t) => t.id === tokenId);
        if (token) {
          get().addToast(`Started consultation for ${token.patientName}`, 'info');
        }
      },

      completeToken: (tokenId) => {
        const now = new Date();
        const completedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        set((state) => ({
          currentServingTokenId: state.currentServingTokenId === tokenId ? null : state.currentServingTokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, status: 'completed', completedTime } : t
          ),
        }));

        const token = get().tokens.find((t) => t.id === tokenId);
        if (token) {
          get().addToast(`Token ${token.tokenNumber} marked completed`, 'success');
        }
      },

      skipToken: (tokenId) => {
        set((state) => ({
          currentServingTokenId: state.currentServingTokenId === tokenId ? null : state.currentServingTokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, status: 'skipped' } : t
          ),
        }));
        const token = get().tokens.find((t) => t.id === tokenId);
        if (token) {
          get().addToast(`Token ${token.tokenNumber} skipped`, 'warning');
        }
      },

      recallToken: (tokenId) => {
        const token = get().tokens.find((t) => t.id === tokenId);
        if (!token) return;

        set((state) => ({
          currentServingTokenId: tokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, status: 'called' } : t
          ),
        }));

        if (get().settings.voiceEnabled) {
          announceToken(token.tokenNumber, token.room || "Doctor's Room", {
            lang: get().settings.activeVoiceLanguage,
          });
        }
        get().addToast(`Recalled Token ${token.tokenNumber}`, 'info');
      },

      cancelToken: (tokenId) => {
        set((state) => ({
          currentServingTokenId: state.currentServingTokenId === tokenId ? null : state.currentServingTokenId,
          tokens: state.tokens.map((t) =>
            t.id === tokenId ? { ...t, status: 'cancelled' } : t
          ),
        }));
        get().addToast('Token cancelled', 'warning');
      },

      createAppointment: (data) => {
        const count = get().appointments.length + 1;
        const id = `APT-2026-${String(count).padStart(3, '0')}`;
        const newApt: Appointment = {
          ...data,
          id,
        };

        set((state) => ({
          appointments: [newApt, ...state.appointments],
        }));

        get().addToast(`Appointment scheduled for ${newApt.patientName} on ${newApt.date} at ${newApt.time}`, 'success');
        return newApt;
      },

      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        }));
        get().addToast(`Appointment status updated to ${status}`, 'info');
      },

      rescheduleAppointment: (id, date, time) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, date, time, status: 'rescheduled' } : a
          ),
        }));
        get().addToast(`Appointment rescheduled to ${date} at ${time}`, 'success');
      },

      createPrescription: (rx) => {
        const count = get().prescriptions.length + 1;
        const id = `RX-2026-${String(count + 40).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const newPrescription: Prescription = {
          ...rx,
          id,
          date: today,
        };

        // Also add vitals to patient vitals history
        get().addVitalsRecord(rx.patientId, rx.vitals);

        set((state) => ({
          prescriptions: [newPrescription, ...state.prescriptions],
        }));

        get().addToast(`Prescription ${id} generated successfully for ${rx.patientName}`, 'success');
        return newPrescription;
      },

      createLabOrder: (order) => {
        const count = get().labOrders.length + 1;
        const id = `LAB-2026-${String(count + 80).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const newOrder: LabOrder = {
          ...order,
          id,
          orderDate: today,
        };

        set((state) => ({
          labOrders: [newOrder, ...state.labOrders],
        }));

        get().addToast(`Lab order ${id} created for ${order.patientName}`, 'success');
        return newOrder;
      },

      updateLabStatus: (id, status) => {
        set((state) => ({
          labOrders: state.labOrders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
        get().addToast(`Lab order status updated to ${status}`, 'info');
      },

      addLabResults: (id, results) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          labOrders: state.labOrders.map((o) =>
            o.id === id ? { ...o, results, status: 'Completed', completionDate: today } : o
          ),
        }));
        get().addToast('Lab test results updated successfully', 'success');
      },

      createInvoice: (inv) => {
        const count = get().invoices.length + 1;
        const id = `INV-2026-${String(count + 100).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const newInvoice: Invoice = {
          ...inv,
          id,
          date: today,
        };

        set((state) => ({
          invoices: [newInvoice, ...state.invoices],
        }));

        get().addToast(`Invoice ${id} created for ₹${newInvoice.totalAmount}`, 'success');
        return newInvoice;
      },

      updateInvoicePayment: (id, paidAmount, method, status) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== id) return inv;
            const updatedPaid = paidAmount;
            const balance = Math.max(0, inv.totalAmount - updatedPaid);
            return {
              ...inv,
              paidAmount: updatedPaid,
              balance,
              paymentMethod: method,
              paymentStatus: status,
            };
          }),
        }));
        get().addToast('Payment record updated', 'success');
      },

      resetDemoData: () => {
        set({
          settings: INITIAL_CLINIC_SETTINGS,
          patients: INITIAL_PATIENTS,
          tokens: INITIAL_TOKENS,
          appointments: INITIAL_APPOINTMENTS,
          prescriptions: INITIAL_PRESCRIPTIONS,
          labOrders: INITIAL_LAB_ORDERS,
          invoices: INITIAL_INVOICES,
          currentServingTokenId: "TOK-003",
          selectedPatientId: "CL-2026-001",
        });
        get().addToast('Demo data reset to factory initial state', 'info');
      },
    }),
    {
      name: 'clinova_clinic_state_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        patients: state.patients,
        tokens: state.tokens,
        appointments: state.appointments,
        prescriptions: state.prescriptions,
        labOrders: state.labOrders,
        invoices: state.invoices,
        currentServingTokenId: state.currentServingTokenId,
        selectedPatientId: state.selectedPatientId,
      }),
    }
  )
);
