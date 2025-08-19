import { Router } from 'express';
import { authenticateJWT, authenticateJWTOfAdmin } from "../middleware/authenticate.middleware.js";
import {createMessage, getMessageById, getMessages, updateMessage} from "../controllers/contactAdmin.controller.js";

const contactRouter = new Router();

// ✅ Protected - for admins only!
contactRouter.get("/all", authenticateJWTOfAdmin, getMessages);
contactRouter.get("/:id", authenticateJWTOfAdmin, getMessageById);
contactRouter.put("/:id", authenticateJWTOfAdmin, updateMessage);

// ✅ Protected
contactRouter.post("/create", authenticateJWT, createMessage);

export default contactRouter;