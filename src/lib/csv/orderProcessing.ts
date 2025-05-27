import { ShopifyOrder, ShopOrder } from './types';
import { calculateReturns } from './returns';
import { RAPID_DELIVERY_CHARGE } from './rapid-delivery';

export function processOrder(
  order: ShopifyOrder, 
  commissionPercentage: number, 
  orderItems?: ShopifyOrder[]
): ShopOrder {
  // Check if this is a Rapid Delivery order
  const productTitle = order['Lineitem name'] || order['Product Title'] || '';
  const isRapidDeliveryOrder = 
    productTitle.toLowerCase().includes('local delivery') || 
    productTitle.toLowerCase().includes('pickup') ||
    productTitle.toLowerCase().includes('rapid delivery'); // Add support for "Rapid Delivery"

  // Extract basic order info
  const orderNumber = order.Name || '';
  const orderDate = order['Created at'] ? order['Created at'].split(' ')[0] : '';
  const paidAt = order['Paid at'] ? order['Paid at'].split(' ')[0] : '';
  
  // Log multi-item orders
  const isMultiItemOrder = orderItems && orderItems.length > 1;
  if (isMultiItemOrder) {
    console.log(`Processing MULTI-ITEM order ${orderNumber} with ${orderItems!.length} items`);
  }
  
  // Special debugging for specific order numbers we want to track
  if (orderNumber === '4268' || orderNumber === '4280' || orderNumber === '4261') {
    console.log(`Processing special order ${orderNumber} ${isMultiItemOrder ? `(MULTI-ITEM: ${orderItems!.length} items)` : ''}`);
    console.log(`  Product: ${productTitle}`);
    console.log(`  Financial Status (order level): ${order['Financial Status']}`);
    console.log(`  Lineitem fulfillment status (item level): ${order['Lineitem fulfillment status']}`);
    
    // For multi-item orders, log each item's details
    if (isMultiItemOrder && orderItems) {
      console.log(`  All items in order ${orderNumber}:`);
      orderItems.forEach((item, idx) => {
        console.log(`    Item ${idx + 1}: ${item['Lineitem name']}`);
        console.log(`      Financial Status: ${item['Financial Status'] || 'not set'}`);
        console.log(`      Fulfillment Status: ${item['Lineitem fulfillment status'] || 'not set'}`);
      });
    }
  }
  
  // Get the vendor name to check for Myti vendors that should have 0% commission
  const vendor = order.Vendor || '';
  const isMytiVendor = vendor === 'Myti' || vendor === 'Myti Concept Shop';
  
  // Special handling for Rapid Delivery orders - ALWAYS set commissionPercentage to 0
  if (isRapidDeliveryOrder) {
    console.log(`Processing Myti Rapid order: ${orderNumber} with title "${productTitle}"`);
    console.log(`  Vendor: ${order.Vendor}, Financial Status (order level): ${order['Financial Status'] || 'N/A'}`);
    
    return {
      orderNumber,
      orderDate,
      paidAt,
      productTitle,
      itemPrice: RAPID_DELIVERY_CHARGE,
      quantity: 1,
      grossSales: RAPID_DELIVERY_CHARGE,
      returns: 0,
      netSales: RAPID_DELIVERY_CHARGE,
      commissionPercentage: 0, // No commission for delivery - always 0%
      commissionAmount: 0,
      totalPayment: -RAPID_DELIVERY_CHARGE, // Negative amount to represent a debit
      isDeliveryCharge: true
    };
  }

  // Log orders for debugging - specifically for Nu Chocolat and Phoenix Books
  if (vendor.includes('Nu Chocolat') || vendor.includes('Phoenix Books')) {
    console.log(`Processing ${vendor} order ${orderNumber}, commission: ${commissionPercentage}%`);
  }
  
  // Existing logic for non-delivery orders
  const itemPrice = Number(order['Lineitem price']) || 0;
  const quantity = parseInt(order['Lineitem quantity'] || order['Net Items'] || '0', 10) || 0;
  
  // Calculate gross sales from price and quantity
  const grossSales = itemPrice * quantity;
  
  // Calculate returns using the dedicated function that now checks per line item
  // Always pass ALL order items for multi-item return calculation
  const returns = calculateReturns(order, orderItems);
  
  // Enhanced debugging for problematic orders
  if (orderNumber === '4268' || orderNumber === '4280' || orderNumber === '4261' || isMultiItemOrder) {
    console.log(`Order ${orderNumber} details: ${isMultiItemOrder ? `(MULTI-ITEM: ${orderItems!.length} items)` : ''}`);
    console.log(`  Item: ${productTitle}, Price: ${itemPrice}, Quantity: ${quantity}`);
    console.log(`  Returns calculated: ${returns}`);
    console.log(`  Gross sales: ${grossSales}, Net sales: ${grossSales - returns}`);
  }
  
  // Calculate net sales
  const netSales = grossSales - returns;
  
  // Set 0% commission for Myti vendors
  const finalCommissionPercentage = isMytiVendor ? 0 : commissionPercentage;
  
  // Calculate commission amount
  const commissionAmount = (netSales * finalCommissionPercentage) / 100;
  
  // Calculate total payment to shop
  const totalPayment = netSales - commissionAmount;
  
  return {
    orderNumber,
    orderDate,
    paidAt,
    productTitle,
    itemPrice,
    quantity,
    grossSales,
    returns,
    netSales,
    commissionPercentage: finalCommissionPercentage, // Use the modified commission percentage
    commissionAmount,
    totalPayment,
    isDeliveryCharge: false
  };
}
