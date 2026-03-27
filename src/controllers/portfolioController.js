import Holding from "../models/holdingModel.js";
import Position from "../models/positionModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPortfolioSummary } from "../services/tradeEngineService.js";

const getPortfolio = asyncHandler(async (req, res) => {
  const data = await getPortfolioSummary(req.user._id.toString());
  res.status(200).json({ success: true, ...data });
});

const getHoldings = asyncHandler(async (req, res) => {
  const holdings = await Holding.find({ userId: req.user._id.toString() }).sort({ symbol: 1 });
  res.status(200).json({ success: true, count: holdings.length, holdings });
});

const getPositions = asyncHandler(async (req, res) => {
  const positions = await Position.find({ userId: req.user._id.toString() }).sort({ symbol: 1 });
  res.status(200).json({ success: true, count: positions.length, positions });
});

export { getPortfolio, getHoldings, getPositions };
