import Trade from "../models/tradeModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ userId: req.user._id.toString() }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: trades.length, trades });
});

export { getTrades };
