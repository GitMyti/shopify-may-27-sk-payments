
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToCSV, ShopReport } from '@/lib/csv';
import { exportToExcel } from '@/lib/excel/report-generator';
import { exportToPDF } from '@/lib/pdf/report-generator';
import { toast } from 'sonner';
import { useDateRange } from '@/contexts/DateRangeContext';
import { useRapidDeliveryData } from '@/contexts/RapidDeliveryContext';
import { normalizeShopNameForComparison } from '@/lib/csv/processor';

interface ExportButtonsProps {
  report: ShopReport;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ report }) => {
  const { selectedDateRange } = useDateRange();
  const { rapidDeliveryReport } = useRapidDeliveryData();
  
  // Create a date range for export functions
  const getDateRangeForExport = () => {
    if (!selectedDateRange || !selectedDateRange.from || !selectedDateRange.to) {
      return undefined;
    }
    
    return {
      start: selectedDateRange.from,
      end: selectedDateRange.to
    };
  };

  const handleExcelExport = async () => {
    try {
      toast.loading('Generating Excel report...');
      await exportToExcel(report, getDateRangeForExport());
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  const handlePdfExport = async () => {
    try {
      toast.loading('Generating PDF report...');
      await exportToPDF(report, getDateRangeForExport(), rapidDeliveryReport);
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF report');
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleExcelExport}
        variant="default"
        className="gap-2 self-start sm:self-center"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={handlePdfExport}
        variant="secondary"
        className="gap-2 self-start sm:self-center"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
      <Button
        onClick={() => exportToCSV(report)}
        variant="outline"
        className="gap-2 self-start sm:self-center"
      >
        <DownloadIcon className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};

export default ExportButtons;
