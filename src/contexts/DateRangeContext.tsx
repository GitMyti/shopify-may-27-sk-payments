
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

interface DateRangeContextType {
  csvDateRange: { earliest: Date | null; latest: Date | null };
  setCsvDateRange: (range: { earliest: Date | null; latest: Date | null }) => void;
  selectedDateRange: DateRange | undefined;
  setSelectedDateRange: (range: DateRange | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (isOpen: boolean) => void;
  clearDateRange: () => void;
  showWarning: boolean;
  warningMessage: string;
  validateDateRange: (start: Date, end: Date) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const DateRangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [csvDateRange, setCsvDateRange] = useState<{ earliest: Date | null; latest: Date | null }>({
    earliest: null,
    latest: null
  });
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const validateDateRange = (start: Date, end: Date) => {
    if (!csvDateRange.earliest || !csvDateRange.latest) {
      setShowWarning(false);
      return;
    }

    // Check if CSV data is outside the selected range
    const hasDataBeforeRange = csvDateRange.earliest < start;
    const hasDataAfterRange = csvDateRange.latest > end;
    
    if (hasDataBeforeRange || hasDataAfterRange) {
      let message = 'Some orders in your CSV file are outside the selected date range.';
      
      if (hasDataBeforeRange && hasDataAfterRange) {
        message += ' There is data both before and after your selection.';
      } else if (hasDataBeforeRange) {
        message += ' There is data before your selection start date.';
      } else if (hasDataAfterRange) {
        message += ' There is data after your selection end date.';
      }
      
      setWarningMessage(message);
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const clearDateRange = () => {
    setSelectedDateRange(undefined);
    setShowWarning(false);
  };

  const value = {
    csvDateRange,
    setCsvDateRange,
    selectedDateRange,
    setSelectedDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    clearDateRange,
    showWarning,
    warningMessage,
    validateDateRange
  };

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
};

export const useDateRange = (): DateRangeContextType => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};
