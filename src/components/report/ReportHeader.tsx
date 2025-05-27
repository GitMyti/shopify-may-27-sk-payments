
import React from 'react';
import { ShopReport } from '@/lib/csv';
import ExportButtons from './ExportButtons';
import ShopInfo from './ShopInfo';

interface ReportHeaderProps {
  report: ShopReport;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ report }) => {
  return (
    <div className="p-6 border-b border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ShopInfo report={report} />
        <ExportButtons report={report} />
      </div>
    </div>
  );
};

export default ReportHeader;
