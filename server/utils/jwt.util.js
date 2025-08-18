import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretbankkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Generates a signed JSON Web Token (JWT) for authentication.
 * @param {Object} payload - Data to include in the token (e.g., user ID, role).
 * @returns {string} Signed JWT token.
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} Decoded token payload if valid, otherwise null.
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw err; // invalid or expired
    }
}

/**
 * Decodes a JWT token without verifying its signature.
 * @param {string} token - The JWT token to decode.
 * @returns {Object|null} Decoded token payload or null if invalid.
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
}

