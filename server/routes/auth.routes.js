import { Router } from 'express';
import {register, login, logout, deleteUser, GenerateMFA, loginWithMFA} from '../controllers/auth.controller.js';
import {authenticateJWT, authenticateJWTOfAdmin } from "../middleware/authenticate.middleware.js";

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/loginWithMFA', loginWithMFA);
authRoutes.post('/logout', logout);
authRoutes.put('/GenerateMFA', authenticateJWT, GenerateMFA);

// delete user with admin permission only
authRoutes.delete('/del', authenticateJWTOfAdmin, deleteUser);

export default authRoutes;
