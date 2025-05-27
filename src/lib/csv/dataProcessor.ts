
import { ShopifyOrder } from './types';

/**
 * Process the CSV data to ensure all required fields are available
 * and correctly formatted
 */
export function processCSVData(orders: ShopifyOrder[]): ShopifyOrder[] {
  console.log(`Processing ${orders.length} orders from CSV`);
  
  // Log the first few orders for debugging
  console.log('Sample of first 3 orders:', orders.slice(0, 3));
  
  // Check for financial status values
  const financialStatuses = new Set<string>();
  orders.forEach(order => {
    if (order['Financial Status']) {
      financialStatuses.add(order['Financial Status']);
    }
  });
  console.log('Financial Status values found:', Array.from(financialStatuses));
  
  // Check for fulfillment status values
  const fulfillmentStatuses = new Set<string>();
  orders.forEach(order => {
    if (order['Lineitem fulfillment status']) {
      fulfillmentStatuses.add(order['Lineitem fulfillment status']);
    }
  });
  console.log('Lineitem fulfillment status values found:', Array.from(fulfillmentStatuses));
  
  // Check for rapid delivery orders
  const deliveryOrders = identifyDeliveryOrders(orders);
  logDeliveryOrderDetails(deliveryOrders);
  
  // Map of order numbers to their vendor (shop) to ensure consistency
  const orderToShopMap = buildOrderToShopMap(orders);
  
  // Second pass - ensure all orders have the correct shop and handle defaults
  return normalizeOrderData(orders, orderToShopMap);
}

/**
 * Identify orders that are for local delivery or pickup
 */
function identifyDeliveryOrders(orders: ShopifyOrder[]): ShopifyOrder[] {
  return orders.filter(order => {
    const productTitle = (order['Lineitem name'] || order['Product Title'] || '').toLowerCase();
    return productTitle.includes('local delivery') || productTitle.includes('pickup');
  });
}

/**
 * Log details about delivery orders, grouped by shop
 */
function logDeliveryOrderDetails(deliveryOrders: ShopifyOrder[]): void {
  // Group delivery orders by shop for better debugging
  const deliveryByShop = deliveryOrders.reduce((acc, order) => {
    const productTitle = (order['Lineitem name'] || order['Product Title'] || '').toLowerCase();
    let shopName = 'Unknown';
    
    // Extract shop name from product title
    if (productTitle.includes('local delivery')) {
      shopName = productTitle.split('local delivery')[0].trim();
    } else if (productTitle.includes('pickup')) {
      shopName = productTitle.split('pickup')[0].trim();
    } else if (order.Vendor) {
      shopName = order.Vendor;
    }
    
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(order);
    return acc;
  }, {} as Record<string, ShopifyOrder[]>);
  
  console.log(`Found ${deliveryOrders.length} potential Myti Rapid Delivery orders across ${Object.keys(deliveryByShop).length} shops`);
  console.log('Delivery orders by shop:', Object.keys(deliveryByShop).map(shop => `${shop}: ${deliveryByShop[shop].length}`));
}

/**
 * Build a map of order numbers to shop names for consistency
 */
function buildOrderToShopMap(orders: ShopifyOrder[]): Map<string, string> {
  const orderToShopMap = new Map<string, string>();
  
  // First pass - build the order-to-shop mapping
  orders.forEach(order => {
    const orderNumber = order.Name;
    const shopName = order.Vendor;
    
    if (orderNumber && shopName && !orderToShopMap.has(orderNumber)) {
      orderToShopMap.set(orderNumber, shopName);
    }
  });
  
  return orderToShopMap;
}

/**
 * Normalize order data by ensuring all required fields are present
 */
function normalizeOrderData(orders: ShopifyOrder[], orderToShopMap: Map<string, string>): ShopifyOrder[] {
  return orders.map(order => {
    const orderNumber = order.Name;
    
    // If the order doesn't have a Vendor but we have one in our map, use that
    if (orderNumber && orderToShopMap.has(orderNumber) && !order.Vendor) {
      order.Vendor = orderToShopMap.get(orderNumber)!;
    }
    
    // Fill in missing values with defaults to prevent undefined errors
    if (!order.Vendor) order.Vendor = 'Unknown Shop';
    if (!order.Name) order.Name = `Order-${Math.random().toString(36).substring(2, 10)}`;
    if (!order['Lineitem price']) order['Lineitem price'] = '0.00';
    if (!order['Lineitem quantity']) order['Lineitem quantity'] = '1';
    if (!order['Financial Status']) order['Financial Status'] = '';
    if (!order['Lineitem fulfillment status']) order['Lineitem fulfillment status'] = '';
    
    return order;
  });
}
