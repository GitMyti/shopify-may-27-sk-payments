
import React, { useEffect } from 'react';
import { ShopReport } from '@/lib/csv';
import OrderTableHeader from './OrderTableHeader';
import OrderTableRow from './OrderTableRow';
import OrderTableFooter from './OrderTableFooter';

interface OrdersTableProps {
  report: ShopReport;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ report }) => {
  const { orders, summary } = report;
  
  // Debug returns in all orders
  const ordersWithReturns = orders.filter(order => order.returns > 0);
  const returnsCount = ordersWithReturns.length;
  
  // Check for multi-item orders with returns
  const multiItemOrderNumbers = new Set<string>();
  orders.forEach(order => {
    if (order.returns > 0) {
      multiItemOrderNumbers.add(order.orderNumber);
    }
  });
  
  // Count how many items each order has
  const orderItemCounts: Record<string, number> = {};
  orders.forEach(order => {
    if (!orderItemCounts[order.orderNumber]) {
      orderItemCounts[order.orderNumber] = 0;
    }
    orderItemCounts[order.orderNumber]++;
  });
  
  // Identify multi-item orders with returns
  const multiItemOrdersWithReturns = Array.from(multiItemOrderNumbers)
    .filter(orderNum => orderItemCounts[orderNum] > 1)
    .map(orderNum => ({
      orderNumber: orderNum,
      itemCount: orderItemCounts[orderNum],
      returns: orders
        .filter(o => o.orderNumber === orderNum)
        .reduce((sum, o) => sum + o.returns, 0)
    }));
  
  // Debug specific order numbers we want to track
  const debugOrderNumbers = ['#4261', '#4268', '#4280'];
  const debugOrders = orders.filter(order => debugOrderNumbers.includes(order.orderNumber));
  
  useEffect(() => {
    // Log information about returns on initial render
    if (returnsCount > 0) {
      console.log(`Found ${returnsCount} orders with returns in the report for ${report.shopName}:`);
      ordersWithReturns.forEach(order => {
        console.log(`  Order ${order.orderNumber}: Return amount = ${order.returns}, Product = ${order.productTitle}`);
      });
    }
    
    // Log multi-item orders with returns
    if (multiItemOrdersWithReturns.length > 0) {
      console.log(`Found ${multiItemOrdersWithReturns.length} multi-item orders with returns:`);
      multiItemOrdersWithReturns.forEach(order => {
        console.log(`  Multi-item Order ${order.orderNumber}: ${order.itemCount} items, total return = ${order.returns}`);
      });
    }
    
    // Specifically check for our problematic orders
    debugOrders.forEach(order => {
      const isMultiItem = orderItemCounts[order.orderNumber] > 1;
      console.log(`Checking debug order ${order.orderNumber} in report${isMultiItem ? ` (MULTI-ITEM: ${orderItemCounts[order.orderNumber]} items)` : ''}:`);
      console.log(`  Has return: ${order.returns > 0}`);
      console.log(`  Product: ${order.productTitle}`);
      console.log(`  Return amount: ${order.returns}`);
      console.log(`  This would have been calculated based on Financial Status (order level) and Lineitem fulfillment status (item level)`);
    });
  }, [orders, returnsCount, report.shopName, debugOrders, multiItemOrdersWithReturns]);
  
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Order Details
        {returnsCount > 0 && (
          <span className="text-sm text-destructive ml-2">
            ({returnsCount} {returnsCount === 1 ? 'return' : 'returns'})
          </span>
        )}
        {multiItemOrdersWithReturns.length > 0 && (
          <span className="text-xs text-amber-500 ml-2">
            ({multiItemOrdersWithReturns.length} multi-item orders with returns)
          </span>
        )}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <OrderTableHeader />
          <tbody className="divide-y divide-border">
            {orders.map((order, index) => (
              <OrderTableRow 
                key={`${order.orderNumber}-${index}`}
                order={order}
                index={index}
                isMultiItem={orderItemCounts[order.orderNumber] > 1}
                itemCount={orderItemCounts[order.orderNumber]}
              />
            ))}
          </tbody>
          <OrderTableFooter summary={summary} />
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
