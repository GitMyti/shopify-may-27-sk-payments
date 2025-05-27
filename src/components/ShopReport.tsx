
import React from 'react';
import { motion } from 'framer-motion';
import { ShopReport as ShopReportType } from '@/lib/csv';
import { cn } from '@/lib/utils';
import ReportHeader from './report/ReportHeader';
import SummaryCards from './report/SummaryCards';
import OrdersTable from './report/OrdersTable';

interface ShopReportProps {
  report: ShopReportType;
  className?: string;
}

const ShopReport: React.FC<ShopReportProps> = ({ report, className }) => {
  // Calculate Rapid Delivery charges for this shop
  const rapidDeliveryOrders = report.orders.filter(order => order.isDeliveryCharge);
  const rapidDeliveryCharges = rapidDeliveryOrders.reduce((sum, order) => sum + Math.abs(order.totalPayment), 0);
  
  // Add rapid delivery charges to the report for use in SummaryCards
  const reportWithDelivery = {
    ...report,
    rapidDeliveryCharges
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card overflow-hidden', className)}
    >
      <ReportHeader report={report} />
      <SummaryCards report={reportWithDelivery} />
      <OrdersTable report={report} />
    </motion.div>
  );
};

export default ShopReport;
