
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Update the interface to match how the component is being used
interface FileUploadProps {
  onFileAccepted?: (file: File) => void;
  className?: string;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  setOrdersData?: (data: any[]) => void;
  setReports?: (reports: any[]) => void;
  setRapidDeliveryReport?: (report: any) => void;
  setSelectedReport?: (shop: string | null) => void;
  customCommissions?: any[];
  hasUploadedCustomCommissions?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileAccepted, 
  className,
  isLoading,
  setIsLoading,
  setOrdersData,
  setReports,
  setRapidDeliveryReport,
  setSelectedReport,
  customCommissions,
  hasUploadedCustomCommissions
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Relaxed type checking (some CSV files may have different MIME types)
    const isCSV = file.type === 'text/csv' || 
                  file.name.endsWith('.csv') || 
                  file.type === 'application/vnd.ms-excel' ||
                  file.type === 'application/octet-stream';
                  
    if (!isCSV) {
      console.log('File type rejected:', file.type, file.name);
      toast.error('Please upload a CSV file');
      return;
    }

    console.log('Accepting file:', file.name, file.type);
    setUploading(true);
    
    // Process the file immediately
    setUploadedFile(file);
    
    if (onFileAccepted) {
      onFileAccepted(file);
    } else if (setOrdersData && setReports && setRapidDeliveryReport && setSelectedReport && 
               setIsLoading && customCommissions) {
      // Handle the file with the alternative API
      if (setIsLoading) setIsLoading(true);
      import('@/lib/csv').then(async (module) => {
        try {
          const orders = await module.parseCSV(file);
          
          if (orders.length === 0) {
            toast.error('No valid order data found in the CSV file');
            if (setIsLoading) setIsLoading(false);
            return;
          }
          
          if (setOrdersData) setOrdersData(orders);
          
          const { extractDateRange } = module;
          const extractedRange = extractDateRange(orders);
          
          // Process shop reports
          const { processOrderData, processRapidDeliveries } = module;
          const shopReports = processOrderData(orders, customCommissions || []);
          
          shopReports.sort((a, b) => a.shopName.localeCompare(b.shopName));
          
          if (setReports) setReports(shopReports);
          
          // Process rapid delivery report separately
          const rapidDeliveryReport = processRapidDeliveries(orders);
          if (setRapidDeliveryReport) setRapidDeliveryReport(rapidDeliveryReport);
          
          if (shopReports.length === 1 && setSelectedReport) {
            setSelectedReport(shopReports[0].shopName);
          }
          
          toast.success(`Processed ${orders.length} orders from ${shopReports.length} shops with ${rapidDeliveryReport.orders.length} rapid deliveries`);
        } catch (error) {
          console.error('Error processing CSV file:', error);
          toast.error('Failed to process the CSV file. Please check the format.');
        } finally {
          if (setIsLoading) setIsLoading(false);
        }
      });
    }
    
    setUploading(false);
    toast.success('File uploaded successfully');
    
  }, [onFileAccepted, setOrdersData, setReports, setRapidDeliveryReport, setSelectedReport, setIsLoading, customCommissions, hasUploadedCustomCommissions]);

  const removeFile = () => {
    setUploadedFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'application/octet-stream': ['.csv'],
    },
    maxFiles: 1,
    disabled: uploading || !!uploadedFile || isLoading,
    noClick: false,
    noKeyboard: false,
    noDrag: false,
  });

  return (
    <div className={cn('w-full transition-medium', className)}>
      {!uploadedFile ? (
        <div 
          {...getRootProps()} 
          className={cn(
            'relative w-full rounded-xl border-2 border-dashed border-muted-foreground/30 p-12 text-center transition-colors',
            'hover:bg-muted/30 hover:border-primary/50 cursor-pointer',
            isDragActive && 'border-primary bg-accent/20',
            uploading && 'opacity-80 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              className={cn(
                'rounded-full p-4 bg-orange-500 transition-transform duration-500',
                isDragActive ? 'scale-110' : 'scale-100'
              )}
            >
              <Upload 
                className={cn(
                  'h-8 w-8 text-white transition-colors duration-300',
                )} 
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {isDragActive 
                  ? 'Drop your Shopify CSV file here' 
                  : uploading 
                    ? 'Processing...' 
                    : 'Upload your Shopify CSV export'
                }
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Drag and drop your Shopify orders CSV file, or click to browse your files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6 flex items-center justify-between bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium truncate max-w-[200px] sm:max-w-sm">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="rounded-full p-1.5 bg-red-100 hover:bg-red-200 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
