
import * as XLSX from 'xlsx';
import { ShopReport } from '@/lib/csv/types';
import { styleHeaderRow, styleTotalsRow, applyAccountingFormat } from './sheet-styles';
import { formatDate, formatCurrency } from '../formatters';

/**
 * Creates a summary sheet with totals from all shops
 */
export function createShopSummarySheet(
  reports: ShopReport[], 
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): XLSX.WorkSheet {
  // Create title with date info
  const today = new Date();
  const generatedDate = formatDate(today);
  
  let titleText = `Myti Shop Summary Report - Generated on ${generatedDate}`;
  let dateRangeText = '';
  
  // Add date range to title if available
  if (userDateRange && userDateRange.start && userDateRange.end) {
    dateRangeText = `Report Period: ${formatDate(userDateRange.start)} to ${formatDate(userDateRange.end)}`;
  }
  
  // Prepare the data for the sheet
  const titleRow = [titleText];
  const dateRangeRow = dateRangeText ? [dateRangeText] : [];
  const emptyRow = [''];
  const headerRow = ['Shop Name', 'Gross Sales ($)', 'Returns ($)', 'Commission ($)', 'Rapid Delivery ($)', 'Total Payment ($)', 'Net Payment ($)'];
  
  // Create shop data rows - ensure all values are numbers for calculations
  const shopRows = reports.map(report => {
    // Calculate Rapid Delivery charges
    const rapidDeliveryOrders = report.orders.filter(order => order.isDeliveryCharge);
    const rapidDeliveryCharges = rapidDeliveryOrders.reduce((sum, order) => sum + Math.abs(order.totalPayment), 0);
    
    // Calculate net payment (total payment minus rapid delivery charges)
    const netPayment = report.summary.totalPayment - rapidDeliveryCharges;
    
    return [
      report.shopName,
      report.summary.totalGrossSales,
      report.summary.totalReturns,
      report.summary.totalCommission,
      rapidDeliveryCharges,
      report.summary.totalPayment,
      netPayment
    ];
  });
  
  // Create totals row data with explicit number conversions to ensure proper addition
  const totals = shopRows.reduce(
    (acc, row) => [
      'GRAND TOTAL',
      Number(acc[1]) + Number(row[1]), 
      Number(acc[2]) + Number(row[2]), 
      Number(acc[3]) + Number(row[3]), 
      Number(acc[4]) + Number(row[4]),
      Number(acc[5]) + Number(row[5]),
      Number(acc[6]) + Number(row[6])
    ],
    ['GRAND TOTAL', 0, 0, 0, 0, 0, 0]
  );
  
  // Combine all data
  const titleRows = [titleRow, dateRangeText ? dateRangeRow : [], emptyRow];
  const sheetData = [...titleRows, headerRow, ...shopRows, totals];
  
  // Create the worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
  // Apply formatting
  // Title styling
  const titleRowIndex = 0;
  worksheet['!merges'] = [{ 
    s: { r: titleRowIndex, c: 0 }, 
    e: { r: titleRowIndex, c: 6 } 
  }];
  
  // Initialize styles object if it doesn't exist
  if (!worksheet['!styles']) {
    worksheet['!styles'] = {};
  }
  
  // Style title
  worksheet['!styles'][`A1:G1`] = {
    font: { bold: true, sz: 16 },
    alignment: { horizontal: 'center' }
  };
  
  if (dateRangeText) {
    // Date range styling - merge cells
    worksheet['!merges'].push({ 
      s: { r: titleRowIndex + 1, c: 0 }, 
      e: { r: titleRowIndex + 1, c: 6 } 
    });
    
    worksheet['!styles'][`A2:G2`] = {
      font: { italic: true, sz: 12 },
      alignment: { horizontal: 'center' }
    };
  }
  
  // Calculate the header row index based on the number of title rows
  const headerRowIndex = titleRows.length;
  
  // Header row styling
  styleHeaderRow(worksheet, `A${headerRowIndex + 1}:G${headerRowIndex + 1}`);
  
  // Apply accounting format to numeric columns (all columns except shop name)
  const dataStartRow = headerRowIndex + 2; // +1 for header, +1 for 1-indexing
  const lastDataRow = dataStartRow + shopRows.length - 1;
  
  // Apply accounting format explicitly to all numeric columns
  // This formats numbers as currency with dollar signs
  for (let col = 1; col <= 6; col++) { // Columns B through G
    const colLetter = String.fromCharCode(65 + col); // B, C, D, E, F, G
    applyAccountingFormat(worksheet, `${colLetter}${dataStartRow}:${colLetter}${lastDataRow + 1}`);
  }
  
  // Bold shop names and apply alternating row colors
  for (let i = 0; i < shopRows.length; i++) {
    const rowIndex = dataStartRow + i;
    
    // Bold all shop names
    if (!worksheet['!styles'][`A${rowIndex}`]) {
      worksheet['!styles'][`A${rowIndex}`] = {};
    }
    worksheet['!styles'][`A${rowIndex}`] = {
      font: { bold: true }
    };
    
    // Apply alternate row colors
    if (i % 2 === 1) { // Odd rows (2nd, 4th, etc.)
      if (!worksheet['!styles'][`A${rowIndex}:G${rowIndex}`]) {
        worksheet['!styles'][`A${rowIndex}:G${rowIndex}`] = {};
      }
      worksheet['!styles'][`A${rowIndex}:G${rowIndex}`] = {
        fill: { fgColor: { rgb: "F0F7F4" } } // Light Myti green
      };
      
      // Ensure shop name stays bold with the background color
      if (!worksheet['!styles'][`A${rowIndex}`]) {
        worksheet['!styles'][`A${rowIndex}`] = {};
      }
      worksheet['!styles'][`A${rowIndex}`].font = { bold: true };
      if (worksheet['!styles'][`A${rowIndex}:G${rowIndex}`].fill) {
        worksheet['!styles'][`A${rowIndex}`].fill = worksheet['!styles'][`A${rowIndex}:G${rowIndex}`].fill;
      }
    }
  }
  
  // Style the totals row
  styleTotalsRow(worksheet, `A${lastDataRow + 1}:G${lastDataRow + 1}`);
  
  // Set column widths
  worksheet['!cols'] = [
    { width: 30 }, // Shop name
    { width: 15 }, // Gross Sales
    { width: 15 }, // Returns
    { width: 15 }, // Commission
    { width: 15 }, // Rapid Delivery
    { width: 15 }, // Total Payment
    { width: 15 }, // Net Payment
  ];
  
  return worksheet;
}
