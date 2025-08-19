import { Router } from 'express';
import { authenticateJWT } from "../middleware/authenticate.middleware.js";
import { getSavingsByAccountNumber } from '../controllers/saving.controller.js';

const savingRoutes = Router();

savingRoutes.get('/:id', authenticateJWT, getSavingsByAccountNumber);

export default savingRoutes;