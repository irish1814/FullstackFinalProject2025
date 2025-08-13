import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

export default authRoutes;
