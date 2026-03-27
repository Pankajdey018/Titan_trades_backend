import { Schema, model } from "mongoose";

const positionSchema = new Schema({
    userId: { type: String, required: true },
    symbol: String,
    product: String, // CNC / MIS (optional but nice touch)
    qty: Number,
    avgPrice: Number,
    currentPrice: Number,
    pnl: Number,
    isLoss: Boolean,

}, { timestamps: true });

export default model("Position", positionSchema);