
/**
 * Utilities for parsing commission data from Excel files
 */
import * as XLSX from 'xlsx';
import { ShopCommission } from './types';

/**
 * Parses an Excel file containing shop commission data
 */
export function parseCommissionExcel(file: File): Promise<ShopCommission[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('Excel file has no sheets'));
          return;
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (jsonData.length === 0) {
          reject(new Error('Excel file has no data rows'));
          return;
        }
        
        console.log('First row of Excel data:', jsonData[0]);
        console.log('Available columns:', Object.keys(jsonData[0]));
        
        const commissions: ShopCommission[] = [];
        
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          const shopNameColumn = Object.keys(row).find(key => 
            /shop\s*name|shop|name|vendor|product_vendor/i.test(key)
          );
          
          const commissionColumn = Object.keys(row).find(key => 
            /commission|rate|percentage/i.test(key)
          );
          
          if (!shopNameColumn || !commissionColumn) {
            console.warn(`Row ${i + 1}: Could not identify required columns`, { 
              availableColumns: Object.keys(row),
              foundShopColumn: shopNameColumn,
              foundCommissionColumn: commissionColumn
            });
            continue;
          }
          
          const shopName = row[shopNameColumn];
          let commissionPercentage: number;
          
          if (typeof row[commissionColumn] === 'string') {
            commissionPercentage = parseFloat(row[commissionColumn].replace('%', ''));
          } else {
            commissionPercentage = parseFloat(row[commissionColumn]);
            
            if (commissionPercentage > 0 && commissionPercentage < 1) {
              commissionPercentage = commissionPercentage * 100;
            }
          }
          
          if (!shopName || isNaN(commissionPercentage)) {
            console.warn(`Row ${i + 1}: Invalid data`, { 
              shopName, 
              rawCommission: row[commissionColumn],
              parsedCommission: commissionPercentage
            });
            continue;
          }
          
          commissions.push({ shopName, commissionPercentage });
        }
        
        if (commissions.length === 0) {
          reject(new Error('Could not find any valid commission data. Please ensure your Excel file has columns for shop name and commission percentage.'));
          return;
        }
        
        console.log('Successfully parsed commissions:', commissions);
        resolve(commissions);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error(`Failed to process the Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generates an example commission Excel file
 */
export function generateExampleCommissionFile(): void {
  const exampleData = [
    { 'Shop Name': 'Shop A', 'Commission %': 10 },
    { 'Shop Name': 'Shop B', 'Commission %': 15 },
    { 'Shop Name': 'Shop C', 'Commission %': 12.5 }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(exampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Commission Rates');
  
  XLSX.writeFile(workbook, 'commission_rates_template.xlsx');
}
