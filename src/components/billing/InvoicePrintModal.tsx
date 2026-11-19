'use client';

import React from 'react';
import { Invoice } from '@/types/clinic';
import { useClinicStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Printer, X, Receipt, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoicePrintModal({
  invoice,
  isOpen,
  onClose,
}: InvoicePrintModalProps) {
  const settings = useClinicStore((state) => state.settings);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200">
        {/* Action Header */}
        <div className="bg-[#123C45] text-white px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#35A99A]/20 border border-[#35A99A]/40 flex items-center justify-center text-[#35A99A]">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Official Clinic Billing Receipt</h3>
              <p className="text-xs text-white/70">Invoice #{invoice.id} • {invoice.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#35A99A] hover:bg-[#2e9688] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Canvas */}
        <div id="printable-content" className="p-8 md:p-10 bg-white text-[#172D32]">
          {/* Header */}
          <div className="border-b-2 border-[#123C45] pb-6 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#123C45] text-white flex items-center justify-center font-bold text-lg">
                C
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#123C45]">{settings.clinicName}</h1>
                <p className="text-xs text-[#1C7774] font-medium">{settings.tagline}</p>
                <div className="flex flex-col text-[11px] text-[#718286] mt-1 space-y-0.5">
                  <span>{settings.address}</span>
                  <span>Phone: {settings.phone} • Email: {settings.email}</span>
                </div>
              </div>
            </div>

            <div className="md:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">TAX INVOICE</span>
              <h2 className="text-base font-mono font-bold text-[#123C45]">{invoice.id}</h2>
              <p className="text-xs text-gray-600">Date: {invoice.date}</p>
              <div className="mt-1">
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    invoice.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : invoice.paymentStatus === 'Partially Paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  STATUS: {invoice.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="bg-[#F5F8F7] rounded-xl p-4 border border-[#E5ECEA] mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Patient Name</span>
              <span className="font-bold text-[#123C45] text-sm">{invoice.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Patient ID / Contact</span>
              <span className="font-medium text-[#172D32]">{invoice.patientId} • {invoice.patientPhone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-gray-500 block">Payment Mode</span>
              <span className="font-bold text-[#1C7774]">{invoice.paymentMethod} {invoice.transactionRef ? `(${invoice.transactionRef})` : ''}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-[#E5ECEA] mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#123C45] text-white">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEA]">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFBFB]">
                    <td className="py-2.5 px-3 font-medium text-gray-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#123C45]">{item.description}</td>
                    <td className="py-2.5 px-3 text-gray-600">{item.type}</td>
                    <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#172D32]">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Concession / Discount:</span>
                  <span>- {formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="border-t border-[#E5ECEA] pt-2 flex justify-between text-sm font-bold text-[#123C45]">
                <span>Total Payable:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-700">
                <span>Amount Paid ({invoice.paymentMethod}):</span>
                <span className="font-semibold text-emerald-700">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-700 border-t border-dashed border-gray-200 pt-1">
                <span>Pending Balance:</span>
                <span>{formatCurrency(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {/* Footer Receipt Notice */}
          <div className="border-t border-[#E5ECEA] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 gap-2">
            <span>Thank you for choosing {settings.clinicName}. Wishing you speedy health!</span>
            <span>Generated electronically via Clinova ClinicOS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
