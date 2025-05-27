
import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CorsAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisitCorsDemo: () => void;
}

const CorsAccessDialog: React.FC<CorsAccessDialogProps> = ({
  open,
  onOpenChange,
  onVisitCorsDemo
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Enable CORS Access</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-3">
              Follow these steps carefully to enable API access:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li className="font-medium">Click the button below to open the CORS Anywhere service</li>
              <li>On that page, click the <span className="font-medium text-primary">"Request temporary access to the demo server"</span> button</li>
              <li>Wait for the page to confirm access with the message: <span className="font-medium text-green-600">"You currently have temporary access to the demo server"</span></li>
              <li>Close that tab and return here</li>
              <li>Click the "Test Connection" button again</li>
            </ol>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-blue-700 dark:text-blue-300 text-sm mt-4">
              <p className="font-medium">Troubleshooting Tips:</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-sm">
                <li>Make sure you see the confirmation message before returning</li>
                <li>If still having issues, try refreshing this page after getting access</li>
                <li>Ensure you're using the same browser for both steps</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onVisitCorsDemo} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open CORS Access Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CorsAccessDialog;
