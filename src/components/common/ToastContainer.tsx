'use client';

import React from 'react';
import { useClinicStore } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const toasts = useClinicStore((state) => state.toasts);
  const removeToast = useClinicStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white border-[#E5ECEA] text-[#172D32]';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;

        if (toast.type === 'danger') {
          bg = 'bg-rose-50 border-rose-200 text-rose-900';
          icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-50 border-amber-200 text-amber-900';
          icon = <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-teal-50 border-teal-200 text-teal-900';
          icon = <Info className="w-5 h-5 text-teal-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
