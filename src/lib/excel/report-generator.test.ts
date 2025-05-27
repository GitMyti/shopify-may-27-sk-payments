
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToExcel } from './report-generator';
import * as XLSX from 'xlsx';
import { ShopReport } from '../csv/types';

// Mock XLSX module
vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(() => ({})),
    aoa_to_sheet: vi.fn(() => ({ 
      A1: {},  // Mock cell for styling tests
    })),
    book_append_sheet: vi.fn(),
    sheet_to_json: vi.fn()
  },
  writeFile: vi.fn()
}));

// Mock the sheet creators
vi.mock('./sheets/order-details-sheet', () => ({
  createSingleSheetReport: vi.fn(() => ({}))
}));

describe('report-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToExcel', () => {
    it('should generate Excel report with correct sheets and filename', async () => {
      // Mock shop report with dates
      const mockReport: ShopReport = {
        shopName: 'Test Shop',
        orders: [
          {
            orderNumber: 'ORD-001',
            orderDate: '2023-05-01',
            paidAt: '2023-05-02',
            productTitle: 'Test Product',
            itemPrice: 50,
            quantity: 2,
            grossSales: 100,
            returns: 0,
            netSales: 100,
            commissionPercentage: 10,
            commissionAmount: 10,
            totalPayment: 90,
            isDeliveryCharge: false
          },
          {
            orderNumber: 'ORD-002',
            orderDate: '2023-05-05',
            paidAt: '2023-05-06',
            productTitle: 'Another Product',
            itemPrice: 50,
            quantity: 1,
            grossSales: 50,
            returns: 0,
            netSales: 50,
            commissionPercentage: 10,
            commissionAmount: 5,
            totalPayment: 45,
            isDeliveryCharge: false
          }
        ],
        summary: {
          totalOrders: 2,
          totalQuantity: 3,
          totalGrossSales: 150,
          totalReturns: 0,
          totalNetSales: 150,
          totalCommission: 15,
          totalPayment: 135
        }
      };

      // Execute the function
      await exportToExcel(mockReport);
      
      // Assertions
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(1); // Single sheet
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        'Myti_Test_Shop_2023-05-02_to_2023-05-06.xlsx'
      );
    });

    it('should use single date when all orders are from the same day', async () => {
      // Mock shop report with single date
      const mockReport: ShopReport = {
        shopName: 'Test Shop',
        orders: [
          {
            orderNumber: 'ORD-001',
            orderDate: '2023-05-01',
            paidAt: '2023-05-01',
            productTitle: 'Test Product',
            itemPrice: 50,
            quantity: 2,
            grossSales: 100,
            returns: 0,
            netSales: 100,
            commissionPercentage: 10,
            commissionAmount: 10,
            totalPayment: 90,
            isDeliveryCharge: false
          }
        ],
        summary: {
          totalOrders: 1,
          totalQuantity: 2,
          totalGrossSales: 100,
          totalReturns: 0,
          totalNetSales: 100,
          totalCommission: 10,
          totalPayment: 90
        }
      };

      // Execute the function
      await exportToExcel(mockReport);
      
      // Assertions
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        'Myti_Test_Shop_2023-05-01.xlsx'
      );
    });

    it('should handle empty orders array', async () => {
      // Mock shop report with no orders
      const mockReport: ShopReport = {
        shopName: 'Empty Shop',
        orders: [],
        summary: {
          totalOrders: 0,
          totalQuantity: 0,
          totalGrossSales: 0,
          totalReturns: 0,
          totalNetSales: 0,
          totalCommission: 0,
          totalPayment: 0
        }
      };

      // Mock current date for testing
      const mockDate = new Date('2023-06-15');
      const originalDate = Date;
      
      // Extend Date with super() call in constructor
      global.Date = class extends originalDate {
        constructor(date?: string | number | Date) {
          if (date) {
            super(date);
          } else {
            super(mockDate);
          }
        }
      } as any;
      
      // Execute the function
      await exportToExcel(mockReport);
      
      // Restore original Date
      global.Date = originalDate;
      
      // Assertions
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.anything(),
        'Myti_Empty_Shop_2023-06-15.xlsx'
      );
    });

    it('should handle errors during export', async () => {
      // Setup mock to throw an error
      (XLSX.utils.book_new as any).mockImplementation(() => {
        throw new Error('Test error');
      });

      // Mock shop report
      const mockReport: ShopReport = {
        shopName: 'Test Shop',
        orders: [],
        summary: {
          totalOrders: 0,
          totalQuantity: 0,
          totalGrossSales: 0,
          totalReturns: 0,
          totalNetSales: 0,
          totalCommission: 0,
          totalPayment: 0
        }
      };

      // Execute and expect an error
      await expect(exportToExcel(mockReport)).rejects.toThrow('Failed to generate Excel report');
    });
  });
});
