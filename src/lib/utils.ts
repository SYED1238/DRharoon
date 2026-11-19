import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '';
  try {
    if (timeString.includes(':') && (timeString.includes('AM') || timeString.includes('PM'))) {
      return timeString;
    }
    const d = new Date(timeString);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    }
  } catch {
    // fallback
  }
  return timeString;
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; color: string } {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, category: 'N/A', color: 'text-gray-500' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  return { bmi, category, color };
}

export function generateTokenCode(category: 'walk-in' | 'appointment' | 'priority', sequenceNumber: number): string {
  const prefix = category === 'priority' ? 'P' : category === 'appointment' ? 'A' : 'W';
  const padded = String(sequenceNumber).padStart(3, '0');
  return `${prefix}-${padded}`;
}
