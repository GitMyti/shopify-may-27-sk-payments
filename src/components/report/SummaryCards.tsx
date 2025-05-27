
import React from 'react';
import { ShopReport } from '@/lib/csv';
import GrossSalesCard from './GrossSalesCard';
import ReturnsCard from './ReturnsCard';
import CommissionCard from './CommissionCard';
import TotalPaymentCard from './TotalPaymentCard';
import RapidDeliveryCard from './RapidDeliveryCard';
import NetPaymentCard from './NetPaymentCard';

interface SummaryCardsProps {
  report: ShopReport & { rapidDeliveryCharges?: number };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ report }) => {
  const { orders, summary, rapidDeliveryCharges = 0 } = report;
  
  // Determine the shop's commission rate correctly:
  // Get the commission percentage from non-delivery orders since those are always 0%
  const regularOrders = orders.filter(order => !order.isDeliveryCharge);
  
  // For debugging
  console.log(`${report.shopName}: Found ${regularOrders.length} regular orders`);
  if (regularOrders.length > 0) {
    regularOrders.forEach((order, idx) => {
      if (idx < 3) { // Just log a few for brevity
        console.log(`  Order #${order.orderNumber}: Commission ${order.commissionPercentage}%`);
      }
    });
  }
  
  const commissionPercentage = regularOrders.length > 0 
    ? regularOrders[0].commissionPercentage 
    : 10; // Default fallback
  
  console.log(`Final commission rate for ${report.shopName}: ${commissionPercentage}%`);
  
  // Calculate net payment (total payment minus rapid delivery charges)
  const netPayment = summary.totalPayment - rapidDeliveryCharges;
  
  return (
    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 bg-secondary/30">
      <GrossSalesCard summary={summary} />
      <ReturnsCard summary={summary} />
      <CommissionCard summary={summary} commissionPercentage={commissionPercentage} />
      <RapidDeliveryCard charges={rapidDeliveryCharges} />
      <TotalPaymentCard summary={summary} />
      <NetPaymentCard payment={netPayment} />
    </div>
  );
};

export default SummaryCards;
