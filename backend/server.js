import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import emotionRecomRoutes from './routes/emotionRecomRoutes.js';
import favoriteVidRoutes from "./routes/favoriteRoutes.js";
import userPreferenceRoutes from "./routes/userPreferenceRoutes.js"; 
import googleRoutes from "./routes/googleRoutes.js";


dotenv.config();
console.log("🔍 Google ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔍 Google Secret:", process.env.GOOGLE_CLIENT_SECRET);

const app = express();

app.use(cors());
app.use(express.json()); 

connectDB();


app.use('/tasks', taskRoutes);
app.use("/journalEntry", journalRoutes );
app.use("/emotions", emotionRecomRoutes);
app.use("/favorites", favoriteVidRoutes);
app.use("/api/user", userPreferenceRoutes);
app.use('/api/google', googleRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});




                        