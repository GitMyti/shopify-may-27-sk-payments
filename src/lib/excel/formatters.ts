
/**
 * Formatting utilities for Excel exports
 */

/**
 * Formats a number as a currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formats a date object into MM/DD/YYYY format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}
