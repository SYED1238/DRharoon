'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Invoice } from '@/types/clinic';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { InvoicePrintModal } from '@/components/billing/InvoicePrintModal';
import { Receipt, Search, Printer, DollarSign } from 'lucide-react';

export default function StaffInvoicesListPage() {
  const invoices = useClinicStore((state) => state.invoices);
  const [search, setSearch] = useState('');
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const filtered = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return inv.patientName.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q) || inv.patientPhone.includes(q);
  });

  const handlePrint = (inv: Invoice) => {
    setSelectedInv(inv);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Receipts & Invoices History</h2>
        <p className="text-xs text-[#718286]">Tax invoices, cashier receipts, and audit reconciliation records</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice ID or patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAFBFB]">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123C45]">{inv.id}</td>
                  <td className="py-3.5 px-4 text-gray-600">{inv.date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#172D32]">{inv.patientName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#123C45]">{formatCurrency(inv.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{formatCurrency(inv.paidAmount)}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-700">{inv.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.paymentStatus} type="payment" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handlePrint(inv)}
                      className="px-2.5 py-1 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white font-bold inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoicePrintModal
        invoice={selectedInv}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
