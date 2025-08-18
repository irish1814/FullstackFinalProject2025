import { Router } from 'express';
import { register, login, logout, deleteUser } from '../controllers/auth.controller.js';
import {authenticateJWTOfAdmin} from "../middleware/authenticate.middleware.js";

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

// delete user with admin permission only
authRoutes.delete('/del', authenticateJWTOfAdmin, deleteUser);

export default authRoutes;
