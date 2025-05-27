
import { parse } from 'papaparse';
import { ShopifyOrder } from './types';
import { normalizeHeaders } from './headerNormalizer';
import { processCSVData } from './dataProcessor';

export function parseCSV(file: File): Promise<ShopifyOrder[]> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          // Log errors but don't reject unless they're fatal
          console.error('CSV parsing errors:', results.errors);
          const fatalErrors = results.errors.filter(e => e.type === 'Quotes' || e.type === 'Delimiter');
          
          if (fatalErrors.length > 0) {
            reject(fatalErrors);
            return;
          }
        }
        
        const data = results.data as ShopifyOrder[];
        
        // Log headers found in the CSV file for debugging
        console.log('CSV Headers found:', results.meta.fields);
        console.log(`Successfully parsed ${data.length} rows from CSV`);
        
        if (data.length === 0) {
          console.error('No data rows found in CSV');
          reject(new Error('No valid data found in the uploaded CSV file'));
          return;
        }
        
        // Check for important columns and log relevant information
        const headers = results.meta.fields || [];
        logColumnPresence(headers, data);
        
        // Process the data to ensure all essential fields are available
        const processedData = processCSVData(data);
        resolve(processedData);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      },
      // Increase chunk size for better handling of large files
      chunkSize: 1024 * 1024 * 10, // 10MB chunks
      dynamicTyping: true,
      transformHeader: normalizeHeaders,
      transform: (value) => (typeof value === 'string' ? value.trim() : value)
    });
  });
}

// Helper function to log column presence and sample values
function logColumnPresence(headers: string[], data: ShopifyOrder[]): void {
  // Check for important columns
  console.log('Looking for financial status column');
  const financialStatusHeaders = headers.filter(header => 
    header === 'Financial Status' || 
    header === 'Financial_Status' || 
    header === 'financial_status'
  );
  
  if (financialStatusHeaders.length > 0) {
    console.log(`Financial Status columns found: ${financialStatusHeaders.join(', ')}`);
  } else {
    console.warn('Financial Status column not found in CSV');
  }

  // Check for lineitem name column for delivery orders
  const lineItemNameHeaders = headers.filter(header =>
    header === 'Lineitem name' ||
    header === 'lineitem_name' ||
    header === 'Line Item Name'
  );
  
  if (lineItemNameHeaders.length > 0) {
    console.log(`Lineitem name columns found: ${lineItemNameHeaders.join(', ')}`);
    
    // Log a sample of lineitem names to help debug delivery orders
    const lineitemSamples = data.slice(0, 10).map(order => order['Lineitem name']).filter(Boolean);
    console.log('Sample lineitem names:', lineitemSamples);
    
    // Look for delivery/pickup orders specifically
    const deliveryOrders = data.filter(order => {
      const lineItemName = (order['Lineitem name'] || '').toLowerCase();
      return lineItemName.includes('local delivery') || lineItemName.includes('pickup');
    });
    
    if (deliveryOrders.length > 0) {
      console.log(`Found ${deliveryOrders.length} potential delivery/pickup orders`);
      console.log('Sample delivery orders:', deliveryOrders.slice(0, 3));
    }
  } else {
    console.warn('Lineitem name column not found in CSV - may affect delivery order detection');
  }
  
  // Check for fulfillment status column
  const fulfillmentStatusHeaders = headers.filter(header => 
    header === 'Lineitem fulfillment status' || 
    header === 'Lineitem_fulfillment_status' ||
    header === 'Fulfillment Status'
  );
  
  if (fulfillmentStatusHeaders.length > 0) {
    console.log(`Lineitem fulfillment status columns found: ${fulfillmentStatusHeaders.join(', ')}`);
  } else {
    console.warn('Lineitem fulfillment status column not found in CSV');
  }
}
