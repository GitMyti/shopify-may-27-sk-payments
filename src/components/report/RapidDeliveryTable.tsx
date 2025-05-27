
import React from 'react';
import { RapidDeliveryOrder, RapidDeliverySummary } from '@/lib/csv';
import { formatCurrency } from '@/lib/csv/utils';
import TableCell from './TableCell';
import { format } from 'date-fns';
import { normalizeShopNameForComparison } from '@/lib/csv/processor';

interface RapidDeliveryTableProps {
  orders: RapidDeliveryOrder[];
  summary: RapidDeliverySummary;
}

const RapidDeliveryTable: React.FC<RapidDeliveryTableProps> = ({ orders, summary }) => {
  // Format the date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      console.warn(`Failed to format date: "${dateStr}"`, e);
      return dateStr;
    }
  };
  
  // Safe guard against undefined or empty orders
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No delivery data available.</p>
      </div>
    );
  }
  
  // For debugging purposes
  console.log(`RapidDeliveryTable received ${orders.length} orders for shop ${orders[0]?.shopName || 'unknown'}`);
  
  // Group orders by shop - with safety checks and consistent normalization
  const ordersByShop = orders.reduce((acc, order) => {
    if (!order.shopName) return acc;
    
    const shopName = order.shopName;
    
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(order);
    return acc;
  }, {} as { [key: string]: RapidDeliveryOrder[] });
  
  // If no grouped orders, show a message
  if (Object.keys(ordersByShop).length === 0) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No delivery data could be processed.</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Delivery Details by Shop</h3>
      <div className="space-y-8">
        {Object.entries(ordersByShop).map(([shopName, shopOrders]) => (
          <div key={shopName} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">{shopName}</h4>
              <span className="text-sm text-muted-foreground">
                {shopOrders.length} deliveries • 
                {formatCurrency(shopOrders.reduce((sum, order) => sum + order.deliveryCharge, 0))} total
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <TableCell className="font-medium">Order #</TableCell>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell className="font-medium">Billing Name</TableCell>
                    <TableCell className="font-medium">Delivery Name</TableCell>
                    <TableCell className="font-medium text-right">Charge</TableCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shopOrders.map((order, index) => (
                    <tr key={`${order.orderNumber}-${index}`} className={index % 2 === 1 ? 'bg-secondary/20' : ''}>
                      <TableCell>{order.orderNumber || 'N/A'}</TableCell>
                      <TableCell>{formatDate(order.orderDate || '')}</TableCell>
                      <TableCell>{order.billingName || 'N/A'}</TableCell>
                      <TableCell>{order.deliveryName || 'N/A'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(order.deliveryCharge || 0)}</TableCell>
                    </tr>
                  ))}
                  <tr className="bg-secondary/50 font-medium">
                    <TableCell colSpan={4} className="text-left">Shop Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(shopOrders.reduce((sum, order) => sum + order.deliveryCharge, 0))}
                    </TableCell>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-4 border-t border-border">
        <table className="w-full">
          <tfoot>
            <tr className="bg-secondary/50 font-medium">
              <TableCell colSpan={4} className="text-left">OVERALL TOTAL</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(summary.totalCharges || 0)}</TableCell>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RapidDeliveryTable;
