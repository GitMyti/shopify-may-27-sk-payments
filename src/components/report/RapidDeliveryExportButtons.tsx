
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, File } from 'lucide-react';
import { RapidDeliveryReport } from '@/lib/csv';
import { exportRapidDeliveryToExcel } from '@/lib/excel/report-generator';
import { exportRapidDeliveryToPDF } from '@/lib/pdf';
import { toast } from 'sonner';
import { useDateRange } from '@/contexts/DateRangeContext';

interface RapidDeliveryExportButtonsProps {
  report: RapidDeliveryReport;
}

const RapidDeliveryExportButtons: React.FC<RapidDeliveryExportButtonsProps> = ({ report }) => {
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

  const handleExportExcel = async () => {
    try {
      toast.loading('Generating Excel report...');
      await exportRapidDeliveryToExcel(report, getDateRangeForExport());
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to generate Excel report');
    }
  };
  
  const handleExportPDF = async () => {
    try {
      toast.loading('Generating PDF report...');
      await exportRapidDeliveryToPDF(report, getDateRangeForExport());
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF report');
    }
  };
  
  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportExcel}
        variant="outline"
        size="sm"
        className="gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Excel</span>
      </Button>
      
      <Button
        onClick={handleExportPDF}
        variant="outline"
        size="sm"
        className="gap-1"
      >
        <File className="h-4 w-4" />
        <span>PDF</span>
      </Button>
    </div>
  );
};

export default RapidDeliveryExportButtons;

