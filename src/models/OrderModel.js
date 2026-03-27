import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    orderType: { type: String, enum: ["BUY", "SELL"], required: true },
    orderMode: { type: String, enum: ["MARKET", "LIMIT"], required: true },
    status: {
      type: String,
      enum: ["PENDING", "EXECUTED", "CANCELLED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    executedAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

export default model("Order", orderSchema);
