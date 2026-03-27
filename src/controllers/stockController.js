import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import STOCKS from "../data/stocksData.js";

const getStocks = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, count: STOCKS.length, stocks: STOCKS });
});

const getStockBySymbol = asyncHandler(async (req, res) => {
  const symbol = req.params.symbol?.toUpperCase();
  const stock = STOCKS.find((item) => item.symbol === symbol);

  if (!stock) {
    throw new ApiError(404, "Stock not found");
  }

  res.status(200).json({ success: true, stock });
});

const searchStocks = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").toString().trim().toUpperCase();

  if (!query) {
    return res.status(200).json({ success: true, count: STOCKS.length, stocks: STOCKS });
  }

  const results = STOCKS.filter(
    (item) => item.symbol.includes(query) || item.name.toUpperCase().includes(query)
  );

  res.status(200).json({ success: true, count: results.length, stocks: results });
});

export { getStocks, getStockBySymbol, searchStocks };
