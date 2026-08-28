import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  image: { type: String }, // Base64 string
  ownerId: { type: String, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
