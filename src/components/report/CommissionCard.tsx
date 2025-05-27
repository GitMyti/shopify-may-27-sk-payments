
import React from 'react';
import { ShopOrder, ShopSummary, formatCurrency } from '@/lib/csv';
import SummaryCard from './SummaryCard';
import { TrendingUp } from 'lucide-react';

interface CommissionCardProps {
  summary: ShopSummary;
  commissionPercentage: number;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ summary, commissionPercentage }) => {
  // Ensure the commission percentage is displayed correctly
  console.log(`Displaying commission card with ${commissionPercentage}% commission rate`);
  
  return (
    <SummaryCard 
      title={`Commission (${commissionPercentage}%)`}
      value={formatCurrency(summary.totalCommission)}
      icon={<TrendingUp className="h-5 w-5 text-brand-yellow" />}
      valueClassName="text-brand-yellow"
    />
  );
};

export default CommissionCard;
