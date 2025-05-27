
/**
 * Normalizes CSV headers to ensure consistent naming throughout the application
 * @param header The raw header from the CSV file
 * @returns The normalized header name
 */
export function normalizeHeaders(header: string): string {
  const trimmedHeader = header.trim();
  const lowerHeader = trimmedHeader.toLowerCase();
  
  // Normalize "Financial Status" header variations
  if (lowerHeader === 'financial_status' || lowerHeader === 'financial status') {
    return 'Financial Status';
  }
  
  // Normalize "Lineitem fulfillment status" header variations
  if (lowerHeader === 'lineitem_fulfillment_status' || 
      lowerHeader === 'lineitem fulfillment status' ||
      lowerHeader === 'fulfillment status') {
    return 'Lineitem fulfillment status';
  }
  
  // Normalize "Lineitem name" header variations
  if (lowerHeader === 'lineitem_name' || lowerHeader === 'line item name') {
    return 'Lineitem name';
  }
  
  return trimmedHeader;
}
