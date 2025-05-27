
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CommissionUpload from './CommissionUpload';
import { parseCommissionExcel } from '@/lib/excelParser';

// Mock the excelParser module
vi.mock('@/lib/excelParser', () => ({
  parseCommissionExcel: vi.fn(),
  generateExampleCommissionFile: vi.fn()
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('CommissionUpload', () => {
  it('renders correctly', () => {
    const onCommissionsUploaded = vi.fn();
    render(<CommissionUpload onCommissionsUploaded={onCommissionsUploaded} />);
    
    expect(screen.getByText(/Custom Commission Rates/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload commission rates/i)).toBeInTheDocument();
  });

  it('handles download template button click', () => {
    const onCommissionsUploaded = vi.fn();
    render(<CommissionUpload onCommissionsUploaded={onCommissionsUploaded} />);
    
    const downloadButton = screen.getByText(/Template/i);
    fireEvent.click(downloadButton);
    
    expect(require('@/lib/excelParser').generateExampleCommissionFile).toHaveBeenCalled();
  });
});
