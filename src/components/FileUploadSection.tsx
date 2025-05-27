
import React from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import DateRangeFilter from '@/components/DateRangeFilter';
import { processOrderData, processRapidDeliveries } from '@/lib/csv';
import { parseCSV } from '@/lib/csv/csvParser'; // Import parseCSV directly from csvParser
import { ShopCommission } from '@/lib/excelParser';
import { CalendarRange } from 'lucide-react';
import { useDateRange } from '@/contexts/DateRangeContext';

interface FileUploadSectionProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  lastOrdersData: any[];
  setLastOrdersData: (data: any[]) => void;
  setReports: (reports: any[]) => void;
  setRapidDeliveryReport: (report: any) => void;
  setSelectedReport: (report: string | null) => void;
  customCommissions: ShopCommission[];
  onDateRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  hasUploadedCustomCommissions: boolean;
  extractDateRange: (orders: any[]) => { earliest: Date | null; latest: Date | null };
  selectedDateRange: { start: Date | undefined; end: Date | undefined };
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  isLoading,
  setIsLoading,
  lastOrdersData,
  setLastOrdersData,
  setReports,
  setRapidDeliveryReport,
  setSelectedReport,
  customCommissions,
  onDateRangeChange,
  hasUploadedCustomCommissions,
  extractDateRange,
  selectedDateRange
}) => {
  const { setCsvDateRange, csvDateRange } = useDateRange();

  const handleFileAccepted = async (file: File) => {
    try {
      setIsLoading(true);
      const orders = await parseCSV(file);
      
      if (orders.length === 0) {
        toast.error('No valid order data found in the CSV file');
        setIsLoading(false);
        return;
      }
      
      setLastOrdersData(orders);
      
      const extractedRange = extractDateRange(orders);
      setCsvDateRange(extractedRange);
      console.log('CSV date range:', extractedRange);
      
      // Process shop reports
      const shopReports = processOrderData(orders, customCommissions);
      
      shopReports.sort((a, b) => a.shopName.localeCompare(b.shopName));
      
      setReports(shopReports);
      
      // Process rapid delivery report separately
      const rapidDeliveryReport = processRapidDeliveries(orders);
      setRapidDeliveryReport(rapidDeliveryReport);
      
      if (shopReports.length === 1) {
        setSelectedReport(shopReports[0].shopName);
      }
      
      toast.success(`Processed ${orders.length} orders from ${shopReports.length} shops with ${rapidDeliveryReport.orders.length} rapid deliveries`);
    } catch (error) {
      console.error('Error processing CSV file:', error);
      toast.error('Failed to process the CSV file. Please check the format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6">
          <FileUpload onFileAccepted={handleFileAccepted} className="w-full" />
        </div>
        
        {lastOrdersData.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-primary">Filter by date range</h3>
              {csvDateRange.earliest && csvDateRange.latest && (
                <div className="flex items-center gap-1.5 text-sm bg-muted/50 px-2 py-1 rounded-md">
                  <CalendarRange className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">CSV date range:</span>
                  <span className="font-medium">{format(csvDateRange.earliest, 'PP')} - {format(csvDateRange.latest, 'PP')}</span>
                </div>
              )}
            </div>
            <DateRangeFilter 
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
