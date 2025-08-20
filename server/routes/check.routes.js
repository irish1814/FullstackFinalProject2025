import { Router } from "express";
import { authenticateJWT } from "../middleware/authenticate.middleware.js";
import { cashDeposit, cashWithdraw, checkDeposit } from "../controllers/check.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/deposit", authenticateJWT, cashDeposit);
router.post("/withdraw", authenticateJWT, cashWithdraw);
router.post("/deposit-check", authenticateJWT, upload.single("checkImage"), checkDeposit);

export default router;
