
import { ShopifyOrder } from '@/lib/csv/types';
import { ShopCommission } from '@/lib/excelParser';
import { processOrderData, processRapidDeliveries } from '@/lib/csv';
import { toast } from 'sonner';

interface ProcessOrdersResult {
  shopReports: any[];
  rapidDeliveryReport: any;
}

/**
 * Process Shopify API orders using the same logic as CSV processing
 */
export const processShopifyOrders = (
  orders: ShopifyOrder[],
  commissions: ShopCommission[]
): ProcessOrdersResult => {
  if (!orders || orders.length === 0) {
    return {
      shopReports: [],
      rapidDeliveryReport: { orders: [], summary: { totalDeliveries: 0, totalCharges: 0, byShop: {} } }
    };
  }
  
  try {
    // Process shop reports using the existing CSV logic
    const shopReports = processOrderData(orders, commissions);
    
    // Process rapid delivery reports using the existing logic
    const rapidDeliveryReport = processRapidDeliveries(orders);
    
    // Return both reports in a structured way
    return {
      shopReports,
      rapidDeliveryReport
    };
  } catch (error) {
    console.error('Error processing Shopify API orders:', error);
    toast.error('Failed to process Shopify orders');
    return {
      shopReports: [],
      rapidDeliveryReport: { orders: [], summary: { totalDeliveries: 0, totalCharges: 0, byShop: {} } }
    };
  }
};

/**
 * Extract date range from orders
 * Reuses the existing date extraction logic
 */
export const extractApiOrderDateRange = (orders: ShopifyOrder[]) => {
  if (!orders || orders.length === 0) {
    return { earliest: null, latest: null };
  }
  
  try {
    // Import and use the existing extractDateRange function
    const { extractDateRange } = require('@/lib/csv');
    return extractDateRange(orders);
  } catch (error) {
    console.error('Error extracting date range from API orders:', error);
    return { earliest: null, latest: null };
  }
};
