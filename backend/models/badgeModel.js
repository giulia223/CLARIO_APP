

import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  unlockAt: { type: Number, required: true }, 
//   type: { type: String, enum: ["quickCheck", "taskCompletion", "streak"], required: true },
  icon: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;