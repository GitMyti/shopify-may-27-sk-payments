import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ShopifyCredentials {
  shopUrl: string;
  accessToken: string;
}

interface UseShopifyConnectionProps {
  onConnectionSuccess?: () => void;
}

// Simple local storage helpers
const getShopifyCredentials = (): ShopifyCredentials | null => {
  try {
    const saved = localStorage.getItem('shopify-credentials');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveShopifyCredentials = (credentials: ShopifyCredentials) => {
  localStorage.setItem('shopify-credentials', JSON.stringify(credentials));
};

// Direct API call to your Vercel backend
const testShopifyConnection = async (credentials: ShopifyCredentials) => {
  try {
    const response = await fetch(`${window.location.origin}/api/shopify/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: data.success || false,
      error: data.error || null,
      shop: data.shop || null
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
};

export const useShopifyConnection = ({ onConnectionSuccess }: UseShopifyConnectionProps = {}) => {
  const [credentials, setCredentials] = useState<ShopifyCredentials>({
    shopUrl: 'sustainlocal.myshopify.com',
    accessToken: '',
  });
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [needsCorsAccess, setNeedsCorsAccess] = useState<boolean>(false);
  const [showCorsDialog, setShowCorsDialog] = useState<boolean>(false);
  
  // Load saved credentials and connection status
  useEffect(() => {
    const savedCredentials = getShopifyCredentials();
    if (savedCredentials) {
      setCredentials(savedCredentials);
      
      // Check if we have a valid connection
      if (savedCredentials.accessToken) {
        checkConnection(savedCredentials);
      }
    }
    
    // No CORS needed since we're using backend endpoints
    setNeedsCorsAccess(false);
  }, []);
  
  // Test connection with current credentials
  const checkConnection = async (creds: ShopifyCredentials) => {
    console.log('Checking connection with saved credentials');
    try {
      const result = await testShopifyConnection(creds);
      console.log('Connection check result:', result);
      
      setIsConnected(result.success);
      
      if (result.success) {
        setConnectionError(null);
        setNeedsCorsAccess(false);
      } else {
        setConnectionError(result.error || 'Connection failed');
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setIsConnected(false);
      setConnectionError('Connection check failed');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      accessToken: e.target.value
    }));
    
    // Reset connection status when credentials change
    setIsConnected(false);
    setConnectionError(null);
  };
  
  const handleResetConnection = () => {
    setConnectionError(null);
    setIsConnected(false);
    toast.info('Connection state has been reset');
  };
  
  const handleTestConnection = async () => {
    if (isLoading) {
      console.log('Preventing rapid test connection clicks');
      return;
    }
    
    setIsLoading(true);
    setConnectionError(null);
    
    console.log('Testing connection...');
    
    try {
      // Validate input
      //if (!credentials.accessToken) {
       // toast.error('Please enter your Shopify access token');
       // setConnectionError('Missing access token');
      //  setIsLoading(false);
        //return;
     // }
      
      // Skip validation - API uses environment variables
// No need to validate access token since backend uses env vars
console.log('Using environment variables from API');
      
      // Test connection using direct API call
      console.log('Testing connection to Shopify API:', credentials.shopUrl);
      const result = await testShopifyConnection(credentials);
      console.log('Test connection result:', result);
      
      setIsConnected(result.success);
      
      if (result.success) {
        toast.success('Successfully connected to Shopify!');
        saveShopifyCredentials(credentials);
        setConnectionError(null);
        
        // Notify parent on successful connection
        if (onConnectionSuccess) onConnectionSuccess();
      } else {
        setConnectionError(result.error || 'Connection failed - check your credentials and try again');
        toast.error(`Connection failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Connection test error:', error);
      setConnectionError(`Error testing connection: ${error.message}`);
      toast.error(`Error testing connection: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isConnected,
    isLoading,
    connectionError,
    needsCorsAccess,
    showCorsDialog,
    setShowCorsDialog,
    handleInputChange,
    handleTestConnection,
    handleVisitCorsDemo: () => {}, // Empty function - no CORS demo needed
    handleResetConnection
  };
};
