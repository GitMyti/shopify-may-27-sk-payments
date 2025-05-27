
export interface ShopOrder {
  orderNumber: string;
  orderDate: string;
  paidAt?: string;
  productTitle: string;
  itemPrice: number;
  quantity: number;
  grossSales: number;
  returns: number;
  netSales: number;
  commissionPercentage: number;
  commissionAmount: number;
  totalPayment: number;
  isDeliveryCharge?: boolean;
}

export interface ShopSummary {
  totalOrders: number;
  totalQuantity: number;
  totalGrossSales: number;
  totalReturns: number;
  totalNetSales: number;
  totalCommission: number;
  totalPayment: number;
}

export interface ShopReport {
  shopName: string;
  orders: ShopOrder[];
  summary: ShopSummary;
}

export interface ShopifyOrder {
  Name?: string;
  'Created at'?: string;
  'Paid at'?: string;
  'Lineitem name'?: string;
  'Lineitem price'?: string;
  'Lineitem quantity'?: string;
  'Lineitem fulfillment status'?: string;
  'Product Title'?: string;
  'Net Items'?: string;
  'Financial Status'?: string;
  Vendor?: string;
  'Billing Name'?: string;
  'Shipping Name'?: string;
  'Is Delivery Charge'?: string;
  [key: string]: any;
}

export interface RapidDeliveryOrder {
  orderNumber: string;
  orderDate: string;
  billingName: string;
  deliveryName: string;
  deliveryCharge: number;
  shopName: string;
}

export interface RapidDeliverySummary {
  totalDeliveries: number;
  totalCharges: number;
  byShop: {
    [shopName: string]: {
      totalDeliveries: number;
      totalCharges: number;
    };
  };
}

export interface RapidDeliveryReport {
  orders: RapidDeliveryOrder[];
  summary: RapidDeliverySummary;
}
