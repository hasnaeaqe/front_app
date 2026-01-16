/**
 * Phone number validation utilities
 * Moroccan phone numbers: 05/06/07 followed by 8 digits
 */

export const PHONE_REGEX = /^0[567]\d{8}$/;

export const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  return PHONE_REGEX.test(phone);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format as: 06 12 34 56 78
  return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};
