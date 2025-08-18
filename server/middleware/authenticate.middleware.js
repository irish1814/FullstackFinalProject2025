import { verifyToken } from '../utils/jwt.util.js';
import UserModel from "../models/User.model.js";

const authenticateJWTBase = (requiredRole = null) => {
    return async (req, res, next) => {
        try {
            const { authorization: authHeader } = req.headers;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const error = new Error('Access token missing or invalid');
                error.status = 401;
                throw error;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            // 🔹 make sure to await since `findById` returns a Promise
            const user = await UserModel.findById(decoded.userId);

            if (!user) {
                const error = new Error('Unauthorized');
                error.status = 401;
                throw error;
            }

            // 🔹 If a role is required, check it
            if (requiredRole && user.role !== requiredRole) {
                const error = new Error('Forbidden: insufficient permission');
                error.status = 403;
                throw error;
            }

            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    };
};

// ✅ Export ready-to-use middlewares
export const authenticateJWT = authenticateJWTBase();
export const authenticateJWTOfAdmin = authenticateJWTBase('admin');
