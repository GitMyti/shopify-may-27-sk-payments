
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DateRangeFilter from '@/components/DateRangeFilter';
import { 
  getDataSource, 
  getShopifyCredentials, 
  getCorsAccessGranted
} from '@/lib/api/shopify';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import ProgressBar from './ProgressBar';
import { fetchOrdersFromShopify } from './utils/fetchOrdersFromShopify';

interface ShopifyApiSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedDateRange: { start: Date | undefined; end: Date | undefined };
  onDateRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  lastOrdersData: any[];
  onOrdersLoaded: (orders: any[]) => void;
}

const ShopifyApiSection: React.FC<ShopifyApiSectionProps> = ({
  isLoading,
  setIsLoading,
  selectedDateRange,
  onDateRangeChange,
  lastOrdersData,
  onOrdersLoaded
}) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [fetchProgress, setFetchProgress] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Check if API is already configured
  useEffect(() => {
    const credentials = getShopifyCredentials();
    const corsGranted = getCorsAccessGranted();
    setIsConfigured(!!credentials?.accessToken && corsGranted);
  }, []);
  
  // Function to fetch data from the API
  const handleApiFetch = async () => {
    try {
      setIsLoading(true);
      setFetchProgress(0);
      setApiError(null);
      
      const { success, orders, error } = await fetchOrdersFromShopify({
        setFetchProgress,
        dateRange: selectedDateRange
      });
      
      if (success && orders) {
        // Pass the orders to the parent through the callback
        onOrdersLoaded(orders);
      } else if (error) {
        setApiError(error);
      }
      
      setTimeout(() => {
        setFetchProgress(null);
      }, 1000);
      
    } catch (error: any) {
      console.error('API fetch error:', error);
      toast.error('Error fetching orders from Shopify API');
      setApiError(error.message || 'An unexpected error occurred while fetching orders');
      setFetchProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <DateRangeFilter onDateRangeChange={onDateRangeChange} />
        
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {apiError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center">
          <ProgressBar progress={fetchProgress} />
          
          <Button 
            onClick={handleApiFetch}
            disabled={isLoading || !selectedDateRange.start || !selectedDateRange.end}
            className="gap-2 ml-auto"
          >
            <Download className="h-4 w-4" />
            Fetch Orders
          </Button>
        </div>
        
        {lastOrdersData.length > 0 && (
          <div className="p-3 rounded-md bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
            <p className="text-sm font-medium">
              {lastOrdersData.length} orders loaded successfully
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopifyApiSection;
