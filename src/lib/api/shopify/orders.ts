
import { ShopifyOrder } from '@/lib/csv/types';
import { ShopifyCredentials } from './types';
import { convertApiOrdersToShopifyOrders } from './converter';

// Fetch all pages of orders using backend endpoint
export const fetchShopifyOrders = async (
  credentials: ShopifyCredentials,
  dateRange?: { start: Date; end: Date }
): Promise<ShopifyOrder[]> => {
  try {
    console.log('Fetching orders from Shopify API via backend');

    // Build URL parameters
    const params = new URLSearchParams({
      accessToken: credentials.accessToken
    });

    // Add date range filter if provided
    if (dateRange && dateRange.start && dateRange.end) {
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
    }
    
    console.log('Sending orders request to /api/shopify/orders');
    
    const response = await fetch(`/api/shopify/orders?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(60000) // Longer timeout for orders
    });
    
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error(`API request failed: ${response.status}`, errorData);
        throw new Error(errorData.error || errorMessage);
      } catch (textError) {
        throw new Error(errorMessage);
      }
    }
    
    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.orders)) {
      throw new Error(data.error || "Invalid response format from backend");
    }
    
    const orders = data.orders;
    console.log(`Successfully fetched ${orders.length} orders from backend`);
    
    if (orders.length === 0) {
      throw new Error("No orders found. The API connection may have failed.");
    }
    
    // Convert API orders to our ShopifyOrder format
    return convertApiOrdersToShopifyOrders(orders);
    
  } catch (error: any) {
    console.error('Error fetching Shopify orders:', error);
    throw error;
  }
};
