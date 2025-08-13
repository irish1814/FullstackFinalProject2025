import bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @param {string} salt - a random auto generated string to secure same passwords of different users
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The previously hashed password.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}
