
import React from 'react';
import { ShopSummary, formatCurrency } from '@/lib/csv';
import SummaryCard from './SummaryCard';
import { AreaChart } from 'lucide-react';

interface GrossSalesCardProps {
  summary: ShopSummary;
}

const GrossSalesCard: React.FC<GrossSalesCardProps> = ({ summary }) => {
  return (
    <SummaryCard 
      title="Gross Sales" 
      value={formatCurrency(summary.totalGrossSales)}
      icon={<AreaChart className="h-5 w-5 text-brand-secondary" />}
    />
  );
};

export default GrossSalesCard;
