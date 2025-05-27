
import { ShopCommission } from '../excel/types';
import { normalizeShopNameForComparison } from './shop-name-utils';

/**
 * Creates a map of normalized shop names to commission percentages
 */
export function createCommissionMap(customCommissions?: ShopCommission[]): Map<string, number> {
  const commissionMap = new Map<string, number>();
  if (customCommissions) {
    customCommissions.forEach(commission => {
      commissionMap.set(normalizeShopNameForComparison(commission.shopName), commission.commissionPercentage);
    });
  }
  
  return commissionMap;
}

/**
 * Gets the commission percentage for a shop
 */
export function getCommissionPercentage(shopName: string, commissionMap: Map<string, number>): number {
  // Default to 10% commission
  let commissionPercentage = 10;
  
  // Look for custom commission by normalized shop name
  const normalizedShopName = normalizeShopNameForComparison(shopName);
  if (commissionMap.has(normalizedShopName)) {
    commissionPercentage = commissionMap.get(normalizedShopName)!;
    console.log(`Found custom commission for ${shopName}: ${commissionPercentage}%`);
  }
  
  return commissionPercentage;
}
