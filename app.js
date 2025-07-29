import express from 'express';
import invalidJsonFormat from './middleware/errorHandling.js'
import connectToDatabase from './database/mongodb.js';
import authRoutes from './routes/auth.routes.js';
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(invalidJsonFormat);
app.use('/api/auth', authRoutes);

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server started on port ${PORT}`);
});