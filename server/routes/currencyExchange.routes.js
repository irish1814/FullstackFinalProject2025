import { Router } from 'express';
import { currencyExchange } from '../controllers/currencyExchange.controller.js';

const exchangeRoutes = Router();

exchangeRoutes.post('/currencyExchange', currencyExchange);

export default exchangeRoutes;