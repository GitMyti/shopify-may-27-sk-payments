
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AccessTokenInput from './shopify/AccessTokenInput';
import ConnectionStatusAlert from './shopify/ConnectionStatusAlert';
import ConnectionFooter from './shopify/ConnectionFooter';
import CorsAccessDialog from './shopify/CorsAccessDialog';
import { useShopifyConnection } from './shopify/hooks/useShopifyConnection';

interface ShopifyApiSettingsProps {
  className?: string;
  onConnectionSuccess?: () => void;
}

const ShopifyApiSettings: React.FC<ShopifyApiSettingsProps> = ({ 
  className,
  onConnectionSuccess 
}) => {
  const {
    credentials,
    isConnected,
    isLoading,
    connectionError,
    needsCorsAccess,
    showCorsDialog,
    setShowCorsDialog,
    handleInputChange,
    handleTestConnection,
    handleVisitCorsDemo,
    handleResetConnection
  } = useShopifyConnection({ onConnectionSuccess });

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Shopify API Connection</CardTitle>
          <CardDescription>
            Connect to Shopify store: sustainlocal.myshopify.com
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ConnectionStatusAlert 
            isConnected={isConnected}
            needsCorsAccess={needsCorsAccess}
            connectionError={connectionError}
            onGetCorsAccess={() => setShowCorsDialog(true)}
          />
          
          <AccessTokenInput 
            value={credentials.accessToken}
            onChange={handleInputChange}
          />
        </CardContent>
        
        <CardFooter>
          <ConnectionFooter 
            isConnected={isConnected}
            isLoading={isLoading}
            onTestConnection={handleTestConnection}
            onResetConnection={handleResetConnection}
          />
        </CardFooter>
      </Card>
      
      <CorsAccessDialog
        open={showCorsDialog}
        onOpenChange={setShowCorsDialog}
        onVisitCorsDemo={handleVisitCorsDemo}
      />
    </>
  );
};

export default ShopifyApiSettings;
