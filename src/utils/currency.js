/**
 * Format a number as currency in MAD
 * @param {number} amount - The amount to format
 * @param {object} options - Optional formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  if (amount === null || amount === undefined) {
    return '0.00';
  }
  
  return Number(amount).toLocaleString('fr-FR', defaultOptions);
};

/**
 * Format a number as currency with MAD suffix
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with MAD suffix
 */
export const formatCurrencyWithSuffix = (amount) => {
  return `${formatCurrency(amount)} MAD`;
};
