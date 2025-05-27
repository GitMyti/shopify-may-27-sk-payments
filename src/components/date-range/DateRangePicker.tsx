
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';
import QuickDateSelections from './QuickDateSelections';
import { useDateRange } from '@/contexts/DateRangeContext';

interface DateRangePickerProps {
  date: DateRange | undefined;
  onSelect: (selectedRange: DateRange | undefined) => void;
}

const DateRangePicker = ({
  date,
  onSelect,
}: DateRangePickerProps) => {
  const { csvDateRange, isCalendarOpen, setIsCalendarOpen } = useDateRange();

  const handleQuickSelect = (from: Date, to: Date) => {
    const newRange = { from, to };
    onSelect(newRange);
  };

  const dateRangeText = () => {
    if (!date || !date.from) {
      return "Select date range";
    }
    if (date.from && !date.to) {
      return format(date.from, 'PP');
    }
    return `${format(date.from, 'PP')} - ${format(date.to!, 'PP')}`;
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date-range"
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-brand-primary" />
            {dateRangeText()}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <QuickDateSelections onSelectDateRange={handleQuickSelect} />
        <Calendar
          mode="range"
          selected={date}
          onSelect={onSelect}
          numberOfMonths={2}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
