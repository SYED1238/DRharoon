import { DoctorLayout } from '@/components/layouts/DoctorLayout';

export const metadata = {
  title: "Doctor Portal | CLINOVA ClinicOS",
  description: "Physician clinical workspace, consultations, and digital prescriptions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DoctorLayout>{children}</DoctorLayout>;
}
