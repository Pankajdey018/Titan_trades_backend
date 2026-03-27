import express from "express";
import { getHoldings, getPortfolio, getPositions } from "../controllers/portfolioController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary", getPortfolio);
router.get("/holdings", getHoldings);
router.get("/positions", getPositions);

export default router;
