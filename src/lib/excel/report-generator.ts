/**
 * Excel report generation - main export function
 */
import * as XLSX from 'xlsx';
import { ShopReport, RapidDeliveryReport } from '../csvParser';
import { createSingleSheetReport } from './sheets/order-details-sheet';
import { createShopSummarySheet } from './sheets/summary-report-sheet';
import { createRapidDeliverySheet } from './sheets/rapid-delivery-sheet';

/**
 * Formats a date object into YYYY-MM-DD format
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets the date range from orders in the report or from CSV date range
 */
const getDateRange = (
  report: ShopReport | RapidDeliveryReport, 
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): string => {
  // If user has selected a specific date range, use that
  if (userDateRange && userDateRange.start && userDateRange.end) {
    return `${formatDate(userDateRange.start)}_to_${formatDate(userDateRange.end)}`;
  }
  
  // Otherwise, calculate from order data
  if (!report.orders || report.orders.length === 0) {
    return formatDate(new Date());
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
  
  // Format dates
  const startDate = formatDate(minDate);
  const endDate = formatDate(maxDate);
  
  // If same date, return single date, otherwise return range
  return startDate === endDate ? startDate : `${startDate}_to_${endDate}`;
};

/**
 * Exports shop report data to an Excel file
 */
export async function exportToExcel(
  report: ShopReport,
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): Promise<void> {
  try {
    const wb = XLSX.utils.book_new();
    
    // Create a single comprehensive sheet with report info and order details
    const reportSheet = createSingleSheetReport(report, userDateRange);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Shop Report');
    
    // Generate filename with shop name and date range
    const dateRange = getDateRange(report, userDateRange);
    const safeShopName = report.shopName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `Myti_${safeShopName}_${dateRange}.xlsx`;
    
    // Write the file
    XLSX.writeFile(wb, filename);
    
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw new Error('Failed to generate Excel report');
  }
}

/**
 * Exports summary of all shops' data to a single Excel file
 */
export async function exportShopsSummary(
  reports: ShopReport[],
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): Promise<void> {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create the summary sheet - pass the user date range
    const summarySheet = createShopSummarySheet(reports, userDateRange);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Shops Summary');
    
    // Generate a date range for the filename - use the first report's data
    // or the current date if no reports
    let dateRange = 'report';
    if (reports.length > 0) {
      dateRange = getDateRange(reports[0], userDateRange);
    }
    
    // Generate filename with date range
    const filename = `Myti_Shops_Summary_${dateRange}.xlsx`;
    
    // Write the file
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error('Error generating summary report:', error);
    throw new Error('Failed to generate shops summary report');
  }
}

/**
 * Exports rapid delivery report to an Excel file
 */
export async function exportRapidDeliveryToExcel(
  report: RapidDeliveryReport,
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): Promise<void> {
  try {
    const wb = XLSX.utils.book_new();
    
    // Create the rapid delivery sheet
    const reportSheet = createRapidDeliverySheet(report, userDateRange);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Rapid Delivery');
    
    // Generate filename with date
    const currentDate = formatDate(new Date());
    const filename = `Myti_Rapid_Delivery_${currentDate}.xlsx`;
    
    // Write the file
    XLSX.writeFile(wb, filename);
    
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw new Error('Failed to generate Excel report');
  }
}
