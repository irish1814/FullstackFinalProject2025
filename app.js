import express from 'express';
import authRoutes from './routes/auth.routes.js';
import invalidJsonFormat from './middleware/errorHandling.js'
import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(invalidJsonFormat);
app.use(authRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});