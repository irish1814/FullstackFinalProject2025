import express from 'express';
import cors from 'cors'; 
import { invalidJsonFormat, errorMiddleware }  from './middleware/errorHandling.middleware.js'
import connectToDatabase from './database/mongodb.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from "./routes/user.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import loansRoutes from "./routes/loan.routes.js";
import savingsRoutes from "./routes/saving.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import exchangeRoutes from "./routes/currencyExchange.routes.js";
import checkRoutes from "./routes/check.routes.js";

import { PORT } from "./config/env.js";
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(invalidJsonFormat);

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); 
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false, 
}));
app.options('*', cors()); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use("/api", checkRoutes);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server started on port ${PORT}`);
});
