
import { ShopifyOrder } from '@/lib/csv/types';

// Convert API response to our data model
export const convertApiOrdersToShopifyOrders = (apiOrders: any[]): ShopifyOrder[] => {
  const shopifyOrders: ShopifyOrder[] = [];
  
  apiOrders.forEach(order => {
    // Extract refund info for easier lookup
    const refundedLineItemMap = new Map<number, number>();
    
    if (order.refunds && Array.isArray(order.refunds)) {
      order.refunds.forEach((refund: any) => {
        if (refund.refund_line_items && Array.isArray(refund.refund_line_items)) {
          refund.refund_line_items.forEach((refundItem: any) => {
            const currentRefunded = refundedLineItemMap.get(refundItem.line_item_id) || 0;
            refundedLineItemMap.set(refundItem.line_item_id, currentRefunded + refundItem.quantity);
          });
        }
      });
    }
    
    // Process each line item
    if (order.line_items && Array.isArray(order.line_items)) {
      order.line_items.forEach((item: any, index: number) => {
        // Check if this item has any refunds
        const refundedQuantity = refundedLineItemMap.get(item.id) || 0;
        const isRefunded = refundedQuantity > 0;
        
        // Create a ShopifyOrder object for each line item
        const shopifyOrder: ShopifyOrder = {
          Name: order.name || '',
          'Created at': order.created_at || '',
          'Paid at': order.processed_at || '',
          'Lineitem name': `${item.title || ''} (item ${index + 1}/${order.line_items.length})`,
          'Lineitem price': item.price || '0',
          'Lineitem quantity': String(item.quantity || 0),
          'Lineitem fulfillment status': item.fulfillment_status || '',
          'Product Title': item.title || '',
          'Financial Status': isRefunded ? 
            (refundedQuantity === item.quantity ? 'refunded' : 'partially_refunded') : 
            order.financial_status || '',
          'Vendor': item.vendor || order.vendor || '',
          'Billing Name': `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
          // API-specific fields for enhanced return detection
          'Refunded': isRefunded ? 'true' : 'false',
          'Refunded Quantity': String(refundedQuantity),
          'Line Item ID': String(item.id || '')
        };
        
        shopifyOrders.push(shopifyOrder);
      });
    }
  });
  
  return shopifyOrders;
};
