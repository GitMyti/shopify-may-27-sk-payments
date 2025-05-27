
import { ShopOrder, ShopSummary } from './types';

export function calculateSummary(acc: ShopSummary, order: ShopOrder): ShopSummary {
  // If this is a delivery charge, we need to handle it specially
  if (order.isDeliveryCharge) {
    return {
      ...acc,
      totalOrders: acc.totalOrders + 1,
      // Note: delivery charges will have a negative gross sales amount, so this will actually reduce the total
      totalGrossSales: acc.totalGrossSales + order.grossSales,
      totalNetSales: acc.totalNetSales + order.netSales,
      totalCommission: acc.totalCommission + order.commissionAmount,
      totalPayment: acc.totalPayment + order.totalPayment,
    };
  }

  // Regular order calculation
  return {
    totalOrders: acc.totalOrders + 1,
    totalQuantity: acc.totalQuantity + order.quantity,
    totalGrossSales: acc.totalGrossSales + order.grossSales,
    totalReturns: acc.totalReturns + order.returns,
    totalNetSales: acc.totalNetSales + order.netSales,
    totalCommission: acc.totalCommission + order.commissionAmount,
    totalPayment: acc.totalPayment + order.totalPayment,
  };
}

export function createInitialSummary(): ShopSummary {
  return {
    totalOrders: 0,
    totalQuantity: 0,
    totalGrossSales: 0,
    totalReturns: 0,
    totalNetSales: 0,
    totalCommission: 0,
    totalPayment: 0,
  };
}
