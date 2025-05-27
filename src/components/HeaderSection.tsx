
import React from 'react';
import Header from './Header';
import DesktopCommissionSettings from './DesktopCommissionSettings';
import { ShopCommission } from '@/lib/excel/types';

interface HeaderSectionProps {
  onCommissionsUploaded: (commissions: ShopCommission[]) => void;
  customCommissions: ShopCommission[];
  onResetToDefault: () => void;
  hasUploadedCustomCommissions: boolean;
  lastUpdated?: Date;
  logo: string;
  dataSource?: string; // Add data source parameter
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  onCommissionsUploaded,
  customCommissions,
  onResetToDefault,
  hasUploadedCustomCommissions,
  lastUpdated,
  logo,
  dataSource = 'CSV Upload' // Default value
}) => {
  return (
    <div className="space-y-6 pb-4">
      <Header logo={logo} dataSource={dataSource} />
      <DesktopCommissionSettings 
        onCommissionsUploaded={onCommissionsUploaded}
        customCommissions={customCommissions}
        onResetToDefault={onResetToDefault}
        hasUploadedCustomCommissions={hasUploadedCustomCommissions}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default HeaderSection;
