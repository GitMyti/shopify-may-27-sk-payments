
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  logo: string;
  dataSource?: string;
}

const Header: React.FC<HeaderProps> = ({ logo, dataSource }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center gap-3 mb-4 sm:mb-0">
        <img src={logo} alt="Burlington Collective" className="h-16 w-auto" />
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">Shop Reports</h1>
          <p className="text-muted-foreground text-sm">
            Generate reports for all shops in the collective
          </p>
        </div>
      </div>
      
      {dataSource && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
            Data Source: {dataSource}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default Header;
