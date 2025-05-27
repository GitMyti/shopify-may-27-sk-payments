
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoReportSelectedProps {
  setExpanded: (expanded: boolean) => void;
}

const NoReportSelected: React.FC<NoReportSelectedProps> = ({ setExpanded }) => {
  return (
    <div className="glass-card p-12 text-center">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="p-3 rounded-full bg-secondary">
          <Info className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Select a Shop Report</h3>
        <p className="text-muted-foreground">
          Choose a shop from the list above to view its detailed report with commission calculations.
        </p>
        <Button
          onClick={() => setExpanded(true)}
          variant="outline"
          className="mt-2"
        >
          View Available Shops
        </Button>
      </div>
    </div>
  );
};

export default NoReportSelected;
