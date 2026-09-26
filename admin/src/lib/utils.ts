import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a DECIMAL string (from API) as Indian currency (INR).
 * e.g. "5000.00" → "₹5,000"
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format an ISO date string to a localised, readable format.
 * e.g. "2024-03-15T08:30:00Z" → "15 Mar 2024"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(isoString));
}

/**
 * Return the full donor display name.
 */
export function donorFullName(
  first_name: string,
  last_name: string,
  is_anonymous: boolean
): string {
  if (is_anonymous) return 'Anonymous';
  return `${first_name} ${last_name}`.trim();
}
