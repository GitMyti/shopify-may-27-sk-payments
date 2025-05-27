
// Re-export from the excel folder
export { parseCommissionExcel, generateExampleCommissionFile } from './excel/commission-parser';
export { exportToExcel } from './excel/report-generator';
export type { ShopCommission } from './excel/types';

// Import the type first, then use it
import { ShopCommission } from './excel/types';

// Add default commission data
export const DEFAULT_COMMISSIONS: ShopCommission[] = [
  { shopName: 'Vintage Finds', commissionPercentage: 10 },
  { shopName: 'Artisan Crafts', commissionPercentage: 12 },
  { shopName: 'Local Goods', commissionPercentage: 8 },
  { shopName: 'Handmade Essentials', commissionPercentage: 15 },
  { shopName: 'Eco Friendly Products', commissionPercentage: 10 }
];
