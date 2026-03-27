import express from "express";
import { getStockBySymbol, getStocks, searchStocks } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getStocks);
router.get("/search", searchStocks);
router.get("/:symbol", getStockBySymbol);

export default router;
