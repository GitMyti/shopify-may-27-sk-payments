
import { ShopifyOrder } from './types';
import { normalizeShopNameForDisplay } from './shop-name-utils';

/**
 * Groups Shopify orders by normalized shop name
 */
export function groupOrdersByShop(orders: ShopifyOrder[]): { [key: string]: ShopifyOrder[] } {
  const shopGroups: { [key: string]: ShopifyOrder[] } = {};
  
  // First, extract and normalize all shop names for consistency
  orders.forEach(order => {
    // Check if it's a delivery or pickup order
    const productTitle = (order['Lineitem name'] || order['Product Title'] || '').toLowerCase();
    const isDeliveryItem = 
      productTitle.includes('local delivery') || 
      productTitle.includes('pickup') ||
      productTitle.includes('rapid delivery');
    
    // Get initial shop name from vendor
    let shopName = order.Vendor || '';
    
    // For delivery items without vendor, extract from title
    if (isDeliveryItem && (!shopName || shopName.trim() === '')) {
      // Extract shop name from product title for delivery items
      if (productTitle.includes('local delivery')) {
        const parts = productTitle.split('local delivery');
        if (parts.length > 0) {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from delivery title: "${shopName}"`);
        }
      } else if (productTitle.includes('pickup')) {
        const parts = productTitle.split('pickup');
        if (parts.length > 0) {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from pickup title: "${shopName}"`);
        }
      } else if (productTitle.includes('rapid delivery')) {
        const parts = productTitle.split('rapid delivery');
        if (parts.length > 0) {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from rapid delivery title: "${shopName}"`);
        }
      }
    }
    
    // If delivery item with Myti vendor, extract from title
    if (isDeliveryItem && shopName === 'Myti') {
      // Extract shop name from product title for delivery items
      if (productTitle.includes('local delivery')) {
        const parts = productTitle.split('local delivery');
        if (parts.length > 0 && parts[0].trim() !== '') {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from Myti delivery: "${shopName}"`);
        }
      } else if (productTitle.includes('pickup')) {
        const parts = productTitle.split('pickup');
        if (parts.length > 0 && parts[0].trim() !== '') {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from Myti pickup: "${shopName}"`);
        }
      } else if (productTitle.includes('rapid delivery')) {
        const parts = productTitle.split('rapid delivery');
        if (parts.length > 0 && parts[0].trim() !== '') {
          shopName = parts[0].trim();
          console.log(`Extracted shop name from Myti rapid delivery: "${shopName}"`);
        }
      }
    }
    
    if (!shopName || shopName.trim() === '') {
      console.log('Missing shop name for order:', order.Name);
      return;
    }
    
    // Normalize shop name for display
    shopName = normalizeShopNameForDisplay(shopName);
    console.log(`Normalized shop name: "${shopName}" for order: ${order.Name}`);
    
    // Add to appropriate shop group
    if (!shopGroups[shopName]) {
      shopGroups[shopName] = [];
    }
    
    shopGroups[shopName].push(order);
  });

  return shopGroups;
}

/**
 * Groups Shopify orders by order number
 */
export function groupOrdersByOrderNumber(shopOrders: ShopifyOrder[]): { [orderNumber: string]: ShopifyOrder[] } {
  const orderGroups: { [orderNumber: string]: ShopifyOrder[] } = {};
  shopOrders.forEach(order => {
    const orderNumber = order.Name;
    if (!orderNumber) return;
    
    if (!orderGroups[orderNumber]) {
      orderGroups[orderNumber] = [];
    }
    orderGroups[orderNumber].push(order);
  });
  
  return orderGroups;
}
