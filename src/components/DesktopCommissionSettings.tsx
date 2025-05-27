
import React, { useState } from 'react';
import { FileEdit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import CommissionUpload from '@/components/CommissionUpload';
import { ShopCommission } from '@/lib/excelParser';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DesktopCommissionSettingsProps {
  onCommissionsUploaded: (commissions: ShopCommission[]) => void;
  customCommissions: ShopCommission[];
  onResetToDefault: () => void;
  hasUploadedCustomCommissions: boolean;
  lastUpdated?: Date;
}

const DesktopCommissionSettings: React.FC<DesktopCommissionSettingsProps> = ({
  onCommissionsUploaded,
  customCommissions,
  onResetToDefault,
  hasUploadedCustomCommissions,
  lastUpdated
}) => {
  const [open, setOpen] = useState(false);
  const formattedDate = lastUpdated ? format(lastUpdated, 'MMM d, yyyy h:mm a') : 'Never';
  
  // Sort commissions alphabetically
  const sortedCommissions = [...customCommissions].sort((a, b) => 
    a.shopName.localeCompare(b.shopName)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative hidden sm:block">
          <Button 
            variant="outline" 
            size="sm" 
            className="relative gap-2" 
            onClick={() => setOpen(true)}
          >
            <FileEdit className="h-4 w-4" />
            <span>Update Commission File</span>
          </Button>
          {hasUploadedCustomCommissions && (
            <Badge variant="default" className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] bg-[#D946EF] text-white">
              {lastUpdated ? format(lastUpdated, 'MM/dd/yy') : 'Custom'}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Commission Settings</SheetTitle>
          <SheetDescription>
            Upload custom commission rates for your shops.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-muted-foreground">
              Last updated: <span className="font-medium">{formattedDate}</span>
            </p>
          </div>
          <CommissionUpload onCommissionsUploaded={(commissions) => {
            onCommissionsUploaded(commissions);
            // Don't close the sheet here to let user see the updated list
          }} />
        </div>
        
        {sortedCommissions.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Current Commission Rates</h4>
              {hasUploadedCustomCommissions && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onResetToDefault();
                    // Don't close the sheet here to let user see the reset list
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset to Default
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {sortedCommissions.map((commission, index) => (
                <div key={index} className="glass-card p-3 flex justify-between items-center">
                  <span className="text-xs font-medium">{commission.shopName}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {commission.commissionPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <SheetFooter className="mt-6">
          <div className="flex justify-between w-full items-center">
            <div className="text-xs text-muted-foreground">
              {hasUploadedCustomCommissions ? 'Using custom commission rates' : 'Using default commission rates'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DesktopCommissionSettings;
