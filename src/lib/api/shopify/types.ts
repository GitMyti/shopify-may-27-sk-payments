
// Shopify API credentials interface
export interface ShopifyCredentials {
  shopUrl: string;
  accessToken: string;
}

// API response interfaces
export interface ShopifyConnectionResult {
  success: boolean;
  error?: string;
  details?: any;
}

export interface ShopifyOrdersResponse {
  success: boolean;
  orders: any[];
  error?: string;
}
