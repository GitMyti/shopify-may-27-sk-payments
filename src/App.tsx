
import React from 'react';
import './App.css';
import { DateRangeProvider } from './contexts/DateRangeContext';
import { RapidDeliveryProvider } from './contexts/RapidDeliveryContext';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <DateRangeProvider>
      <RapidDeliveryProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </RapidDeliveryProvider>
    </DateRangeProvider>
  );
}

export default App;
