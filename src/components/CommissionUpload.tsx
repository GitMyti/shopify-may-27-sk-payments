
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, File, X, Download, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { parseCommissionExcel, generateExampleCommissionFile, ShopCommission } from '@/lib/excelParser';

interface CommissionUploadProps {
  onCommissionsUploaded: (commissions: ShopCommission[]) => void;
  className?: string;
}

const CommissionUpload: React.FC<CommissionUploadProps> = ({ 
  onCommissionsUploaded, 
  className 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setError(null);
    const file = acceptedFiles[0];
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel' ||
                   file.name.endsWith('.xlsx') || 
                   file.name.endsWith('.xls');
    
    if (!isExcel) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    
    setUploading(true);
    setUploadedFile(file);
    
    parseCommissionExcel(file)
      .then(commissions => {
        if (commissions.length === 0) {
          setError('No valid commission data found in the Excel file');
          toast.error('No valid commission data found in the Excel file');
          setUploadedFile(null);
          return;
        }
        
        onCommissionsUploaded(commissions);
        toast.success(`Loaded commission rates for ${commissions.length} shops`);
      })
      .catch(error => {
        console.error('Error processing Excel file:', error);
        setError(error.message || 'Failed to process the Excel file. Please check the format.');
        toast.error(error.message || 'Failed to process the Excel file. Please check the format.');
        setUploadedFile(null);
      })
      .finally(() => {
        setUploading(false);
      });
  }, [onCommissionsUploaded]);
  
  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: uploading
  });
  
  const handleDownloadTemplate = () => {
    generateExampleCommissionFile();
    toast.success('Template downloaded');
  };
  
  return (
    <div className={cn('w-full transition-medium', className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Custom Commission Rates</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownloadTemplate}
          className="h-8 px-2 text-xs"
        >
          <Download className="h-3 w-3 mr-1" />
          Template
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2 text-xs">
              <p>Make sure your Excel file:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Has a column for shop names (named "Shop Name", "Vendor", or "product_vendor")</li>
                <li>Has a column for commission rates (named "Commission", "Rate", or "Commission %")</li>
                <li>Contains valid percentage values in the commission column</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {!uploadedFile ? (
        <div 
          {...getRootProps()} 
          className={cn(
            'relative w-full rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center transition-colors',
            'hover:bg-secondary/50 hover:border-primary/50 cursor-pointer',
            isDragActive && 'border-primary bg-accent',
            uploading && 'opacity-80 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {isDragActive 
                ? 'Drop Excel file here' 
                : uploading 
                  ? 'Processing...' 
                  : 'Upload commission rates (.xlsx)'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-accent/50">
                <File className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[150px]">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="rounded-full p-1 bg-secondary hover:bg-accent/70 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionUpload;
