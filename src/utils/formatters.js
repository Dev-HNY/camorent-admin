/**
 * Format currency in INR with thousands notation (K)
 * @param {number} amount - Amount in rupees (or paise if fromPaise is true)
 * @param {boolean} fromPaise - Whether the input amount is in paise (needs to be divided by 100)
 * @returns {string} Formatted currency string
 *
 * Examples:
 * formatINR(60000) => "₹60K"
 * formatINR(1500) => "₹1.5K"
 * formatINR(500) => "₹500"
 * formatINR(150000) => "₹150K"
 * formatINR(6000000, true) => "₹60K"
 */
export const formatINR = (amount, fromPaise = false) => {
  const value = fromPaise ? amount / 100 : amount;

  if (value >= 1000) {
    const thousands = value / 1000;
    // Remove unnecessary decimals (e.g., 60.0K => 60K, but keep 1.5K)
    const formatted = thousands % 1 === 0 ? thousands : thousands.toFixed(1);
    return `₹${formatted}K`;
  }

  return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Format just the number in thousands notation without currency symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted number string
 *
 * Examples:
 * formatThousands(60000) => "60K"
 * formatThousands(1500) => "1.5K"
 * formatThousands(500) => "500"
 */
export const formatThousands = (amount) => {
  if (amount >= 1000) {
    const thousands = amount / 1000;
    const formatted = thousands % 1 === 0 ? thousands : thousands.toFixed(1);
    return `${formatted}K`;
  }

  return amount.toLocaleString('en-IN');
};
