
import React from 'react';
import TableHeader from './TableHeader';

const OrderTableHeader: React.FC = () => {
  return (
    <thead className="border-b border-border">
      <tr>
        <TableHeader>Order #</TableHeader>
        <TableHeader>Date</TableHeader>
        <TableHeader>Product</TableHeader>
        <TableHeader className="text-right">Price</TableHeader>
        <TableHeader className="text-right">Qty</TableHeader>
        <TableHeader className="text-right">Gross Sales</TableHeader>
        <TableHeader className="text-right">Returns</TableHeader>
        <TableHeader className="text-right">Net Sales</TableHeader>
        <TableHeader className="text-right">Commission</TableHeader>
        <TableHeader className="text-right">Payment</TableHeader>
      </tr>
    </thead>
  );
};

export default OrderTableHeader;
