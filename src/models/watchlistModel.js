import { Schema, model } from "mongoose";

const watchlistSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
  },
  { timestamps: true }
);

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default model("Watchlist", watchlistSchema);
