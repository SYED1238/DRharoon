'use client';

import React, { useState } from 'react';
import { useClinicStore } from '@/lib/store';
import { Invoice, InvoiceItem, PaymentMethod, PaymentStatus } from '@/types/clinic';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { InvoicePrintModal } from '@/components/billing/InvoicePrintModal';
import {
  CreditCard,
  Plus,
  Trash2,
  Printer,
  DollarSign,
  Search,
  CheckCircle,
  Receipt,
  User,
  X,
  FileCheck,
} from 'lucide-react';

export default function StaffBillingPage() {
  const invoices = useClinicStore((state) => state.invoices);
  const patients = useClinicStore((state) => state.patients);
  const settings = useClinicStore((state) => state.settings);
  const createInvoice = useClinicStore((state) => state.createInvoice);
  const updateInvoicePayment = useClinicStore((state) => state.updateInvoicePayment);
  const addToast = useClinicStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // New Invoice Drawer / Modal
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmountInput, setPaidAmountInput] = useState<number | ''>('');
  const [transactionRef, setTransactionRef] = useState('');

  // Line items for new invoice
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: 'Physician General Consultation Fee',
      type: 'Consultation',
      quantity: 1,
      unitPrice: settings.consultationFee || 700,
      total: settings.consultationFee || 700,
    },
  ]);

  const subtotal = items.reduce((acc, it) => acc + it.total, 0);
  const totalAmount = Math.max(0, subtotal - discount);

  const handleAddItem = (type: InvoiceItem['type'], description: string, unitPrice: number) => {
    setItems([
      ...items,
      {
        description,
        type,
        quantity: 1,
        unitPrice,
        total: unitPrice,
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === patientId);
    if (!p) return;

    const paid = paidAmountInput === '' ? totalAmount : Number(paidAmountInput);
    const balance = Math.max(0, totalAmount - paid);

    let status: PaymentStatus = 'Paid';
    if (balance === totalAmount) status = 'Pending';
    else if (balance > 0) status = 'Partially Paid';

    const inv = createInvoice({
      patientId: p.id,
      patientName: p.name,
      patientPhone: p.phone,
      items,
      subtotal,
      discount,
      tax: 0,
      totalAmount,
      paidAmount: paid,
      balance,
      paymentMethod,
      paymentStatus: status,
      transactionRef: transactionRef.trim() || undefined,
    });

    setNewInvoiceOpen(false);
    setSelectedInvoice(inv);
    setPrintModalOpen(true);
  };

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPrintModalOpen(true);
  };

  const handleMarkPaid = (inv: Invoice) => {
    updateInvoicePayment(inv.id, inv.totalAmount, inv.paymentMethod, 'Paid');
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'paid' && inv.paymentStatus !== 'Paid') return false;
    if (activeTab === 'pending' && inv.paymentStatus === 'Paid') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.patientName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123C45] tracking-tight">Billing, Invoicing & Cashier</h2>
          <p className="text-xs text-[#718286]">Generate receipts, record cash/UPI/card collections, and reconcile balances</p>
        </div>

        <button
          onClick={() => setNewInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#21865D] hover:bg-[#1a6d4b] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5ECEA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#F5F8F7] p-1 rounded-xl border border-[#E5ECEA]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            All Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'paid' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pending' ? 'bg-[#123C45] text-white' : 'text-[#718286]'
            }`}
          >
            Pending / Partial
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice ID or patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5ECEA] text-xs focus:outline-none focus:ring-2 focus:ring-[#35A99A]"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-[#E5ECEA] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFB] text-[#718286] uppercase font-bold border-b border-[#E5ECEA]">
              <tr>
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Billed Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid (Mode)</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEA]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAFBFB] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#123C45]">
                    {inv.id}
                    <span className="text-[10px] text-gray-400 block font-sans font-normal">{inv.date}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#172D32] block">{inv.patientName}</span>
                    <span className="text-[10px] text-gray-500">{inv.patientPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                    {inv.items.map((i) => i.description).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#123C45]">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-700 block">{formatCurrency(inv.paidAmount)}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{inv.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">
                    {inv.balance > 0 ? formatCurrency(inv.balance) : '₹0'}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.paymentStatus} type="payment" />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenPrint(inv)}
                        className="px-2.5 py-1 rounded-lg bg-[#123C45] hover:bg-[#1C7774] text-white font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {newInvoiceOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-[#E5ECEA] animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECEA] pb-3">
              <h3 className="font-bold text-base text-[#123C45]">Generate Billing Receipt</h3>
              <button
                onClick={() => setNewInvoiceOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5ECEA] font-bold text-[#123C45]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Add Presets */}
              <div>
                <span className="font-bold block text-gray-500 mb-1 text-[11px] uppercase">
                  Quick Service Items
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddItem('Consultation', 'Senior Doctor Consultation', 700)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                  >
                    + Consultation (₹700)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddItem('Consultation', 'Follow-up Consultation', 400)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                  >
                    + Follow-up (₹400)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddItem('Lab', 'Comprehensive Blood Chemistry', 850)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                  >
                    + Blood Chemistry (₹850)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddItem('Procedure', '12-Lead ECG Assay', 450)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                  >
                    + ECG (₹450)
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-[#E5ECEA] rounded-xl p-3 bg-[#FAFBFB] space-y-2">
                <span className="font-bold block text-[#123C45]">Billed Line Items ({items.length})</span>
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block truncate">{it.description}</span>
                      <span className="text-[10px] text-gray-500">{it.type}</span>
                    </div>
                    <span className="font-bold text-[#123C45]">{formatCurrency(it.total)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Discount & Totals */}
              <div className="grid grid-cols-2 gap-3 bg-[#F5F8F7] p-3 rounded-xl border border-[#E5ECEA]">
                <div>
                  <label className="font-bold block mb-1">Concession / Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <div className="text-right flex flex-col justify-center">
                  <span className="text-gray-500 text-[11px] block">Net Payable Amount</span>
                  <span className="text-lg font-black text-[#123C45] block">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-[#1C7774]"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Card">Debit / Credit Card POS</option>
                    <option value="Other">Other / Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Amount Collected (₹)</label>
                  <input
                    type="number"
                    placeholder={`Full (₹${totalAmount})`}
                    value={paidAmountInput}
                    onChange={(e) => setPaidAmountInput(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">UPI UTR / Reference ID (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-99812401"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#21865D] hover:bg-[#1a6e4c] text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
                >
                  Generate Invoice & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Modal */}
      <InvoicePrintModal
        invoice={selectedInvoice}
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
      />
    </div>
  );
}
