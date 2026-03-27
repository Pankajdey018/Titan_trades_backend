import { Schema, model } from "mongoose";

const tradeSchema = new Schema({
    userId: String,
    symbol: String,
    qty: Number,
    price: Number,
    side: String, // BUY / SELL
}, { timestamps: true });

const Trade = new model("Trade", tradeSchema);

export default Trade;