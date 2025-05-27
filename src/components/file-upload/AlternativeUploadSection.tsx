
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';

interface AlternativeUploadSectionProps {
  setLastOrdersData: (data: any[]) => void;
  setReports: (reports: any[]) => void;
  setRapidDeliveryReport: (report: any) => void;
  setSelectedReport: (shop: string | null) => void;
  customCommissions: any[];
  hasUploadedCustomCommissions: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AlternativeUploadSection: React.FC<AlternativeUploadSectionProps> = ({
  setLastOrdersData,
  setReports,
  setRapidDeliveryReport,
  setSelectedReport,
  customCommissions,
  hasUploadedCustomCommissions,
  isLoading,
  setIsLoading
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-medium mb-4">Alternative Method</h3>
      <Card>
        <CardContent className="pt-6">
          <FileUpload 
            setOrdersData={setLastOrdersData}
            setReports={setReports}
            setRapidDeliveryReport={setRapidDeliveryReport}
            setSelectedReport={setSelectedReport}
            customCommissions={customCommissions}
            hasUploadedCustomCommissions={hasUploadedCustomCommissions}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AlternativeUploadSection;
