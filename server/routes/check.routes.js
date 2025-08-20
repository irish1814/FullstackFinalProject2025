import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/checks/" });
const checkRoutes = Router();

checkRoutes.post("/check-deposit", upload.single("checkImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});

export default checkRoutes;
