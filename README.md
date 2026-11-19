# CLINOVA ClinicOS — Premium Healthcare Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Production--Ready%20Frontend-emerald)]()

**CLINOVA** is a premium, production-quality frontend clinic management ecosystem designed for single-doctor clinics with multi-staff operations, specifically tailored for **Dr. Haroon's Medical Center & Healthcare Clinic** (Indiranagar, Bengaluru).

---

## 🌟 Four Connected Interfaces

All four portals operate on a unified, persistent reactive frontend state store (`Zustand` + `localStorage` with cross-tab event synchronization):

| Portal | Route | Primary Highlights |
| :--- | :--- | :--- |
| **Demo Hub & Scenario Suite** | `/` & `/demo` | Portal Launcher, Walkthrough Simulator, Live Metrics, Reset Demo |
| **Doctor Portal** | `/doctor` | Consultation Workspace, Digital Rx Builder, Vitals, Audio Queue Call |
| **Staff & Reception Desk** | `/staff` | 5-Second Registration, Token Queue Generator, Multi-Mode Cashier |
| **Patient Health Portal** | `/patient` | 30 Patient Cohorts Switcher, Live Token Position, Downloadable Rx |
| **Waiting Hall TV Display** | `/tv` | 1920x1080 Large-Screen Queue Display with Multilingual Speech Synthesis (EN, HI, KN) |

---

## 🩺 Doctor Portal Features (`/doctor`)

- **Physician Workstation**: Real-time KPI summaries, weekly consultation volume trends via Recharts, caseload distribution, and instant "Call Next Patient" queue trigger.
- **Flagship Consultation Workspace (`/doctor/consultation`)**:
  - Live patient demographics, drug allergy chips, and chronic condition alerts.
  - Vitals assessment (Blood Pressure, Heart Rate, Temperature, SpO2, Weight, Height) with automatic BMI and clinical status indicator.
  - Clinical examination notes: Chief complaint, symptoms, clinical observations, diagnosis, and treatment plan.
  - **Prescription Builder**: Add/edit/delete medications with dosages, frequencies (`1-0-1`, `1-0-0`, `0-0-1`, `SOS`), timings (Before/After/With food), duration, and instructions. Quick-pick chips from the clinic pharmacy formulary.
  - **Printable A4 Prescription Preview Modal**: Formatted document with clinic logo, physician registration number, patient data, diagnosis, Rx table, and digital signature.
  - **WhatsApp Sharing Experience Modal**: Simulated WhatsApp message with patient phone number, formatted medication regimen, mock PDF attachment chip, and direct `wa.me` link.
- **Patient Records (`/doctor/patients`)**: Searchable EMR directory with patient profile dossier showing medical timeline, historical vitals log, and previous consults.
- **Appointments (`/doctor/appointments`)**: Schedule manager with filtering and rescheduling drawer.
- **Laboratory Orders (`/doctor/laboratory`)**: Diagnostic order tracking, mock result entry, and abnormal parameter detection.
- **Medical Certificates (`/doctor/certificates`)**: Medical fitness and sick leave certificate generator with A4 print layout.
- **Follow-ups & Reports (`/doctor/follow-ups`, `/doctor/reports`, `/doctor/settings`)**: Chronic care recall and clinical analytics.

---

## 📋 Receptionist & Staff Portal Features (`/staff`)

- **Front Desk Dashboard (`/staff`)**: Real-time intake count, waiting patients, currently serving patient, and today's collections.
- **Patient Registration (`/staff/register`)**: Fast intake form capturing demographics, drug allergies, emergency contact, and an instant "Generate OPD Token" option that broadcasts immediately to the waiting room TV.
- **Token & Queue Management (`/staff/tokens`)**:
  - Real-time token queue with categories: Walk-in (`W-prefix`), Appointment (`A-prefix`), and Priority (`P-prefix`).
  - Actions: **Call to TV**, **Recall (Re-announce)**, **Skip**, **Complete**, **Re-queue**, and **Cancel**.
- **Billing & Cashier (`/staff/billing`)**: Multi-item invoice creator supporting Consultation, Laboratory, Procedures, Concessions/Discounts, and mock payment modes (Cash, UPI, POS Card).
- **Invoices History (`/staff/invoices`)**: Searchable tax invoice directory with printable A4 receipts.
- **Shift Reports & Settings (`/staff/reports`, `/staff/settings`)**: Cashier day-end reconciliation drawer tally and token configurations.

---

## 📱 Patient Health Portal Features (`/patient`)

- **Patient Switcher**: Dropdown in the header allowing inspection as any of the **30 registered patients** (e.g., *Ahmed Khan*, *Fatima Zahra*, *Rahul Verma*, *Priya Sundaram*).
- **Privacy Assurance**: Each patient view is strictly isolated to their own mock records.
- **Live OPD Queue Alert**: If the patient holds an active token today, an alert card displays their token number, current serving number, and room assignment.
- **Appointments (`/patient/appointments`)**: View upcoming/past visits with an interactive "Request New Appointment" date & slot selector.
- **Medical Dossier (`/patient/records`)**: Historical vitals log, recorded diagnoses, and drug allergy summary.
- **Prescriptions (`/patient/prescriptions`)**: Full list of issued prescriptions with A4 print and PDF download preview.
- **Laboratory Reports (`/patient/laboratory`)**: Pathology results with biological reference ranges and highlighted out-of-range markers.
- **Profile (`/patient/profile`)**: Personal info and emergency contact details.

---

## 📺 Waiting Room TV Queue Display (`/tv`)

- **1920x1080 Full-Screen Waiting Hall Experience**: High-contrast, distraction-free display for clinic waiting areas.
- **Left Panel (Currently Serving)**: Massive pulsing token number (e.g. `P-001`), doctor name (*Dr. Haroon Rashid*), and room location (*Room 1*).
- **Right Panel (Next in Line)**: Upcoming queue with estimated wait times and priority tags.
- **Voice Announcement Engine**:
  - Uses the Web SpeechSynthesis API: *"Token number A zero zero five, please proceed to Doctor's Room."*
  - Multilingual voice support: **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.
  - Audio controller with volume slider, test announcement trigger, and full-screen toggle.
- **Bottom Ticker**: Continuous animated announcement banner with clinic Wi-Fi info, hygiene advisories, and instructions.
- **Privacy Guaranteed**: Patient names, phone numbers, and diagnoses are never displayed on the public TV.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistent storage and cross-tab sync
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Audio Announcements**: Web SpeechSynthesis API

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/SYED1238/DRharoon.git
cd DRharoon
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License & Attribution

Developed for **Dr. Haroon's Medical Center**. Built with Next.js & Tailwind CSS.
