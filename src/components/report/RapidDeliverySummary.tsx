
import React from 'react';
import { RapidDeliverySummary as RapidDeliverySummaryType } from '@/lib/csv';
import { formatCurrency } from '@/lib/csv/utils';
import SummaryCard from './SummaryCard';
import { Package, DollarSign } from 'lucide-react';

interface RapidDeliverySummaryProps {
  summary: RapidDeliverySummaryType;
}

const RapidDeliverySummary: React.FC<RapidDeliverySummaryProps> = ({ summary }) => {
  return (
    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-secondary/30">
      <SummaryCard 
        title="Total Deliveries"
        value={summary.totalDeliveries.toString()}
        icon={<Package className="h-5 w-5" />}
        description="Number of rapid deliveries"
      />
      
      <SummaryCard 
        title="Total Charges"
        value={formatCurrency(summary.totalCharges)}
        icon={<DollarSign className="h-5 w-5" />}
        description="Total delivery charges"
        valueClassName="text-green-600 dark:text-green-400"
      />
    </div>
  );
};

export default RapidDeliverySummary;
