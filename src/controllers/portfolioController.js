import asyncHandler from "../utils/asyncHandler.js";
import { getPortfolioSummary } from "../services/tradeEngineService.js";

const getPortfolio = asyncHandler(async (req, res) => {
  const data = await getPortfolioSummary(req.user._id.toString());
  res.status(200).json({ success: true, ...data });
});

export { getPortfolio };
