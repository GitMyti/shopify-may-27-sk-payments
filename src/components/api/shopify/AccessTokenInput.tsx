
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';

interface AccessTokenInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccessTokenInput: React.FC<AccessTokenInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="shop-url">Shop URL</Label>
        <Input 
          id="shop-url" 
          value="sustainlocal.myshopify.com"
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Using sustainlocal.myshopify.com as the default shop
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="access-token">Access Token</Label>
        <Input 
          id="access-token" 
          type="password"
          placeholder="shpat_..." 
          value={value}
          onChange={onChange}
        />
        <p className="text-xs text-muted-foreground">
          Generate a custom app or private app access token with read access to orders
        </p>
      </div>
      
      <div className="text-sm mt-2 p-3 rounded-md bg-muted/50">
        <p className="mb-1 font-medium">How to get your access token:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-1">
          <li>Go to your Shopify admin panel</li>
          <li>Navigate to Apps → App and sales channel settings</li>
          <li>Click "Develop apps for your store" at the bottom</li>
          <li>Create a new app and request access to Orders API</li>
          <li>Install the app and copy the access token</li>
        </ol>
        <a 
          href="https://help.shopify.com/en/manual/apps/app-types/custom-apps" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-primary hover:underline text-xs"
        >
          Shopify Custom App Documentation <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default AccessTokenInput;
