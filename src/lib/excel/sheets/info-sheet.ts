
/**
 * Excel info sheet generator
 */
import * as XLSX from 'xlsx';
import { ShopReport } from '../../csvParser';

/**
 * Gets the date range string from orders
 */
const getDateRangeString = (report: ShopReport): string => {
  if (!report.orders || report.orders.length === 0) {
    return "No orders";
  }
  
  // Parse dates from orders - use paidAt date if available
  const dates = report.orders.map(order => {
    // First try paidAt, then fall back to orderDate
    const dateString = order.paidAt || order.orderDate;
    return new Date(dateString);
  });
  
  // Find min and max dates
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Format dates for display
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
  
  const startDate = formatDate(minDate);
  const endDate = formatDate(maxDate);
  
  // If same date, return single date, otherwise return range
  return startDate === endDate ? startDate : `${startDate} to ${endDate}`;
};

/**
 * Creates the report info sheet
 */
export function createReportInfoSheet(report: ShopReport): XLSX.WorkSheet {
  const dateRangeStr = getDateRangeString(report);
  
  const logoSheet = XLSX.utils.aoa_to_sheet([
    ['Myti - Local is mighty because we care'],
    ['Partner Shop Report'],
    [`${report.shopName}`],
    [`Date range: ${dateRangeStr}`],
    [`Generated on ${new Date().toLocaleDateString()}`],
    [''],
  ]);
  
  const logoColWidth = [{ wch: 50 }];
  logoSheet['!cols'] = logoColWidth;
  
  return logoSheet;
}
