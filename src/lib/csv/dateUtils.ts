
import { ShopifyOrder } from './types';

/**
 * Extract the date range from the CSV data
 * This function looks at the "Paid at" column to determine the earliest and latest dates
 */
export function extractDateRange(orders: ShopifyOrder[]): { earliest: Date | null; latest: Date | null } {
  if (!orders || orders.length === 0) {
    return { earliest: null, latest: null };
  }
  
  // Find orders with valid "Paid at" dates
  const datesWithValues = orders
    .filter(order => order['Paid at'])
    .map(order => new Date(order['Paid at']));
    
  if (datesWithValues.length === 0) {
    return { earliest: null, latest: null };
  }
  
  // Sort dates to find earliest and latest
  datesWithValues.sort((a, b) => a.getTime() - b.getTime());
  
  return {
    earliest: datesWithValues[0] || null,
    latest: datesWithValues[datesWithValues.length - 1] || null
  };
}
