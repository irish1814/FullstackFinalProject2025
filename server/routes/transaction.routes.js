import { Router } from 'express';
import { createTransaction, getAllTransactions, getTransactionById, getTransactionsByAccount }
    from '../controllers/transaction.controller.js';
import { authenticateJWT, authenticateJWTOfAdmin } from '../middleware/authenticate.middleware.js';


const transactionRoutes = Router();

// ✅ Protected Routes
transactionRoutes.post('/create', authenticateJWT, createTransaction);
transactionRoutes.get('/all', authenticateJWTOfAdmin, getAllTransactions);
transactionRoutes.get('/:id', authenticateJWT, getTransactionById);
transactionRoutes.get('/account/:id', authenticateJWT, getTransactionsByAccount);

export default transactionRoutes;
