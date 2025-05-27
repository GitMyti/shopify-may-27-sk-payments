
import React from 'react';
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  valueClassName?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, description, valueClassName }) => (
  <div className="glass p-4 rounded-xl flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
    </div>
    <span className={cn("text-xl font-semibold", valueClassName)}>{value}</span>
    {description && <span className="text-xs text-muted-foreground mt-1">{description}</span>}
  </div>
);

export default SummaryCard;
