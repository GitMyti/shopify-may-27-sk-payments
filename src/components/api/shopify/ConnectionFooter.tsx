
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Loader2, RefreshCcw } from 'lucide-react';

interface ConnectionFooterProps {
  isConnected: boolean;
  isLoading: boolean;
  onTestConnection: () => void;
  onResetConnection?: () => void;
}

const ConnectionFooter: React.FC<ConnectionFooterProps> = ({
  isConnected,
  isLoading,
  onTestConnection,
  onResetConnection
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between">
      <div className="text-sm">
        {isConnected ? (
          <span className="text-green-600 dark:text-green-400 flex items-center gap-1.5">
            <Check className="h-4 w-4" /> Connected to Shopify
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4" /> Not connected
            </span>
            {onResetConnection && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                onClick={onResetConnection}
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        )}
      </div>
      <Button 
        onClick={onTestConnection}
        disabled={isLoading}
        className="relative gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            {isConnected ? <Check className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
            Test Connection
          </>
        )}
      </Button>
    </div>
  );
};

export default ConnectionFooter;
