
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should round to two decimal places', () => {
      expect(formatCurrency(1234.567)).toBe('$1,234.57');
      expect(formatCurrency(1234.561)).toBe('$1,234.56');
    });
  });
});
