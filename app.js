import express from 'express';
import { invalidJsonFormat, errorMiddleware }  from './middleware/errorHandling.middleware.js'
import connectToDatabase from './database/mongodb.js';
import authRoutes from './routes/auth.routes.js';
import accountRoutes from "./routes/account.routes.js";
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(invalidJsonFormat);

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

app.use(errorMiddleware);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server started on port ${PORT}`);
});