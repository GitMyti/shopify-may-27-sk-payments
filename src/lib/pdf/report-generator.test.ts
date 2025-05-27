
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPDF } from './report-generator';
import { ShopReport } from '../csv/types';
import jsPDF from 'jspdf';

// Mock jsPDF and autoTable
vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setFontSize: vi.fn(),
      text: vi.fn(),
      save: vi.fn(),
      internal: {
        pageSize: {
          height: 297,
        }
      },
      setTextColor: vi.fn(),
      lastAutoTable: {
        finalY: 100
      }
    }))
  };
});

vi.mock('jspdf-autotable', () => {
  return {
    default: vi.fn()
  };
});

describe('PDF report-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToPDF', () => {
    it('should generate PDF report with correct data', async () => {
      // Mock shop report
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
      await exportToPDF(mockReport);
      
      // Assertions
      expect(jsPDF).toHaveBeenCalled();
      const mockJsPdfInstance = (jsPDF as any).mock.results[0].value;
      expect(mockJsPdfInstance.save).toHaveBeenCalledWith('Myti_Test_Shop_Report.pdf');
    });

    it('should handle errors during export', async () => {
      // Setup mock to throw an error
      (jsPDF as any).mockImplementation(() => {
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
      await expect(exportToPDF(mockReport)).rejects.toThrow('Failed to generate PDF report');
    });
  });
});
