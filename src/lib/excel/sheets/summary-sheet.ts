
/**
 * Excel summary sheet generator
 */
import * as XLSX from 'xlsx';
import { ShopReport } from '../../csvParser';
import { applyAccountingFormat } from './sheet-styles';
import { formatCurrency } from '../formatters';

/**
 * Creates the summary sheet
 */
export function createSummarySheet(report: ShopReport): XLSX.WorkSheet {
  const summaryData = [
    ['Summary'],
    ['', ''],
    ['Gross Sales', formatCurrency(report.summary.totalGrossSales)],
    ['Returns', formatCurrency(report.summary.totalReturns)],
    [`Commission (${report.orders[0]?.commissionPercentage || 10}%)`, formatCurrency(report.summary.totalCommission)],
    ['Total Payment', formatCurrency(report.summary.totalPayment)],
    ['Total Orders', report.summary.totalOrders],
    ['Total Items', report.summary.totalQuantity],
    ['', ''],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  const summaryColWidth = [{ wch: 30 }, { wch: 15 }];
  summarySheet['!cols'] = summaryColWidth;
  
  // Apply styles to the Summary header cell
  if (summarySheet.A1) {
    summarySheet.A1.s = { 
      font: { bold: true, sz: 14 }, 
      fill: { fgColor: { rgb: "005946" } }, 
      color: { rgb: "FFFFFF" } 
    };
  }
  
  // Apply accounting format to numeric cells
  applyAccountingFormat(summarySheet, 'B3:B6');
  
  return summarySheet;
}
