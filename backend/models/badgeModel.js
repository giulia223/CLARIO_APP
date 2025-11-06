import mongoose from "mongoose";

const badgeSchema =  new mongoose.Schema({
    id: String, 
    name: String, 
    image: URL,
    unlockAt: {String, reuired: true}
})
export default mongoose.model('Badge', badgeSchema);