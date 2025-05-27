
import React from 'react';
import { motion } from 'framer-motion';
import { RapidDeliveryReport as RapidDeliveryReportType } from '@/lib/csv';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/csv/utils';
import RapidDeliveryTable from './report/RapidDeliveryTable';
import RapidDeliverySummary from './report/RapidDeliverySummary';
import RapidDeliveryExportButtons from './report/RapidDeliveryExportButtons';

interface RapidDeliveryReportProps {
  report: RapidDeliveryReportType;
  className?: string;
}

const RapidDeliveryReport: React.FC<RapidDeliveryReportProps> = ({ report, className }) => {
  // Only show if there are orders
  if (!report || !report.orders || report.orders.length === 0) {
    console.log('No Myti Rapid Delivery orders to display');
    return null;
  }
  
  console.log(`Rendering Rapid Delivery Report with ${report.orders.length} orders for: ${report.orders[0].shopName}`);
  console.log('Rapid Delivery orders:', report.orders);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card overflow-hidden mt-8', className)}
    >
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Myti Rapid Delivery</h2>
            <p className="text-muted-foreground">
              {report.summary.totalDeliveries} deliveries • {formatCurrency(report.summary.totalCharges)} total charges
            </p>
          </div>
          <RapidDeliveryExportButtons report={report} />
        </div>
      </div>
      
      <RapidDeliverySummary summary={report.summary} />
      <RapidDeliveryTable orders={report.orders} summary={report.summary} />
    </motion.div>
  );
};

export default RapidDeliveryReport;
