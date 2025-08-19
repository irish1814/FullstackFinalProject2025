import { Router } from 'express';
import {
    createTransaction, deleteTransactions, getAllTransactions, getTransactionById, getTransactionsByAccountNumber
}
    from '../controllers/transaction.controller.js';
import { authenticateJWT, authenticateJWTOfAdmin } from '../middleware/authenticate.middleware.js';


const transactionRoutes = Router();

// ✅ Protected - for admins only!
transactionRoutes.get('/all', authenticateJWTOfAdmin, getAllTransactions);
transactionRoutes.delete('/all', authenticateJWTOfAdmin, deleteTransactions);

// ✅ Protected Routes
transactionRoutes.post('/create', authenticateJWT, createTransaction);
transactionRoutes.get('/:id', authenticateJWT, getTransactionById);
transactionRoutes.get('/account/:id', authenticateJWT, getTransactionsByAccountNumber);

export default transactionRoutes;
