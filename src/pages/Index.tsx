import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ShopReport as ShopReportType, processOrderData, extractDateRange } from '@/lib/csv';
import { ShopCommission, DEFAULT_COMMISSIONS } from '@/lib/excelParser';
import UsageInstructions from '@/components/UsageInstructions';
import MobileCommissionSettings from '@/components/MobileCommissionSettings';
import Footer from '@/components/Footer';
import HeaderSection from '@/components/HeaderSection';
import ReportContent from '@/components/ReportContent';
import { DateRangeProvider, useDateRange } from '@/contexts/DateRangeContext';
import FileUploadSectionWithApi from '@/components/file-upload/FileUploadSectionWithApi';
import { getDataSource } from '@/lib/api/shopify';

const Index = () => {
  const [reports, setReports] = useState<ShopReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [customCommissions, setCustomCommissions] = useState<ShopCommission[]>(DEFAULT_COMMISSIONS);
  const [lastOrdersData, setLastOrdersData] = useState<any[]>([]);
  const [hasUploadedCustomCommissions, setHasUploadedCustomCommissions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined
  });
  const [rapidDeliveryReport, setRapidDeliveryReport] = useState(null);
  const [dataSource, setDataSource] = useState<'api' | 'csv'>(getDataSource());
  
  useEffect(() => {
    // Update data source if changed in settings
    setDataSource(getDataSource());
  }, []);
  
  useEffect(() => {
    if (lastOrdersData.length > 0) {
      const commissionsToUse = hasUploadedCustomCommissions ? customCommissions : DEFAULT_COMMISSIONS;
      
      let filteredOrders = lastOrdersData;
      if (dateRange.start && dateRange.end) {
        filteredOrders = lastOrdersData.filter(order => {
          if (!order['Paid at']) return true;
          const paidAt = new Date(order['Paid at']);
          return paidAt >= dateRange.start! && paidAt <= dateRange.end!;
        });
      }
      
      const updatedReports = processOrderData(filteredOrders, commissionsToUse);
      setReports(updatedReports);
      
      if (selectedReport && !updatedReports.some(r => r.shopName === selectedReport)) {
        setSelectedReport(null);
      }
      
      if (hasUploadedCustomCommissions) {
        toast.success(`Updated commission rates for ${customCommissions.length} shops`);
      }
      
      if (dateRange.start && dateRange.end) {
        toast.info(`Filtered orders between ${dateRange.start.toLocaleDateString()} and ${dateRange.end.toLocaleDateString()}`);
        
        // Store date range in localStorage for global access
        localStorage.setItem('selectedDateRange', JSON.stringify({
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString()
        }));
      } else {
        // Clear stored date range if no filter is active
        localStorage.removeItem('selectedDateRange');
      }
    }
  }, [customCommissions, lastOrdersData, selectedReport, hasUploadedCustomCommissions, dateRange]);
  
  const handleCommissionsUploaded = (commissions: ShopCommission[]) => {
    const sortedCommissions = [...commissions].sort((a, b) => 
      a.shopName.localeCompare(b.shopName)
    );
    
    setCustomCommissions(sortedCommissions);
    setHasUploadedCustomCommissions(true);
    setLastUpdated(new Date());
  };
  
  const handleResetToDefaultCommissions = () => {
    setCustomCommissions(DEFAULT_COMMISSIONS);
    setHasUploadedCustomCommissions(false);
    setLastUpdated(new Date());
    
    toast.success('Reset to default commission rates');
  };
  
  const handleDateRangeChange = (range: { start: Date | undefined; end: Date | undefined }) => {
    setDateRange(range);
  };
  
  const logoPath = "/lovable-uploads/b18eb3cf-9811-4977-a112-051fd74da264.png";
  
  // Show data source in UI
  const dataSourceText = dataSource === 'api' ? 'Shopify API' : 'CSV Upload';
  
  return (
    <DateRangeProvider>
      <div className="min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent h-[50vh] -z-10" />
          
          <div className="container max-w-6xl py-12 px-4 sm:px-6">
            <HeaderSection
              onCommissionsUploaded={handleCommissionsUploaded}
              customCommissions={customCommissions}
              onResetToDefault={handleResetToDefaultCommissions}
              hasUploadedCustomCommissions={hasUploadedCustomCommissions}
              lastUpdated={lastUpdated}
              logo={logoPath}
              dataSource={dataSourceText}
            />
            
            <UsageInstructions />
            
            <FileUploadSectionWithApi
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              lastOrdersData={lastOrdersData}
              setLastOrdersData={setLastOrdersData}
              setReports={setReports}
              setRapidDeliveryReport={setRapidDeliveryReport}
              setSelectedReport={setSelectedReport}
              customCommissions={customCommissions}
              onDateRangeChange={handleDateRangeChange}
              hasUploadedCustomCommissions={hasUploadedCustomCommissions}
              extractDateRange={extractDateRange}
              selectedDateRange={dateRange}
            />

            <MobileCommissionSettings 
              onCommissionsUploaded={handleCommissionsUploaded}
              customCommissions={customCommissions}
              onResetToDefault={handleResetToDefaultCommissions}
              hasUploadedCustomCommissions={hasUploadedCustomCommissions}
              lastUpdated={lastUpdated}
            />
            
            <ReportContent
              reports={reports}
              expanded={expanded}
              setExpanded={setExpanded}
              selectedReport={selectedReport}
              setSelectedReport={setSelectedReport}
              rapidDeliveryReport={rapidDeliveryReport}
            />
          </div>
        </div>
        
        <Footer logo={logoPath} />
      </div>
    </DateRangeProvider>
  );
};

export default Index;
