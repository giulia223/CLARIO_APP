import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mood: { type: String, required: true },
  likedVideos: [
    {
      url: String,
      title: String,
      score: { type: Number, default: 0 }, 
      timesSelected: { type: Number, default: 1 },
      lastSelectedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("UserPreference", userPreferenceSchema);