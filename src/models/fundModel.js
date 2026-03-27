import { Schema, model } from "mongoose";

const fundSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalAdded: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default model("Fund", fundSchema);
