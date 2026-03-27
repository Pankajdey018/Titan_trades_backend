import { Schema, model } from "mongoose";

const holdingSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
    name: { type: String, default: "" },
    qty: { type: Number, default: 0 },
    avgPrice: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 },
    pnl: { type: Number, default: 0 },
    dayChange: { type: Number, default: 0 },
  },
  { timestamps: true }
);

holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default model("Holding", holdingSchema);
