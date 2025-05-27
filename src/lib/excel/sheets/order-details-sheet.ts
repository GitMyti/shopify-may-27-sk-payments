
import * as XLSX from 'xlsx';
import { ShopReport } from '@/lib/csv/types';
import { styleHeaderRow, styleTotalsRow, applyAccountingFormat } from './sheet-styles';
import { formatDate } from '../formatters';

/**
 * Creates a comprehensive report sheet with order details and summary
 */
export function createSingleSheetReport(
  report: ShopReport, 
  userDateRange?: { start: Date | undefined; end: Date | undefined }
): XLSX.WorkSheet {
  // Get shop information
  const shopName = report.shopName;
  const today = new Date();
  const generatedDate = formatDate(today);
  
  // Format title with date info
  let titleText = `${shopName} - Shop Report (Generated on ${generatedDate})`;
  let dateRangeText = '';
  
  // Add date range to title if available
  if (userDateRange && userDateRange.start && userDateRange.end) {
    dateRangeText = `Report Period: ${formatDate(userDateRange.start)} to ${formatDate(userDateRange.end)}`;
  }
  
  // Create title rows
  const titleRow = [titleText];
  const dateRangeRow = dateRangeText ? [dateRangeText] : [];
  const emptyRow = [''];
  
  // Create summary section
  const summaryTitle = ['Summary'];
  const summaryHeaders = ['Metric', 'Value'];
  
  // Calculate Rapid Delivery charges
  const rapidDeliveryOrders = report.orders.filter(order => order.isDeliveryCharge);
  const rapidDeliveryCharges = rapidDeliveryOrders.reduce((sum, order) => sum + Math.abs(order.totalPayment), 0);
  
  // Calculate net payment (total payment minus rapid delivery charges)
  const netPayment = report.summary.totalPayment - rapidDeliveryCharges;
  
  const summaryRows = [
    ['Total Orders', report.summary.totalOrders.toString()],
    ['Total Quantity', report.summary.totalQuantity.toString()],
    ['Gross Sales', report.summary.totalGrossSales],
    ['Returns', report.summary.totalReturns],
    ['Net Sales', report.summary.totalNetSales],
    ['Commission', report.summary.totalCommission],
    ['Rapid Delivery Charges', rapidDeliveryCharges],
    ['Total Payment', report.summary.totalPayment],
    ['Net Payment (after delivery charges)', netPayment]
  ];
  
  // Create orders section
  const ordersTitle = ['Order Details'];
  const ordersHeader = [
    'Order #', 'Date', 'Product Title', 'Quantity', 'Gross Sales', 
    'Returns', 'Net Sales', 'Commission %', 'Commission Amount', 'Payment'
  ];
  
  // Create order detail rows
  const orderRows = report.orders.map(order => [
    order.orderNumber,
    order.orderDate,
    order.productTitle,
    order.quantity,
    order.grossSales,
    order.returns,
    order.netSales,
    order.commissionPercentage,
    order.commissionAmount,
    order.totalPayment,
  ]);
  
  // Add totals row for orders
  const totalsRow = [
    'TOTAL', '', '', 
    report.summary.totalQuantity,
    report.summary.totalGrossSales,
    report.summary.totalReturns,
    report.summary.totalNetSales,
    '', 
    report.summary.totalCommission,
    report.summary.totalPayment
  ];
  
  // Combine all sections to create the full sheet content
  // Fix TypeScript error by ensuring everything is properly typed as arrays
  const titleRows: (string | number)[][] = [titleRow];
  if (dateRangeText) titleRows.push(dateRangeRow);
  titleRows.push(emptyRow);
  
  const summarySectionRows: (string | number)[][] = [summaryTitle, summaryHeaders, ...summaryRows, emptyRow];
  const ordersSectionRows: (string | number)[][] = [ordersTitle, ordersHeader, ...orderRows, totalsRow];
  
  const allRows: (string | number)[][] = [...titleRows, ...summarySectionRows, ...ordersSectionRows];
  
  // Create worksheet with properly typed arrays
  const worksheet = XLSX.utils.aoa_to_sheet(allRows);
  
  // Apply styling
  if (!worksheet['!styles']) {
    worksheet['!styles'] = {};
  }
  
  // Title styling
  worksheet['!merges'] = [];
  
  // Merge cells for title
  worksheet['!merges'].push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: 9 }
  });
  
  // Style title
  worksheet['!styles']['A1:J1'] = {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: 'center' }
  };
  
  // Date range styling
  if (dateRangeText) {
    worksheet['!merges'].push({
      s: { r: 1, c: 0 },
      e: { r: 1, c: 9 }
    });
    
    worksheet['!styles']['A2:J2'] = {
      font: { italic: true },
      alignment: { horizontal: 'center' }
    };
  }
  
  // Calculate row indices for the different sections
  const summaryTitleRow = titleRows.length;
  const summaryHeaderRow = summaryTitleRow + 1;
  const summaryDataStartRow = summaryHeaderRow + 1;
  const summaryDataEndRow = summaryDataStartRow + summaryRows.length - 1;
  
  const ordersTitleRow = summarySectionRows.length + titleRows.length;
  const ordersHeaderRow = ordersTitleRow + 1;
  const ordersDataStartRow = ordersHeaderRow + 1;
  const ordersDataEndRow = ordersDataStartRow + orderRows.length - 1;
  const ordersTotalsRow = ordersDataEndRow + 1;
  
  // Style summary title
  worksheet['!styles'][`A${summaryTitleRow}:B${summaryTitleRow}`] = {
    font: { bold: true, sz: 12 }
  };
  
  // Style summary headers
  styleHeaderRow(worksheet, `A${summaryHeaderRow}:B${summaryHeaderRow}`);
  
  // Style summary data - apply accounting format to money columns
  applyAccountingFormat(worksheet, `B${summaryDataStartRow + 2}:B${summaryDataEndRow}`);
  
  // Style orders title
  worksheet['!styles'][`A${ordersTitleRow}:J${ordersTitleRow}`] = {
    font: { bold: true, sz: 12 }
  };
  
  // Style orders header
  styleHeaderRow(worksheet, `A${ordersHeaderRow}:J${ordersHeaderRow}`);
  
  // Style orders totals row
  styleTotalsRow(worksheet, `A${ordersTotalsRow}:J${ordersTotalsRow}`);
  
  // Apply accounting format to money columns in orders
  for (const col of ['E', 'F', 'G', 'I', 'J']) {
    applyAccountingFormat(worksheet, `${col}${ordersDataStartRow}:${col}${ordersTotalsRow}`);
  }
  
  // Set column widths
  worksheet['!cols'] = [
    { width: 15 },  // Order #
    { width: 12 },  // Date
    { width: 40 },  // Product
    { width: 10 },  // Quantity
    { width: 15 },  // Gross Sales
    { width: 15 },  // Returns
    { width: 15 },  // Net Sales
    { width: 15 },  // Commission %
    { width: 15 },  // Commission Amount
    { width: 15 },  // Payment
  ];
  
  return worksheet;
}
