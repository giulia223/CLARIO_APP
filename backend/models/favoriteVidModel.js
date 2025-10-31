import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, pentru viitor
    title: { type: String, required: true },
    url: { type: String, required: true , unique: true},
    mood: { type: String }, 
    addedAt: { type: Date, default: Date.now }
})

export default mongoose.model('favoriteVideo', favoriteSchema);