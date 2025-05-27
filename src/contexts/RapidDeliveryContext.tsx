
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { RapidDeliveryReport } from '@/lib/csv';

interface RapidDeliveryContextType {
  rapidDeliveryReport: RapidDeliveryReport | undefined;
  setRapidDeliveryReport: (report: RapidDeliveryReport | undefined) => void;
}

const RapidDeliveryContext = createContext<RapidDeliveryContextType | undefined>(undefined);

export const RapidDeliveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rapidDeliveryReport, setRapidDeliveryReport] = useState<RapidDeliveryReport | undefined>(undefined);

  return (
    <RapidDeliveryContext.Provider value={{ rapidDeliveryReport, setRapidDeliveryReport }}>
      {children}
    </RapidDeliveryContext.Provider>
  );
};

export const useRapidDeliveryData = (): RapidDeliveryContextType => {
  const context = useContext(RapidDeliveryContext);
  if (context === undefined) {
    throw new Error('useRapidDeliveryData must be used within a RapidDeliveryProvider');
  }
  return context;
};
