
import React from 'react';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ConnectionStatusAlertProps {
  isConnected: boolean;
  needsCorsAccess: boolean;
  connectionError: string | null;
  onGetCorsAccess: () => void;
}

const ConnectionStatusAlert: React.FC<ConnectionStatusAlertProps> = ({
  isConnected,
  needsCorsAccess,
  connectionError,
  onGetCorsAccess
}) => {
  if (isConnected) {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3 flex items-center gap-3 text-green-700 dark:text-green-300 mb-4">
        <Check className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium">Connected to Shopify</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            sustainlocal.myshopify.com is successfully connected
          </p>
        </div>
      </div>
    );
  }

  if (needsCorsAccess) {
    return (
      <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 flex items-center gap-3 text-amber-700 dark:text-amber-300 mb-4">
        <Info className="h-5 w-5 text-amber-500" />
        <div>
          <p className="font-medium">CORS Access Required</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            One-time browser permission needed to connect to the Shopify API
          </p>
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 border-amber-200 text-amber-700"
            onClick={onGetCorsAccess}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get CORS Access
          </Button>
        </div>
      </div>
    );
  }

  if (connectionError && !needsCorsAccess) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 flex items-center gap-3 text-red-700 dark:text-red-300 mb-4">
        <Info className="h-5 w-5 text-red-500" />
        <div>
          <p className="font-medium">Connection Error</p>
          <p className="text-sm text-red-600 dark:text-red-400">{connectionError}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ConnectionStatusAlert;
