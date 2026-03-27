import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    qty: Number,
    price: Number,
    orderType: { type: String, enum: ["BUY", "SELL"] },
    orderMode: { type: String, enum: ["MARKET", "LIMIT"] },
    status: { 
        type: String, 
        enum: ["PENDING", "EXECUTED", "CANCELLED"], 
        default: "PENDING" 
    },

}, { timestamps: true });

export default model("Order", orderSchema);