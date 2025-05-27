
// Main Shopify API module - barrel exports
export type { ShopifyCredentials, ShopifyConnectionResult, ShopifyOrdersResponse } from './shopify/types';

export {
  saveShopifyCredentials,
  getShopifyCredentials,
  setCorsAccessGranted,
  getCorsAccessGranted,
  resetConnectionState,
  setDataSource,
  getDataSource
} from './shopify/credentials';

export { testShopifyConnection } from './shopify/connection';
export { fetchShopifyOrders } from './shopify/orders';
export { convertApiOrdersToShopifyOrders } from './shopify/converter';
