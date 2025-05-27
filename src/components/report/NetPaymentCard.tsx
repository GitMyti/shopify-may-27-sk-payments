
import React from 'react';
import { formatCurrency } from '@/lib/csv/utils';
import SummaryCard from './SummaryCard';
import { Receipt } from 'lucide-react';

interface NetPaymentCardProps {
  payment: number;
}

const NetPaymentCard: React.FC<NetPaymentCardProps> = ({ payment }) => {
  return (
    <SummaryCard 
      title="Net Payment"
      value={formatCurrency(payment)}
      icon={<Receipt className="h-5 w-5 text-primary" />}
      description="After delivery charges"
      valueClassName="text-primary font-bold"
    />
  );
};

export default NetPaymentCard;
