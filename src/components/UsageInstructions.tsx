
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UsageInstructions: React.FC = () => {
  return (
    <Alert className="mb-8 bg-accent/40 border-accent">
      <div className="flex gap-2">
        <Info className="h-5 w-5 mt-0.5 text-accent-foreground" />
        <div>
          <AlertTitle className="mb-2 font-medium text-accent-foreground">
            How to use this tool
          </AlertTitle>
          <AlertDescription className="text-sm text-accent-foreground/90">
            <ol className="list-decimal pl-5 space-y-2 text-justify">
              <li>
                <strong>Upload commission rates</strong> - Drag and drop your Excel file with shop commission rates or use the upload zone
              </li>
              <li>
                <strong>Import Shopify data</strong> - Drag and drop your Shopify CSV file into the upload zone
              </li>
              <li>
                <strong>Confirm the date range is correct</strong> - This will display dates of orders in the CSV file, not days with no orders
              </li>
            </ol>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default UsageInstructions;
