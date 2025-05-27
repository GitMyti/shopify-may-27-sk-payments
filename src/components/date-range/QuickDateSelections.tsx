
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDateRange } from '@/contexts/DateRangeContext';

interface QuickDateSelectionsProps {
  onSelectDateRange: (from: Date, to: Date) => void;
}

const QuickDateSelections = ({ onSelectDateRange }: QuickDateSelectionsProps) => {
  const { csvDateRange } = useDateRange();
  
  // Get the quick selection buttons based on CSV date range
  const getQuickSelections = () => {
    if (!csvDateRange.earliest || !csvDateRange.latest) {
      return [];
    }
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return [
      {
        label: 'All Data',
        onClick: () => {
          if (csvDateRange.earliest && csvDateRange.latest) {
            onSelectDateRange(csvDateRange.earliest, csvDateRange.latest);
          }
        }
      },
      {
        label: 'This Month',
        onClick: () => {
          onSelectDateRange(thisMonth, now);
        }
      },
      {
        label: 'Last Month',
        onClick: () => {
          onSelectDateRange(lastMonth, lastMonthEnd);
        }
      }
    ];
  };

  const quickSelections = getQuickSelections();

  return (
    <div className="p-2 border-b border-border flex gap-2 flex-wrap">
      {quickSelections.map((option, index) => (
        <Button 
          key={index} 
          variant="outline" 
          size="sm" 
          onClick={option.onClick}
          className="text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickDateSelections;
