import { Router } from "express";
import { getAccountByUserId } from "../controllers/account.controllers.js";

const accountRoutes = Router();

accountRoutes.get('/:userId', getAccountByUserId);

export default accountRoutes;
