import express from "express";
import { getAllEmotions, getEmotionByMood, updateEmotion } from "../controllers/emotionRecomController.js";

const router = express.Router();

router.get("/", getAllEmotions);

router.get("/:mood", getEmotionByMood);

router.patch("/:id", updateEmotion);

export default router;