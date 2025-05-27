
/**
 * Common Excel-related type definitions
 */
import { ShopReport } from '../csvParser';

export interface ShopCommission {
  shopName: string;
  commissionPercentage: number;
}

export interface ExcelColumnWidths {
  wch: number;
}
