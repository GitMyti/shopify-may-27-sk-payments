
/**
 * Utilities for normalizing and formatting shop names consistently
 */

/**
 * Normalizes shop names consistently for comparison across the application
 */
export const normalizeShopNameForComparison = (name: string | null | undefined): string => {
  if (!name) return '';
  // Remove all whitespace, convert to lowercase for maximum normalization
  return name.toLowerCase().replace(/\s+/g, '');
};

/**
 * Normalizes shop name for display
 */
export const normalizeShopNameForDisplay = (shopName: string): string => {
  // Handle empty input
  if (!shopName || shopName.trim() === '') {
    return 'Unknown Shop';
  }
  
  // Convert to title case for consistent display
  const normalized = shopName.trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Handle special case normalizations
  const normalizedLower = normalized.toLowerCase();
  
  // Add specific shop name normalizations here - making sure to catch all variants
  if (normalizedLower.includes('nuchocolat') || normalizedLower.includes('nu chocolat')) {
    return 'Nu Chocolat';
  }
  if (normalizedLower.includes('homeport')) {
    return 'HomePort';
  }
  if (normalizedLower.includes('houndstooth')) {
    return 'Houndstooth';
  }
  if (normalizedLower.includes('mustloveyarn') || normalizedLower.includes('must love yarn')) {
    return 'Must Love Yarn';
  }
  if (normalizedLower.includes('myti')) {
    return 'Myti';
  }
  
  return normalized;
};
