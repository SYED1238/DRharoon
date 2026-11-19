import { PatientLayout } from '@/components/layouts/PatientLayout';

export const metadata = {
  title: "Patient Health Portal | CLINOVA ClinicOS",
  description: "Personal health records, prescriptions, and appointment bookings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PatientLayout>{children}</PatientLayout>;
}
