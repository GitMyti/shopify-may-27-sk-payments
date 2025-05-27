
import * as XLSX from 'xlsx';
import { RapidDeliveryReport } from '@/lib/csv';
import { applyAccountingFormat, styleHeaderRow, styleTotalsRow } from './sheet-styles';
import { formatCurrency } from '../formatters';
import { format } from 'date-fns';

/**
 * Creates a sheet for rapid delivery data
 */
export function createRapidDeliverySheet(
  report: RapidDeliveryReport,
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): XLSX.WorkSheet {
  // Create header info rows
  const headerRows = [
    ['Myti - Rapid Delivery Report'],
    [`Generated on ${format(new Date(), 'MMM dd, yyyy')}`],
    [''], // Empty row for spacing
  ];
  
  // Create order table header
  const ordersHeader = [
    ['Order #', 'Date', 'Billing Name', 'Delivery Name', 'Charge']
  ];
  
  // Create order data rows
  const ordersData = report.orders.map(order => [
    order.orderNumber,
    order.orderDate,
    order.billingName,
    order.deliveryName,
    formatCurrency(order.deliveryCharge)
  ]);
  
  // Create the totals row
  const totalsRow = [
    'TOTAL', '', '', '', formatCurrency(report.summary.totalCharges)
  ];
  
  // Combine all rows for the worksheet
  const allData = [...headerRows, ...ordersHeader, ...ordersData, totalsRow];
  
  // Create the worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(allData);
  
  // Set column widths
  const colWidths = [
    { wch: 12 }, // Order #
    { wch: 12 }, // Date
    { wch: 30 }, // Billing Name
    { wch: 30 }, // Delivery Name
    { wch: 12 }, // Charge
  ];
  worksheet['!cols'] = colWidths;
  
  // Style header information
  for (let i = 0; i < 2; i++) {
    const cell = XLSX.utils.encode_cell({ r: i, c: 0 });
    if (!worksheet['!styles']) worksheet['!styles'] = {};
    worksheet['!styles'][cell] = {
      font: { bold: true, sz: i === 0 ? 14 : 12 }
    };
  }
  
  // Apply accounting format to numeric columns in the data section
  const headerRowIndex = headerRows.length;
  const totalRowIndex = allData.length - 1;
  applyAccountingFormat(worksheet, `E${headerRowIndex + 2}:E${totalRowIndex + 1}`);
  
  // Style the orders header row
  styleHeaderRow(worksheet, `A${headerRowIndex + 1}:E${headerRowIndex + 1}`);
  
  // Style the totals row with bold formatting
  styleTotalsRow(worksheet, `A${totalRowIndex + 1}:E${totalRowIndex + 1}`);
  
  return worksheet;
}
