import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  type: { type: String, enum: ["expense", "revenue"], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Finance = mongoose.model("Finance", financeSchema);
export default Finance;
