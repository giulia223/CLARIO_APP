import mongoose from "mongoose";


const recommendationSchema = new mongoose.Schema({
  mood: { type: String, required: true, unique: true }, 
  videos: [
    {
      title: String,
      url: String, // link catre YouTube / Vimeo / alta sursa
    },
  ],
});

export default mongoose.model("EmotionRecommendation", recommendationSchema);

