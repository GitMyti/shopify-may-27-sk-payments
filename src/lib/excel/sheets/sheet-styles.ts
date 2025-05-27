
/**
 * Common Excel sheet styling utilities
 */
import * as XLSX from 'xlsx';

/**
 * Applies accounting format to a range of cells
 */
export function applyAccountingFormat(sheet: XLSX.WorkSheet, range: string): void {
  const [start, end] = range.split(':');
  
  // If there's no cell styling object, create it
  if (!sheet['!styles']) {
    sheet['!styles'] = {};
  }
  
  // Add the format definition to the range
  sheet['!styles'][range] = {
    numFmt: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)'
  };
}

/**
 * Styles the header row
 */
export function styleHeaderRow(sheet: XLSX.WorkSheet, range: string): void {
  if (!sheet['!styles']) {
    sheet['!styles'] = {};
  }
  
  sheet['!styles'][range] = {
    font: { bold: true, sz: 12 },
    fill: { fgColor: { rgb: "E6F2F0" } },
    border: {
      top: { style: 'thin', color: { rgb: "000000" } },
      bottom: { style: 'thin', color: { rgb: "000000" } }
    }
  };
}

/**
 * Styles the totals row
 */
export function styleTotalsRow(sheet: XLSX.WorkSheet, range: string): void {
  if (!sheet['!styles']) {
    sheet['!styles'] = {};
  }
  
  sheet['!styles'][range] = {
    font: { bold: true, sz: 12 },
    border: {
      top: { style: 'thin', color: { rgb: "000000" } },
      bottom: { style: 'double', color: { rgb: "000000" } }
    },
    fill: { fgColor: { rgb: "F0F0F0" } }
  };
}
