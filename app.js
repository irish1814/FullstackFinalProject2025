import express from 'express';
import cors from 'cors'; 
import { invalidJsonFormat, errorMiddleware }  from './server/middleware/errorHandling.middleware.js'
import connectToDatabase from './server/database/mongodb.js';
import authRoutes from './server/routes/auth.routes.js';
import userRoutes from "./server/routes/user.routes.js";
import accountRoutes from "./server/routes/account.routes.js";
import transactionRoutes from "./server/routes/transaction.routes.js";
import exchangeRoutes from "./server/routes/currencyExchange.routes.js";
import { PORT } from "./server/config/env.js";
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
app.use('/api/exchanges', exchangeRoutes);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server started on port ${PORT}`);
});
