import { Router } from 'express';
import { authenticateJWT } from "../middleware/authenticate.middleware.js";
import { getLoansByAccountNumber } from '../controllers/loan.controller.js';

const loanRoutes = Router();

loanRoutes.get('/:id', authenticateJWT, getLoansByAccountNumber);

export default loanRoutes;
