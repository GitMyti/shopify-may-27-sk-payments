
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useDateRange } from '@/contexts/DateRangeContext';

const DateRangeDisplay = () => {
  const { csvDateRange } = useDateRange();
  
  if (!csvDateRange.earliest || !csvDateRange.latest) return null;

  const formatCsvDateRange = () => {
    return `${format(csvDateRange.earliest, 'PP')} to ${format(csvDateRange.latest, 'PP')}`;
  };

  return (
    <div className="text-sm text-muted-foreground flex items-center gap-1.5">
      <CalendarIcon className="h-3.5 w-3.5" />
      <span>
        CSV file contains data from: <span className="font-medium">{formatCsvDateRange()}</span>
      </span>
    </div>
  );
};

export default DateRangeDisplay;
