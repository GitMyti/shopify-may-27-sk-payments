
import { ShopifyOrder, RapidDeliveryOrder, RapidDeliverySummary, RapidDeliveryReport } from './types';
import { normalizeShopNameForComparison, normalizeShopNameForDisplay } from './processor';

// Constant for the delivery charge
export const RAPID_DELIVERY_CHARGE = 7;

/**
 * Extract shop name from delivery item title
 */
function extractShopName(productTitle: string, vendor?: string): string {
  if (!productTitle) return 'Unknown Shop';
  
  const normalizedTitle = productTitle.toLowerCase();
  
  console.log('Attempting to extract shop name from:', productTitle);
  
  // First try to extract from product title which is more reliable for rapid delivery orders
  if (normalizedTitle.includes('local delivery')) {
    const shopName = normalizedTitle.split('local delivery')[0].trim();
    console.log(`Extracted shop name from local delivery: "${shopName}"`);
    return normalizeShopNameForDisplay(shopName);
  }
  
  if (normalizedTitle.includes('pickup')) {
    const shopName = normalizedTitle.split('pickup')[0].trim();
    console.log(`Extracted shop name from pickup: "${shopName}"`);
    return normalizeShopNameForDisplay(shopName);
  }
  
  // Add support for "Rapid Delivery" in product titles
  if (normalizedTitle.includes('rapid delivery')) {
    const shopName = normalizedTitle.split('rapid delivery')[0].trim();
    console.log(`Extracted shop name from rapid delivery: "${shopName}"`);
    return normalizeShopNameForDisplay(shopName);
  }
  
  // If we couldn't extract from title and have a vendor, use that as fallback
  if (vendor && vendor.trim() !== '') {
    console.log(`Using vendor as fallback: "${vendor}"`);
    return normalizeShopNameForDisplay(vendor);
  }
  
  // Fallback to word-based extraction if the above methods fail
  const titleParts = normalizedTitle.split(' ');
  const localIndex = titleParts.indexOf('local');
  const pickupIndex = titleParts.indexOf('pickup');
  const rapidIndex = titleParts.indexOf('rapid');
  
  // Use the first occurrence of either "local", "pickup", or "rapid"
  const endIndex = Math.min(
    localIndex !== -1 ? localIndex : Number.MAX_SAFE_INTEGER,
    pickupIndex !== -1 ? pickupIndex : Number.MAX_SAFE_INTEGER,
    rapidIndex !== -1 ? rapidIndex : Number.MAX_SAFE_INTEGER
  );
  
  if (endIndex !== Number.MAX_SAFE_INTEGER) {
    // Take all words before "local", "pickup", or "rapid" and normalize them
    const extractedName = titleParts.slice(0, endIndex).join(' ');
    console.log(`Word-based extraction result: "${extractedName}"`);
    return normalizeShopNameForDisplay(extractedName);
  }
  
  console.warn('Could not extract shop name from product title:', productTitle);
  return 'Unknown Shop';
}

/**
 * Process rapid delivery orders from Shopify CSV data
 */
export function processRapidDeliveries(orders: ShopifyOrder[]): RapidDeliveryReport {
  console.log('Processing rapid deliveries from', orders.length, 'orders');
  
  // Debug: Log all product titles to check for delivery keywords
  console.log("All product titles:", orders.map(order => order['Lineitem name'] || order['Product Title'] || '').filter(Boolean));
  
  // Filter orders that are rapid deliveries - look for any orders with delivery keywords
  // Don't restrict by vendor - look at the product title only
  const rapidDeliveryOrders = orders
    .filter(order => {
      const productTitle = (order['Lineitem name'] || order['Product Title'] || '').toLowerCase();
      const hasDeliveryKeyword = 
        productTitle.includes('local delivery') || 
        productTitle.includes('pickup') ||
        productTitle.includes('rapid delivery'); // Add support for "Rapid Delivery"
      
      // Debug logging
      if (hasDeliveryKeyword) {
        console.log(`Found delivery order: #${order.Name} with title "${productTitle}" from ${order.Vendor}`);
      }
      
      return hasDeliveryKeyword;
    })
    .map(order => processRapidDeliveryOrder(order));
  
  console.log(`Found ${rapidDeliveryOrders.length} rapid delivery orders`);
  
  // Log all found rapid delivery shops for debugging
  const shopsFound = rapidDeliveryOrders.map(order => order.shopName);
  const uniqueShops = [...new Set(shopsFound)];
  console.log('Rapid delivery shops found:', uniqueShops);
  
  // Debug: Log all shop names with their normalized versions
  uniqueShops.forEach(shop => {
    console.log(`Shop: "${shop}" -> normalized: "${normalizeShopNameForComparison(shop)}"`);
  });
  
  // Sort orders chronologically
  rapidDeliveryOrders.sort((a, b) => {
    return new Date(a.orderDate || '').getTime() - new Date(b.orderDate || '').getTime();
  });
  
  // Create per-shop summaries
  const byShop: { [shopName: string]: { totalDeliveries: number; totalCharges: number } } = {};
  
  rapidDeliveryOrders.forEach(order => {
    if (!order.shopName) return;
    
    if (!byShop[order.shopName]) {
      byShop[order.shopName] = {
        totalDeliveries: 0,
        totalCharges: 0
      };
    }
    
    byShop[order.shopName].totalDeliveries++;
    byShop[order.shopName].totalCharges += order.deliveryCharge;
  });
  
  // Calculate overall summary
  const summary: RapidDeliverySummary = {
    totalDeliveries: rapidDeliveryOrders.length,
    totalCharges: rapidDeliveryOrders.reduce((total, order) => total + order.deliveryCharge, 0),
    byShop
  };
  
  console.log('Rapid delivery shop summary:', byShop);
  
  return {
    orders: rapidDeliveryOrders,
    summary
  };
}

/**
 * Process a single rapid delivery order
 */
function processRapidDeliveryOrder(order: ShopifyOrder): RapidDeliveryOrder {
  const productTitle = order['Lineitem name'] || order['Product Title'] || '';
  const paidAt = order['Paid at'] ? order['Paid at'].split(' ')[0] : '';
  const createdAt = order['Created at'] ? order['Created at'].split(' ')[0] : '';
  
  // Extract shop name from product title
  const shopName = extractShopName(productTitle, order.Vendor);
  
  // Log the processed order for debugging
  console.log(`Processed rapid delivery order: #${order.Name} for shop "${shopName}" with title "${productTitle}"`);
  
  return {
    orderNumber: order.Name || '',
    orderDate: paidAt || createdAt,
    billingName: order['Billing Name'] || '',
    deliveryName: order['Shipping Name'] || '',
    deliveryCharge: RAPID_DELIVERY_CHARGE,
    shopName
  };
}
