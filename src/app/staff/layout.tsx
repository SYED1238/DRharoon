import { StaffLayout } from '@/components/layouts/StaffLayout';

export const metadata = {
  title: "Reception & Staff Portal | CLINOVA ClinicOS",
  description: "Front desk intake, instant token queue generation, and billing cashier",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StaffLayout>{children}</StaffLayout>;
}
