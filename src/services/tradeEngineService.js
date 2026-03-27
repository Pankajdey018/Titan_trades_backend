import mongoose from "mongoose";
import Order from "../models/OrderModel.js";
import Trade from "../models/tradeModel.js";
import Holding from "../models/holdingModel.js";
import Position from "../models/positionModel.js";
import ApiError from "../utils/apiError.js";

const calculatePnL = (qty, avgPrice, currentPrice) =>
  Number(((currentPrice - avgPrice) * qty).toFixed(2));

const validateOrderInput = ({ symbol, qty, orderType, orderMode, limitPrice }) => {
  if (!symbol || !qty || !orderType || !orderMode) {
    throw new ApiError(400, "symbol, qty, orderType and orderMode are required");
  }

  if (qty <= 0) {
    throw new ApiError(400, "qty must be greater than 0");
  }

  if (orderMode === "LIMIT" && (!limitPrice || limitPrice <= 0)) {
    throw new ApiError(400, "Valid limitPrice is required for LIMIT orders");
  }
};

const executeOrder = async ({ userId, symbol, qty, orderType, orderMode, limitPrice, marketPrice }) => {
  validateOrderInput({ symbol, qty, orderType, orderMode, limitPrice });

  const executionPrice = orderMode === "LIMIT" ? limitPrice : marketPrice;
  if (!executionPrice || executionPrice <= 0) {
    throw new ApiError(400, "Valid marketPrice is required for MARKET orders");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [order] = await Order.create(
      [
        {
          userId,
          symbol: symbol.toUpperCase(),
          qty,
          price: executionPrice,
          orderType,
          orderMode,
          status: "EXECUTED",
          executedAt: new Date(),
        },
      ],
      { session }
    );

    const [trade] = await Trade.create(
      [
        {
          userId,
          orderId: order._id,
          symbol: symbol.toUpperCase(),
          qty,
          price: executionPrice,
          side: orderType,
        },
      ],
      { session }
    );

    let holding = await Holding.findOne({ userId, symbol: symbol.toUpperCase() }).session(session);
    let position = await Position.findOne({ userId, symbol: symbol.toUpperCase() }).session(session);

    if (orderType === "BUY") {
      if (!holding) {
        [holding] = await Holding.create(
          [
            {
              userId,
              symbol: symbol.toUpperCase(),
              name: symbol.toUpperCase(),
              qty,
              avgPrice: executionPrice,
              currentPrice: executionPrice,
              pnl: 0,
              dayChange: 0,
            },
          ],
          { session }
        );
      } else {
        const totalCost = holding.avgPrice * holding.qty + executionPrice * qty;
        holding.qty += qty;
        holding.avgPrice = Number((totalCost / holding.qty).toFixed(4));
        holding.currentPrice = executionPrice;
        holding.pnl = calculatePnL(holding.qty, holding.avgPrice, executionPrice);
        await holding.save({ session });
      }

      if (!position) {
        [position] = await Position.create(
          [
            {
              userId,
              symbol: symbol.toUpperCase(),
              product: "CNC",
              qty,
              avgPrice: executionPrice,
              currentPrice: executionPrice,
              pnl: 0,
              isLoss: false,
            },
          ],
          { session }
        );
      } else {
        const totalCost = position.avgPrice * position.qty + executionPrice * qty;
        position.qty += qty;
        position.avgPrice = Number((totalCost / position.qty).toFixed(4));
        position.currentPrice = executionPrice;
        position.pnl = calculatePnL(position.qty, position.avgPrice, executionPrice);
        position.isLoss = position.pnl < 0;
        await position.save({ session });
      }
    }

    if (orderType === "SELL") {
      if (!holding || holding.qty < qty) {
        throw new ApiError(400, "Insufficient quantity to sell");
      }

      holding.qty -= qty;
      holding.currentPrice = executionPrice;
      holding.pnl = calculatePnL(holding.qty, holding.avgPrice, executionPrice);
      holding.dayChange = Number((executionPrice - holding.avgPrice).toFixed(2));

      if (holding.qty === 0) {
        await Holding.deleteOne({ _id: holding._id }).session(session);
      } else {
        await holding.save({ session });
      }

      if (position) {
        position.qty -= qty;
        position.currentPrice = executionPrice;
        position.pnl = calculatePnL(Math.max(position.qty, 0), position.avgPrice, executionPrice);
        position.isLoss = position.pnl < 0;

        if (position.qty <= 0) {
          await Position.deleteOne({ _id: position._id }).session(session);
        } else {
          await position.save({ session });
        }
      }
    }

    await session.commitTransaction();
    return { order, trade };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getPortfolioSummary = async (userId) => {
  const [holdings, positions, openOrders, recentTrades] = await Promise.all([
    Holding.find({ userId }).sort({ symbol: 1 }),
    Position.find({ userId }).sort({ symbol: 1 }),
    Order.find({ userId, status: "PENDING" }).sort({ createdAt: -1 }),
    Trade.find({ userId }).sort({ createdAt: -1 }).limit(20),
  ]);

  const totals = holdings.reduce(
    (acc, h) => {
      acc.invested += h.avgPrice * h.qty;
      acc.currentValue += h.currentPrice * h.qty;
      acc.totalPnl += h.pnl;
      return acc;
    },
    { invested: 0, currentValue: 0, totalPnl: 0 }
  );

  return {
    totals: {
      ...totals,
      invested: Number(totals.invested.toFixed(2)),
      currentValue: Number(totals.currentValue.toFixed(2)),
      totalPnl: Number(totals.totalPnl.toFixed(2)),
    },
    holdings,
    positions,
    openOrders,
    recentTrades,
  };
};

export { executeOrder, getPortfolioSummary };
