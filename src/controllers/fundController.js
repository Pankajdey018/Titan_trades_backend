import Fund from "../models/fundModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const getFunds = asyncHandler(async (req, res) => {
  const fund = await Fund.findOne({ userId: req.user._id.toString() });
  res.status(200).json({
    success: true,
    funds: {
      balance: fund?.balance || 0,
      totalAdded: fund?.totalAdded || 0,
    },
  });
});

const addFunds = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);

  if (!amount || amount <= 0) {
    throw new ApiError(400, "amount must be greater than 0");
  }

  const fund = await Fund.findOneAndUpdate(
    { userId: req.user._id.toString() },
    { $inc: { balance: amount, totalAdded: amount } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, message: "Funds added", funds: fund });
});

export { getFunds, addFunds };
