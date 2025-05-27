
import React from 'react';
import { ShopSummary, formatCurrency } from '@/lib/csv';
import { cn } from '@/lib/utils';
import TableCell from './TableCell';

interface OrderTableFooterProps {
  summary: ShopSummary;
}

const OrderTableFooter: React.FC<OrderTableFooterProps> = ({ summary }) => {
  return (
    <tfoot className="bg-secondary/50 font-medium">
      <tr>
        <TableCell colSpan={3} className="text-left">TOTAL</TableCell>
        <TableCell className="text-right">-</TableCell>
        <TableCell className="text-right">{summary.totalQuantity}</TableCell>
        <TableCell className="text-right">{formatCurrency(summary.totalGrossSales)}</TableCell>
        <TableCell className="text-right text-destructive">
          {summary.totalReturns > 0 ? `(${formatCurrency(summary.totalReturns)})` : '-'}
        </TableCell>
        <TableCell className="text-right">{formatCurrency(summary.totalNetSales)}</TableCell>
        <TableCell className="text-right">{formatCurrency(summary.totalCommission)}</TableCell>
        <TableCell className="text-right font-bold">
          {summary.totalPayment < 0 ? 
            <span className="text-destructive">{`(${formatCurrency(Math.abs(summary.totalPayment))})`}</span> : 
            formatCurrency(summary.totalPayment)
          }
        </TableCell>
      </tr>
    </tfoot>
  );
};

export default OrderTableFooter;
