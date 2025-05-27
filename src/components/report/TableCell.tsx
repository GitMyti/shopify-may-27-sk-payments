
import React from 'react';
import { cn } from "@/lib/utils";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

const TableCell: React.FC<TableCellProps> = ({ children, className, colSpan }) => (
  <td className={cn("px-3 py-3 text-sm", className)} colSpan={colSpan}>
    {children}
  </td>
);

export default TableCell;
