
import { ShopReport } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function exportToCSV(report: ShopReport): void {
  // Calculate Rapid Delivery charges
  const rapidDeliveryOrders = report.orders.filter(order => order.isDeliveryCharge);
  const rapidDeliveryCharges = rapidDeliveryOrders.reduce((sum, order) => sum + Math.abs(order.totalPayment), 0);
  
  // Calculate net payment (total payment minus rapid delivery charges)
  const netPayment = report.summary.totalPayment - rapidDeliveryCharges;

  const headers = [
    'Order Number',
    'Date',
    'Product Title',
    'Quantity',
    'Gross Sales ($)',
    'Returns ($)',
    'Net Sales ($)',
    'Commission %',
    'Commission Amount ($)',
    'Total Payment ($)'
  ].join(',');
  
  const rows = report.orders.map(order => [
    `"${order.orderNumber}"`,
    `"${order.orderDate}"`,
    `"${order.productTitle}"`,
    order.quantity,
    order.grossSales.toFixed(2),
    order.returns.toFixed(2),
    order.netSales.toFixed(2),
    order.commissionPercentage,
    order.commissionAmount.toFixed(2),
    order.totalPayment.toFixed(2)
  ].join(','));
  
  const summaryRow = [
    `"SUMMARY"`,
    `"TOTAL"`,
    `""`,
    report.summary.totalQuantity,
    report.summary.totalGrossSales.toFixed(2),
    report.summary.totalReturns.toFixed(2),
    report.summary.totalNetSales.toFixed(2),
    '',
    report.summary.totalCommission.toFixed(2),
    report.summary.totalPayment.toFixed(2)
  ].join(',');
  
  const rapidDeliveryRow = [
    `"RAPID DELIVERY"`,
    `""`,
    `""`,
    '',
    '',
    '',
    '',
    '',
    '',
    rapidDeliveryCharges.toFixed(2)
  ].join(',');
  
  const netPaymentRow = [
    `"NET PAYMENT"`,
    `""`,
    `""`,
    '',
    '',
    '',
    '',
    '',
    '',
    netPayment.toFixed(2)
  ].join(',');
  
  const csvContent = [headers, ...rows, '', summaryRow, rapidDeliveryRow, netPaymentRow].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${report.shopName}_report.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
