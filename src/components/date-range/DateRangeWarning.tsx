
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { useDateRange } from '@/contexts/DateRangeContext';

const DateRangeWarning = () => {
  const { showWarning, warningMessage, selectedDateRange, csvDateRange } = useDateRange();

  if (!showWarning) return null;
  
  const formatDateRange = (from?: Date, to?: Date) => {
    if (!from) return "None";
    if (!to) return format(from, 'PP');
    return `${format(from, 'PP')} - ${format(to, 'PP')}`;
  };

  const formatCsvDateRange = () => {
    if (!csvDateRange.earliest || !csvDateRange.latest) return "Unknown";
    return `${format(csvDateRange.earliest, 'PP')} to ${format(csvDateRange.latest, 'PP')}`;
  };

  return (
    <Alert variant="destructive" className="animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Date Range Warning</AlertTitle>
      <AlertDescription className="flex flex-col gap-1">
        <p>{warningMessage}</p>
        <p className="font-medium">Selected: {formatDateRange(selectedDateRange?.from, selectedDateRange?.to)}</p>
        <p className="font-medium">CSV data: {formatCsvDateRange()}</p>
      </AlertDescription>
    </Alert>
  );
};

export default DateRangeWarning;
