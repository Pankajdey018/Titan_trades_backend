import Order from "../models/OrderModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { executeOrder } from "../services/tradeEngineService.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { symbol, qty, orderType, orderMode, limitPrice, marketPrice } = req.body;

  const result = await executeOrder({
    userId: req.user._id.toString(),
    symbol,
    qty: Number(qty),
    orderType,
    orderMode,
    limitPrice: limitPrice ? Number(limitPrice) : undefined,
    marketPrice: marketPrice ? Number(marketPrice) : undefined,
  });

  res.status(201).json({
    success: true,
    message: "Order executed",
    order: result.order,
    trade: result.trade,
  });
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id.toString() }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id.toString() });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({ success: true, order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id.toString() });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "EXECUTED") {
    throw new ApiError(400, "Executed orders cannot be cancelled");
  }

  order.status = "CANCELLED";
  await order.save();

  res.status(200).json({ success: true, message: "Order cancelled", order });
});

export { placeOrder, getOrderHistory, getOrderById, cancelOrder };
