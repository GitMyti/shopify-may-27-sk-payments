
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDateRange } from '@/contexts/DateRangeContext';
import DateRangePicker from './date-range/DateRangePicker';
import DateRangeWarning from './date-range/DateRangeWarning';
import DateRangeDisplay from './date-range/DateRangeDisplay';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  onDateRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void;
  className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  className
}) => {
  const { 
    selectedDateRange, 
    setSelectedDateRange,
    csvDateRange,
    isCalendarOpen, 
    setIsCalendarOpen,
    clearDateRange,
    showWarning,
    warningMessage,
    validateDateRange
  } = useDateRange();

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setSelectedDateRange(selectedRange);
    
    if (selectedRange?.from && selectedRange?.to) {
      const start = selectedRange.from;
      const end = selectedRange.to;
      validateDateRange(start, end);
      onDateRangeChange({ start, end });
    } else if (!selectedRange || (!selectedRange.from && !selectedRange.to)) {
      onDateRangeChange({ start: undefined, end: undefined });
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <DateRangePicker
            date={selectedDateRange}
            onSelect={handleSelect}
          />
        </div>
        {selectedDateRange?.from && selectedDateRange?.to && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              clearDateRange();
              onDateRangeChange({ start: undefined, end: undefined });
            }}
            className="self-start"
          >
            Clear
          </Button>
        )}
      </div>

      {/* CSV Date Range Display */}
      <DateRangeDisplay />

      {/* Date Range Warning */}
      <DateRangeWarning />
    </div>
  );
};

export default DateRangeFilter;
