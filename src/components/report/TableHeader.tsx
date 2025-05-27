
import React from 'react';
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => (
  <th className={cn("px-3 py-3 text-sm font-medium text-muted-foreground", className)}>
    {children}
  </th>
);

export default TableHeader;
