
import React from 'react';
import { ShopSummary, formatCurrency } from '@/lib/csv';
import SummaryCard from './SummaryCard';
import { TrendingDown } from 'lucide-react';

interface ReturnsCardProps {
  summary: ShopSummary;
}

const ReturnsCard: React.FC<ReturnsCardProps> = ({ summary }) => {
  return (
    <SummaryCard 
      title="Returns" 
      value={formatCurrency(summary.totalReturns)}
      icon={<TrendingDown className="h-5 w-5 text-brand-pink" />}
      valueClassName="text-brand-pink"
    />
  );
};

export default ReturnsCard;
