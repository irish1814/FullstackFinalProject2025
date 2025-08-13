import { Router } from 'express';
import { authenticateJWT } from '../middleware/authenticate.middleware.js';
import {getAccount, getAccounts} from '../controllers/account.controller.js';
import {errorMiddleware} from "../middleware/errorHandling.middleware.js";

const accountRoutes = Router();
accountRoutes.use(errorMiddleware);

// ✅ Protected
accountRoutes.get('/', authenticateJWT, getAccounts);

// ✅ Protected
accountRoutes.get('/:id', authenticateJWT, getAccount);

// ❌ Public
accountRoutes.get('/bank-info', (req, res) => {
    res.json({ branch: 'Downtown', hours: '9am-5pm' });
});

export default accountRoutes;
