
import { 
  fetchShopifyOrders, 
  getShopifyCredentials,
  getCorsAccessGranted
} from '@/lib/api/shopify';
import { toast } from 'sonner';

interface FetchOrdersOptions {
  setFetchProgress: (progress: number) => void;
  dateRange: { 
    start: Date | undefined; 
    end: Date | undefined;
  };
}

interface FetchOrdersResult {
  success: boolean;
  orders?: any[];
  error?: string;
}

export const fetchOrdersFromShopify = async ({
  setFetchProgress,
  dateRange
}: FetchOrdersOptions): Promise<FetchOrdersResult> => {
  console.log('Starting fetchOrdersFromShopify with date range:', dateRange);
  const credentials = getShopifyCredentials();
  
  // Check for credentials
  if (!credentials?.accessToken) {
    toast.error('Shopify API credentials not found');
    return { 
      success: false,
      error: 'Please configure your Shopify access token first'
    };
  }
  
  // Check for date range
  if (!dateRange.start || !dateRange.end) {
    toast.error('Please select a date range');
    return {
      success: false,
      error: 'Date range is required'
    };
  }
  
  const toastId = toast.loading('Fetching orders from Shopify API...', { duration: 30000 });
  
  // Start fetching orders
  setFetchProgress(10);
  
  try {
    console.log('Calling fetchShopifyOrders with date range', {
      start: dateRange.start.toISOString(),
      end: dateRange.end.toISOString()
    });
    
    const orders = await fetchShopifyOrders(credentials, {
      start: dateRange.start,
      end: dateRange.end
    });
    
    console.log(`Successfully fetched ${orders.length} orders`);
    setFetchProgress(90);
    toast.dismiss(toastId);
    
    if (orders.length === 0) {
      toast.warning('No orders found in the selected date range');
    } else {
      toast.success(`Loaded ${orders.length} orders from Shopify API`);
    }
    
    setFetchProgress(100);
    return { success: true, orders };
    
  } catch (error: any) {
    console.error('Fetch API error:', error);
    toast.dismiss(toastId);
    toast.error('Error fetching orders from Shopify API');
    
    // Enhanced error message
    let errorMessage = error.message || 'Unable to fetch orders';
    if (error.message?.includes('CORS')) {
      errorMessage = 'API connection error. Please check your network settings.';
    } else if (error.message?.includes('SSL')) {
      errorMessage = 'SSL Certificate error. Please ensure you\'re using HTTPS.';
    } else if (error.message?.includes('timed out')) {
      errorMessage = 'Connection timed out. Please try again.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
