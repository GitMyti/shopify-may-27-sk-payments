
import React from 'react';
import { ShopSummary, formatCurrency } from '@/lib/csv';
import SummaryCard from './SummaryCard';
import { TrendingUp } from 'lucide-react';

interface TotalPaymentCardProps {
  summary: ShopSummary;
}

const TotalPaymentCard: React.FC<TotalPaymentCardProps> = ({ summary }) => {
  return (
    <SummaryCard 
      title="Total Payment" 
      value={formatCurrency(summary.totalPayment)}
      icon={<TrendingUp className="h-5 w-5 text-brand-primary" />}
      valueClassName="text-brand-primary font-bold"
    />
  );
};

export default TotalPaymentCard;
