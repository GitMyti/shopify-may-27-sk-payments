
import { ShopifyCredentials, ShopifyConnectionResult } from './types';
import { setCorsAccessGranted } from './credentials';

// API connection status - test if we can connect using backend endpoint
export const testShopifyConnection = async (
  credentials: ShopifyCredentials
): Promise<ShopifyConnectionResult> => {
  try {
    console.log('Testing connection to Shopify API via backend');
    
    // Validate the credentials format
    if (!credentials.accessToken) {
      console.log('Missing access token');
      return { 
        success: false, 
        error: 'Missing required Shopify access token'
      };
    }

    // Convert credentials to URL parameters
    const params = new URLSearchParams({
      accessToken: credentials.accessToken
    });

    console.log('Sending test request to /api/shopify/test');
    
    const response = await fetch(`/api/shopify/test?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    console.log('API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Shop data received:', data);
      
      // If we can get valid shop data, the connection is working
      if (data.success && data.shop) {
        console.log('Connection successful!');
        setCorsAccessGranted(true);
        
        return { 
          success: true, 
          details: { shopName: data.shop.name } 
        };
      } else {
        console.error('Invalid response structure:', data);
        return {
          success: false,
          error: data.error || 'Invalid response from Shopify API'
        };
      }
    } else {
      // Handle error response
      let errorMessage = `API Error (${response.status}): ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        
        return {
          success: false,
          error: errorData.error || errorMessage,
          details: { status: response.status, errorData }
        };
      } catch (textError) {
        return {
          success: false,
          error: errorMessage,
          details: { status: response.status }
        };
      }
    }
  } catch (fetchError: any) {
    console.error('Fetch error:', fetchError);
    
    // Check for specific network errors
    if (fetchError.name === 'AbortError') {
      return {
        success: false,
        error: 'Connection timed out',
        details: fetchError
      };
    }
    
    return {
      success: false,
      error: `Connection error: ${fetchError.message}`,
      details: fetchError
    };
  }
};
