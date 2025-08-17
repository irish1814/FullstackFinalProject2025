import { Router } from 'express';
import { currencyExchange } from '../controllers/currencyExchange.controller.js';
import { authenticateJWT} from "../middleware/authenticate.middleware.js";

const exchangeRoutes = Router();

exchangeRoutes.post('/currencyExchange', authenticateJWT, currencyExchange);

export default exchangeRoutes;