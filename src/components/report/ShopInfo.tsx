
import React from 'react';
import { ShopReport } from '@/lib/csv';

interface ShopInfoProps {
  report: ShopReport;
}

const ShopInfo: React.FC<ShopInfoProps> = ({ report }) => {
  const { shopName, orders, summary } = report;
  
  // Determine the shop's commission rate correctly:
  // Get the commission percentage from non-delivery orders since those are always 0%
  const regularOrders = orders.filter(order => !order.isDeliveryCharge);
  const commissionPercentage = regularOrders.length > 0 
    ? regularOrders[0].commissionPercentage 
    : 10; // Default fallback
  
  console.log(`ShopInfo: ${shopName} commission rate is ${commissionPercentage}%`);
  
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          Shop Report
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
          {commissionPercentage}% Commission
        </span>
      </div>
      <h2 className="mt-2 text-2xl font-bold">{shopName}</h2>
      <p className="text-sm text-muted-foreground mt-1">
        {summary.totalOrders} orders • {summary.totalQuantity} items
      </p>
    </div>
  );
};

export default ShopInfo;
