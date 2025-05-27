
import React from 'react';
import { formatCurrency } from '@/lib/csv/utils';
import SummaryCard from './SummaryCard';
import { Truck } from 'lucide-react';

interface RapidDeliveryCardProps {
  charges: number;
}

const RapidDeliveryCard: React.FC<RapidDeliveryCardProps> = ({ charges }) => {
  return (
    <SummaryCard 
      title="Rapid Delivery"
      value={formatCurrency(charges)}
      icon={<Truck className="h-5 w-5 text-cyan-600" />}
      description="Total delivery charges"
      valueClassName="text-cyan-600 dark:text-cyan-400"
    />
  );
};

export default RapidDeliveryCard;
