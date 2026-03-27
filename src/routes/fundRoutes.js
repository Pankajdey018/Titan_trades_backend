import express from "express";
import { addFunds, getFunds } from "../controllers/fundController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getFunds);
router.post("/add", addFunds);

export default router;
