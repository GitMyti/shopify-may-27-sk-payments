import { ShopifyCredentials } from './types';

// Storage keys
const SHOPIFY_CREDENTIALS_KEY = 'shopify_credentials';
const DATA_SOURCE_KEY = 'data_source';
const CORS_ACCESS_GRANTED_KEY = 'cors_access_granted';

// Configuration storage
export const saveShopifyCredentials = (credentials: ShopifyCredentials): void => {
  // Ensure we're always using the correct shopify URL with HTTPS
  credentials.shopUrl = 'https://sustainlocal.myshopify.com';
  localStorage.setItem(SHOPIFY_CREDENTIALS_KEY, JSON.stringify(credentials));
};

export const getShopifyCredentials = (): ShopifyCredentials | null => {
  const stored = localStorage.getItem(SHOPIFY_CREDENTIALS_KEY);
  if (!stored) return null;
  
  try {
    const creds = JSON.parse(stored) as ShopifyCredentials;
    // Ensure we're always using the correct shopify URL with HTTPS
    creds.shopUrl = 'https://sustainlocal.myshopify.com';
    return creds;
  } catch (error) {
    console.error('Error parsing Shopify credentials:', error);
    return null;
  }
};

// Track CORS access state (keeping for backward compatibility, but not needed with backend)
export const setCorsAccessGranted = (granted: boolean): void => {
  localStorage.setItem(CORS_ACCESS_GRANTED_KEY, String(granted));
};

export const getCorsAccessGranted = (): boolean => {
  // Always return true since we're using backend endpoints
  return true;
};

// Reset connection state for troubleshooting
export const resetConnectionState = (): void => {
  localStorage.removeItem(CORS_ACCESS_GRANTED_KEY);
  console.log('Connection state reset');
};

// Detect if we're using API or CSV data source
export const setDataSource = (source: 'api' | 'csv'): void => {
  localStorage.setItem(DATA_SOURCE_KEY, source);
};

export const getDataSource = (): 'api' | 'csv' => {
  // Default to 'api' instead of 'csv'
  return (localStorage.getItem(DATA_SOURCE_KEY) as 'api' | 'csv') || 'api';
};
