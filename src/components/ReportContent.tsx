
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReportsList from '@/components/ReportsList';
import ShopReport from '@/components/ShopReport';
import NoReportSelected from '@/components/NoReportSelected';
import { ShopReport as ShopReportType, RapidDeliveryReport as RapidDeliveryReportType } from '@/lib/csv';
import RapidDeliveryReport from '@/components/RapidDeliveryReport';
import { normalizeShopNameForComparison } from '@/lib/csv/processor';
import { useRapidDeliveryData } from '@/contexts/RapidDeliveryContext';

interface ReportContentProps {
  reports: ShopReportType[];
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  selectedReport: string | null;
  setSelectedReport: (report: string | null) => void;
  rapidDeliveryReport?: RapidDeliveryReportType;
}

const ReportContent: React.FC<ReportContentProps> = ({
  reports,
  expanded,
  setExpanded,
  selectedReport,
  setSelectedReport,
  rapidDeliveryReport
}) => {
  const { setRapidDeliveryReport } = useRapidDeliveryData();
  
  // Save rapid delivery report to context
  useEffect(() => {
    if (rapidDeliveryReport) {
      setRapidDeliveryReport(rapidDeliveryReport);
    }
  }, [rapidDeliveryReport, setRapidDeliveryReport]);
  
  if (reports.length === 0) return null;
  
  const selectedReportData = reports.find(report => 
    normalizeShopNameForComparison(report.shopName) === normalizeShopNameForComparison(selectedReport)
  );

  // If we have a selected report, verify its commission rate
  if (selectedReportData) {
    const regularOrders = selectedReportData.orders.filter(order => !order.isDeliveryCharge);
    if (regularOrders.length > 0) {
      console.log(`Selected shop ${selectedReportData.shopName} commission from first regular order: ${regularOrders[0].commissionPercentage}%`);
    }
  }

  // Check if there are any rapid delivery orders
  const hasRapidDeliveryReport = rapidDeliveryReport && rapidDeliveryReport.orders.length > 0;
  
  // Check for rapid deliveries using normalized comparison for the selected shop
  // This must be completely independent of commission rates
  const normalizedSelectedShop = selectedReport ? normalizeShopNameForComparison(selectedReport) : '';
  
  // Log all rapid delivery orders shop names for debugging
  if (hasRapidDeliveryReport && selectedReport) {
    console.log(`Checking rapid deliveries for shop: "${selectedReport}" (normalized: "${normalizedSelectedShop}")`);
    console.log('All rapid delivery orders:', rapidDeliveryReport?.orders);
    
    // Log all shop names in rapid delivery orders
    const allShops = rapidDeliveryReport?.orders.map(order => ({
      original: order.shopName,
      normalized: normalizeShopNameForComparison(order.shopName)
    }));
    
    console.log('All rapid delivery shops with normalization:', allShops);
  }
  
  // Find matching orders with proper normalization - ensure we catch all delivery types
  // including the new "Rapid Delivery" type
  const matchingRapidOrders = hasRapidDeliveryReport && selectedReport 
    ? rapidDeliveryReport?.orders.filter(
        order => normalizeShopNameForComparison(order.shopName) === normalizedSelectedShop
      ) 
    : [];
  
  const hasRapidDeliveries = matchingRapidOrders && matchingRapidOrders.length > 0;
  
  console.log(`Selected shop: ${selectedReport}, has rapid deliveries: ${hasRapidDeliveries} (found ${matchingRapidOrders?.length || 0} orders)`);

  return (
    <>
      <ReportsList 
        reports={reports}
        expanded={expanded}
        setExpanded={setExpanded}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />
      
      <AnimatePresence mode="sync">
        {selectedReportData ? (
          <>
            <ShopReport report={selectedReportData} />
            
            {hasRapidDeliveries && rapidDeliveryReport && selectedReport && (
              <RapidDeliveryReport 
                report={{
                  orders: matchingRapidOrders,
                  summary: {
                    totalDeliveries: matchingRapidOrders.length,
                    totalCharges: matchingRapidOrders.reduce((sum, order) => sum + order.deliveryCharge, 0),
                    byShop: {
                      [selectedReport]: {
                        totalDeliveries: matchingRapidOrders.length,
                        totalCharges: matchingRapidOrders.reduce((sum, order) => sum + order.deliveryCharge, 0)
                      }
                    }
                  }
                }}
              />
            )}
          </>
        ) : (
          <NoReportSelected key="no-report-selected" setExpanded={setExpanded} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportContent;
