import { Schema, model } from "mongoose";

const tradeSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    side: { type: String, enum: ["BUY", "SELL"], required: true },
  },
  { timestamps: true }
);

tradeSchema.index({ userId: 1, createdAt: -1 });

export default model("Trade", tradeSchema);
