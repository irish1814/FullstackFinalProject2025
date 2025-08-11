/**
 * Formats a number into currency format.
 * @param {number} amount - The amount of money.
 * @param {string} [currency="USD"] - The currency code (ISO 4217).
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency
    }).format(amount);
}

/**
 * Formats a date into YYYY-MM-DD format.
 * @param {Date|string|number} date - The date object, ISO string, or timestamp.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toISOString().split("T")[0];
}

/**
 * Masks an account number to hide sensitive digits.
 * Example: A3B9C1D4E2F6 -> ********E2F6
 * @param {string|number} accountNumber - The account number to mask.
 * @returns {string} Masked account number.
 */
export const maskAccountNumber = (accountNumber) => {
    const str = String(accountNumber);
    return `********${str.slice(-4)}`;
}