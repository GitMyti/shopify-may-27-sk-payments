
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCommissionExcel } from './commission-parser';
import * as XLSX from 'xlsx';

// Mock XLSX module
vi.mock('xlsx', () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn()
  }
}));

// Create a proper FileReader mock
class MockFileReader {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;
  
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  
  readAsArrayBuffer(file: Blob): void {
    setTimeout(() => {
      if (this.onload) {
        const event = { 
          target: { result: new ArrayBuffer(8) } 
        } as unknown as ProgressEvent<FileReader>;
        this.onload.call(this as unknown as FileReader, event);
      }
    }, 0);
  }
}

// Apply the mock
global.FileReader = MockFileReader as unknown as typeof FileReader;

describe('commission-parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseCommissionExcel', () => {
    it('should parse commission data correctly', async () => {
      // Setup mock data
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': {}
        }
      };
      const mockJsonData = [
        { 'Shop Name': 'Shop A', 'Commission %': 10 },
        { 'Shop Name': 'Shop B', 'Commission %': 15 }
      ];
      
      // Configure mocks
      (XLSX.read as any).mockReturnValue(mockWorkbook);
      (XLSX.utils.sheet_to_json as any).mockReturnValue(mockJsonData);
      
      // Create a mock file
      const mockFile = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Execute the function
      const result = await parseCommissionExcel(mockFile);
      
      // Assertions
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ shopName: 'Shop A', commissionPercentage: 10 });
      expect(result[1]).toEqual({ shopName: 'Shop B', commissionPercentage: 15 });
      expect(XLSX.read).toHaveBeenCalled();
      expect(XLSX.utils.sheet_to_json).toHaveBeenCalled();
    });

    it('should handle percentage strings correctly', async () => {
      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': {}
        }
      };
      const mockJsonData = [
        { 'Shop Name': 'Shop A', 'Commission %': '10%' },
        { 'Shop Name': 'Shop B', 'Commission %': '15%' }
      ];
      
      (XLSX.read as any).mockReturnValue(mockWorkbook);
      (XLSX.utils.sheet_to_json as any).mockReturnValue(mockJsonData);
      
      const mockFile = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const result = await parseCommissionExcel(mockFile);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ shopName: 'Shop A', commissionPercentage: 10 });
      expect(result[1]).toEqual({ shopName: 'Shop B', commissionPercentage: 15 });
    });
  });
});
