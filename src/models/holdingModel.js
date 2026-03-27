import { Schema, model } from "mongoose";

const holdingSchema = new Schema({
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: String,
    qty: Number,
    avgPrice: Number,
    currentPrice: Number,
    pnl: Number,        // overall profit/loss
    dayChange: Number,  // today’s P&L

}, { timestamps: true });

export default model("Holding", holdingSchema);