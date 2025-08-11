import { verifyToken } from '../utils/jwt.util.js';
import UserModel from "../models/User.model.js";

export const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Access token missing or invalid');
            error.status = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const user = UserModel.findById(decoded.userId);

        if (!user) {
            const error = new Error('Unauthorized');
            error.status = 401;
            throw error;
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};
