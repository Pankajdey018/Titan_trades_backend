import { Schema, model } from "mongoose";

const positionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
    product: { type: String, enum: ["CNC", "MIS", "NRML"], default: "CNC" },
    qty: { type: Number, default: 0 },
    avgPrice: { type: Number, default: 0 },
    currentPrice: { type: Number, default: 0 },
    pnl: { type: Number, default: 0 },
    isLoss: { type: Boolean, default: false },
  },
  { timestamps: true }
);

positionSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default model("Position", positionSchema);
