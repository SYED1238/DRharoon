export type Gender = 'Male' | 'Female' | 'Other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientStatus = 'Active' | 'Under Treatment' | 'Follow-up Due' | 'Inactive';

export interface Vitals {
  bp: string;
  heartRate: number;
  temp: number;
  spo2: number;
  weight: number;
  height: number;
  bmi: number;
}

export interface VitalsRecord extends Vitals {
  id?: string;
  date: string;
  recordedBy?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  dob: string;
  address: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  lastVisit: string;
  registeredDate: string;
  status: PatientStatus;
  notes?: string;
  vitalsHistory: VitalsRecord[];
}

export type TokenCategory = 'walk-in' | 'appointment' | 'priority';
export type TokenStatus = 'waiting' | 'called' | 'in-consultation' | 'completed' | 'skipped' | 'no-show' | 'cancelled';

export interface Token {
  id: string;
  tokenNumber: string; // e.g. "A-101", "P-004"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: Gender;
  category: TokenCategory;
  status: TokenStatus;
  assignedDoctor: string;
  room: string;
  arrivalTime: string;
  calledTime?: string;
  completedTime?: string;
  priorityRank: number;
  notes?: string;
}

export type AppointmentType = 'General Consultation' | 'Follow-up' | 'Lab Review' | 'Routine Checkup' | 'Emergency';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientGender: Gender;
  patientAge: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  type: AppointmentType;
  status: AppointmentStatus;
  doctor: string;
  notes?: string;
  tokenNumber?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string; // e.g., "1-0-1", "0-0-1", "1-1-1"
  timing: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
  duration: string; // e.g., "5 Days", "10 Days", "1 Month"
  instructions: string;
}

export interface Prescription {
  id: string; // e.g. "RX-2026-041"
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  patientPhone: string;
  date: string;
  doctorName: string;
  doctorQualification: string;
  doctorRegNo: string;
  vitals: Vitals;
  chiefComplaint: string;
  symptoms: string[];
  clinicalObservations: string;
  diagnosis: string;
  treatmentPlan: string;
  medicines: MedicineItem[];
  labTestsAdvised?: string[];
  generalAdvice: string;
  followUpDate?: string;
  doctorNotes?: string;
}

export interface LabResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabOrder {
  id: string; // e.g. "LAB-2026-089"
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  testName: string;
  category: 'Biochemistry' | 'Hematology' | 'Microbiology' | 'Pathology' | 'Radiology';
  orderDate: string;
  completionDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Sample Collected';
  orderedBy: string;
  fastingRequired: boolean;
  results?: LabResultItem[];
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  type: 'Consultation' | 'Lab' | 'Procedure' | 'Medicine' | 'Other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Other';
export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending';

export interface Invoice {
  id: string; // e.g. "INV-2026-102"
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  notes?: string;
}

export interface ClinicSettings {
  clinicName: string;
  tagline: string;
  doctorName: string;
  doctorQualification: string;
  doctorRegNo: string;
  phone: string;
  email: string;
  address: string;
  consultationFee: number;
  followupFee: number;
  workingHours: string;
  activeVoiceLanguage: 'en' | 'hi' | 'kn';
  voiceEnabled: boolean;
}
