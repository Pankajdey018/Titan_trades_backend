import Watchlist from "../models/watchlistModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.find({ userId: req.user._id.toString() }).sort({ symbol: 1 });
  res.status(200).json({ success: true, count: watchlist.length, watchlist });
});

const addToWatchlist = asyncHandler(async (req, res) => {
  const symbol = req.body.symbol?.toUpperCase();

  if (!symbol) {
    throw new ApiError(400, "symbol is required");
  }

  const entry = await Watchlist.findOneAndUpdate(
    { userId: req.user._id.toString(), symbol },
    { userId: req.user._id.toString(), symbol },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, watchlistItem: entry });
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  const symbol = req.params.symbol?.toUpperCase();
  const removed = await Watchlist.findOneAndDelete({ userId: req.user._id.toString(), symbol });

  if (!removed) {
    throw new ApiError(404, "Watchlist symbol not found");
  }

  res.status(200).json({ success: true, message: "Symbol removed from watchlist" });
});

export { getWatchlist, addToWatchlist, removeFromWatchlist };
