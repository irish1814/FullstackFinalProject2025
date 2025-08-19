import { Router } from 'express';
import {authenticateJWT, authenticateJWTOfAdmin} from '../middleware/authenticate.middleware.js';
import {
    getAccountByAccountNumber,
    getAccounts,
    toggleAccount,
    updateAccount,
    deleteAccount
} from '../controllers/account.controller.js';
import {errorMiddleware} from "../middleware/errorHandling.middleware.js";

const accountRoutes = Router();
accountRoutes.use(errorMiddleware);


// ❌ Public
accountRoutes.get('/bank-info', (req, res) => {
    res.status(200).send({ branch: 'Downtown', hours: '9am-5pm' });
});

// ✅ Protected - for admins only!
accountRoutes.get('/all', authenticateJWTOfAdmin, getAccounts);
accountRoutes.put('/toggleAccount/:id', authenticateJWTOfAdmin, toggleAccount);
accountRoutes.put('/:id', authenticateJWTOfAdmin, updateAccount);
accountRoutes.delete('/:id', authenticateJWTOfAdmin, deleteAccount);

// ✅ Protected
accountRoutes.get('/:id', authenticateJWT, getAccountByAccountNumber);


export default accountRoutes;
