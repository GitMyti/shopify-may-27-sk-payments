
import React, { useState } from 'react';
import ShopifyApiSettings from '@/components/api/ShopifyApiSettings';
import ShopifyApiSection from './ShopifyApiSection';
import { getDataSource, setDataSource } from '@/lib/api/shopify';
import { useDateRange } from '@/contexts/DateRangeContext';
import { processShopifyOrders, extractApiOrderDateRange } from '@/lib/api/processShopifyOrders';
import { ShopCommission } from '@/lib/excelParser';

interface FileUploadSectionWithApiProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  lastOrdersData: any[];
  setLastOrdersData: (data: any[]) => void;
  setReports: (reports: any[]) => void;
  setRapidDeliveryReport: (report: any) => void;
  setSelectedReport: (shop: string | null) => void;
  customCommissions: ShopCommission[];
  onDateRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  selectedDateRange: { start: Date | undefined; end: Date | undefined };
  hasUploadedCustomCommissions: boolean;
  extractDateRange: (orders: any[]) => { earliest: Date | null; latest: Date | null };
}

const FileUploadSectionWithApi: React.FC<FileUploadSectionWithApiProps> = ({
  isLoading,
  setIsLoading,
  lastOrdersData,
  setLastOrdersData,
  setReports,
  setRapidDeliveryReport,
  setSelectedReport,
  customCommissions,
  onDateRangeChange,
  selectedDateRange,
  hasUploadedCustomCommissions,
  extractDateRange
}) => {
  const { setCsvDateRange } = useDateRange();
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Handle successful API connection
  const handleConnectionSuccess = () => {
    setIsConfigured(true);
    setDataSource('api');
  };
  
  // Process orders from API
  const handleOrdersLoaded = (orders: any[]) => {
    setLastOrdersData(orders);
    
    // Extract date range
    const dateRange = extractApiOrderDateRange(orders);
    setCsvDateRange(dateRange);
    
    // Process orders using the dedicated API processor
    const { shopReports, rapidDeliveryReport } = processShopifyOrders(orders, customCommissions);
    
    // Update state with processed data
    setReports(shopReports);
    setRapidDeliveryReport(rapidDeliveryReport);
    
    // Auto-select first report if there's only one
    if (shopReports.length === 1) {
      setSelectedReport(shopReports[0].shopName);
    }
  };
  
  return (
    <div className="my-6 space-y-6">
      <div className="space-y-6">
        {/* Shopify API Settings Section */}
        <ShopifyApiSettings 
          onConnectionSuccess={handleConnectionSuccess} 
        />
        
        {/* API Data Fetching Section */}
        <ShopifyApiSection
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={onDateRangeChange}
          lastOrdersData={lastOrdersData}
          onOrdersLoaded={handleOrdersLoaded}
        />
      </div>
    </div>
  );
};

export default FileUploadSectionWithApi;
