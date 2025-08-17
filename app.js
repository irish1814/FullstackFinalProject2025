import express from 'express';
import { invalidJsonFormat, errorMiddleware }  from './server/middleware/errorHandling.middleware.js'
import connectToDatabase from './server/database/mongodb.js';
import authRoutes from './server/routes/auth.routes.js';
import accountRoutes from "./server/routes/account.routes.js";
import transactionRoutes from "./server/routes/transaction.routes.js";
import { PORT } from "./server/config/env.js";
import 'dotenv/config';


const app = express();

app.use(express.json());
app.use(invalidJsonFormat);

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.use(errorMiddleware);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server started on port ${PORT}`);
});