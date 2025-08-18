import { Router } from 'express';
import { authenticateJWT, authenticateJWTOfAdmin } from '../middleware/authenticate.middleware.js';
import { getUsers, getUser, deleteUser } from "../controllers/user.controller.js";


const userRoutes = Router();

// ✅ Protected - for admins only!
userRoutes.get("/all", authenticateJWTOfAdmin, getUsers);
userRoutes.delete("/:id", authenticateJWTOfAdmin, deleteUser);

// ✅ Protected
userRoutes.get("/:id", authenticateJWT, getUser);

export default userRoutes;
