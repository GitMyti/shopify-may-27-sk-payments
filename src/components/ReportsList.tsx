
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShopReport as ShopReportType, formatCurrency } from '@/lib/csv';
import ExportSummaryButton from './report/ExportSummaryButton';

interface ReportsListProps {
  reports: ShopReportType[];
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  selectedReport: string | null;
  setSelectedReport: (report: string | null) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  expanded,
  setExpanded,
  selectedReport,
  setSelectedReport
}) => {
  if (reports.length === 0) return null;
  
  // Sort reports alphabetically by shop name
  const sortedReports = [...reports].sort((a, b) => 
    a.shopName.localeCompare(b.shopName)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="glass-card mb-8 overflow-hidden">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/50">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">Available Shop Reports</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                {reports.length}
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <ExportSummaryButton reports={reports} />
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sortedReports.map((report) => (
                  <button
                    key={report.shopName}
                    onClick={() => setSelectedReport(report.shopName)}
                    className={cn(
                      "text-left p-4 rounded-lg transition-all",
                      "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40",
                      selectedReport === report.shopName 
                        ? "bg-primary/10 ring-2 ring-primary/40" 
                        : "bg-secondary/50"
                    )}
                  >
                    <div className="font-medium mb-1">{report.shopName}</div>
                    <div className="text-xs text-muted-foreground">
                      {report.summary.totalOrders} orders • {formatCurrency(report.summary.totalPayment)} total payout
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReportsList;
