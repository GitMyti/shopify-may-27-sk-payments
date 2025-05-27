
import { ShopifyOrder, ShopReport, ShopOrder } from './types';
import { ShopCommission } from '../excel/types';
import { calculateSummary, createInitialSummary } from './summary';
import { processOrder } from './orderProcessing';
import { normalizeShopNameForComparison } from './shop-name-utils';
import { groupOrdersByShop, groupOrdersByOrderNumber } from './order-grouping';
import { createCommissionMap, getCommissionPercentage } from './commission-utils';

export { normalizeShopNameForComparison } from './shop-name-utils';
export { normalizeShopNameForDisplay } from './shop-name-utils';

export function processOrderData(
  orders: ShopifyOrder[], 
  customCommissions?: ShopCommission[]
): ShopReport[] {
  console.log('Processing orders:', orders.length);
  
  // Create a map for custom commissions with normalized keys for consistent lookup
  const commissionMap = createCommissionMap(customCommissions);
  
  // Debug all commissions
  console.log('Commission map:');
  commissionMap.forEach((percentage, shop) => {
    console.log(`  ${shop}: ${percentage}%`);
  });
  
  // Group orders by shop with strict normalization
  const shopGroups = groupOrdersByShop(orders);

  console.log('Shop groups found:', Object.keys(shopGroups));
  
  // Process each shop's orders
  const reports: ShopReport[] = [];
  
  Object.entries(shopGroups).forEach(([shopName, shopOrders]) => {
    console.log(`Processing shop: ${shopName} with ${shopOrders.length} orders`);
    
    // Get commission rate for this shop
    const commissionPercentage = getCommissionPercentage(shopName, commissionMap);
    
    // Special handling for Nu Chocolat and Phoenix Books to debug
    if (shopName === 'Nu Chocolat' || shopName === 'Phoenix Books') {
      console.log(`Setting commission for ${shopName} to ${commissionPercentage}%`);
    }
    
    console.log(`Using commission rate of ${commissionPercentage}% for ${shopName}`);
    
    // Group orders by order number for multi-item processing
    const orderGroups = groupOrdersByOrderNumber(shopOrders);
    
    // Log multi-item orders for debugging
    const multiItemOrders = Object.entries(orderGroups).filter(([_, items]) => items.length > 1);
    if (multiItemOrders.length > 0) {
      console.log(`Found ${multiItemOrders.length} multi-item orders for ${shopName}:`);
      multiItemOrders.forEach(([orderNum, items]) => {
        console.log(`  Order ${orderNum}: ${items.length} items`);
        
        // Check if any items have refund status
        const refundItems = items.filter(item => {
          const status = (item['Financial Status'] || '').toLowerCase();
          return status.includes('refund');
        });
        
        // Check for "pending" or "unfulfilled" fulfillment status
        const pendingItems = items.filter(item => {
          const status = (item['Lineitem fulfillment status'] || '').toLowerCase();
          return status.includes('pending') || status.includes('unfulfilled');
        });
        
        if (refundItems.length > 0) {
          console.log(`    ⚠️ Order ${orderNum} has ${refundItems.length} items with refund status`);
        }
        
        if (pendingItems.length > 0) {
          console.log(`    ⚠️ Order ${orderNum} has ${pendingItems.length} items with pending/unfulfilled status`);
        }
        
        // Special debugging for order 4268
        if (orderNum === '4268') {
          console.log(`    DETAILED DEBUG for Order 4268:`);
          items.forEach((item, idx) => {
            console.log(`      Item ${idx+1}/${items.length}: ${item['Lineitem name']}`);
            console.log(`        Financial Status: '${item['Financial Status'] || 'not set'}'`);
            console.log(`        Lineitem fulfillment status: '${item['Lineitem fulfillment status'] || 'not set'}'`);
          });
        }
      });
    }
    
    // Process orders
    const processedOrders = shopOrders.map(order => {
      const orderNumber = order.Name;
      // Always pass ALL items for this order to handle multi-item returns correctly
      const orderItems = orderNumber ? orderGroups[orderNumber] : undefined;
      return processOrder(order, commissionPercentage, orderItems);
    });
    
    // Sort orders by number
    processedOrders.sort((a, b) => {
      return a.orderNumber.localeCompare(b.orderNumber, undefined, { numeric: true, sensitivity: 'base' });
    });
    
    // Calculate shop summary
    const summary = processedOrders.reduce(
      (acc, order) => calculateSummary(acc, order),
      createInitialSummary()
    );
    
    reports.push({
      shopName,
      orders: processedOrders,
      summary
    });
  });
  
  // Sort reports by shop name
  reports.sort((a, b) => a.shopName.localeCompare(b.shopName));
  
  return reports;
}
