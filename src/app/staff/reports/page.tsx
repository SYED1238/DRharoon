'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, CreditCard, DollarSign, Users, Ticket, ArrowUpRight } from 'lucide-react';

export default function StaffReportsPage() {
  const invoices = useClinicStore((state) => state.invoices);
  const tokens = useClinicStore((state) => state.tokens);
  const patients = useClinicStore((state) => state.patients);

  // Group by payment methods
  const cashTotal = invoices
    .filter((inv) => inv.paymentMethod === 'Cash')
    .reduce((s, inv) => s + inv.paidAmount, 0);
  const upiTotal = invoices
    .filter((inv) => inv.paymentMethod === 'UPI')
    .reduce((s, inv) => s + inv.paidAmount, 0);
  const cardTotal = invoices
    .filter((inv) => inv.paymentMethod === 'Card')
    .reduce((s, inv) => s + inv.paidAmount, 0);

  const grandTotal = cashTotal + upiTotal + cardTotal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Front Desk Shift Report & Cashier Reconciliation</h2>
        <p className="text-xs text-[#718286]">Daily collections breakdown, cashier drawer tally, and patient intake volume</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5ECEA] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Shift Intake</span>
          <span className="text-2xl font-black text-[#123C45] block">{tokens.length} Patients</span>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">OPD Token Generated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">Cash in Drawer</span>
          <span className="text-2xl font-black text-emerald-800 block">{formatCurrency(cashTotal)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Physical currency count</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-200 bg-teal-50/20 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-teal-800 block mb-1">Digital UPI Collections</span>
          <span className="text-2xl font-black text-teal-800 block">{formatCurrency(upiTotal)}</span>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">QR code / dynamic links</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-blue-800 block mb-1">POS Card Terminal</span>
          <span className="text-2xl font-black text-blue-800 block">{formatCurrency(cardTotal)}</span>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Swipe / Chip & PIN</span>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5ECEA] shadow-2xs">
        <h3 className="font-bold text-sm text-[#123C45] mb-4">Cashier Day-End Reconciled Totals</h3>
        <div className="max-w-md space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600">Total Invoices Issued:</span>
            <span className="font-bold text-[#123C45]">{invoices.length} receipts</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600">Total Consultation Fees:</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(
                invoices.reduce(
                  (sum, inv) =>
                    sum +
                    inv.items
                      .filter((i) => i.type === 'Consultation')
                      .reduce((s, it) => s + it.total, 0),
                  0
                )
              )}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-600">Total Diagnostic Lab Fees:</span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(
                invoices.reduce(
                  (sum, inv) =>
                    sum +
                    inv.items
                      .filter((i) => i.type === 'Lab')
                      .reduce((s, it) => s + it.total, 0),
                  0
                )
              )}
            </span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-[#123C45] text-sm font-extrabold text-[#123C45]">
            <span>Net Collected Revenue:</span>
            <span className="text-emerald-700">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
