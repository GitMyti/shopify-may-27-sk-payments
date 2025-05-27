
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { exportShopsSummary } from '@/lib/excel/report-generator';
import { ShopReport } from '@/lib/csv';
import { toast } from 'sonner';
import { useDateRange } from '@/contexts/DateRangeContext';

interface ExportSummaryButtonProps {
  reports: ShopReport[];
  className?: string;
}

const ExportSummaryButton: React.FC<ExportSummaryButtonProps> = ({ reports, className }) => {
  const { selectedDateRange } = useDateRange();
  
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

  const handleExportSummary = async () => {
    if (reports.length === 0) {
      toast.error('No shop reports available to export');
      return;
    }
    
    try {
      toast.loading('Generating shops summary report...');
      await exportShopsSummary(reports, getDateRangeForExport());
      toast.success('Shops summary report generated successfully');
    } catch (error) {
      console.error('Summary export error:', error);
      toast.error('Failed to generate shops summary report');
    }
  };
  
  return (
    <Button
      onClick={handleExportSummary}
      variant="outline"
      className={`gap-2 ${className || ""}`}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export to Excel a summary report
    </Button>
  );
};

export default ExportSummaryButton;
