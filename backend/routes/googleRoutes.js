import express from "express";
import {
  getAuthUrl,
  googleCallback,
  addEventToGoogleCalendar,
} from "../controllers/googleController.js";

const router = express.Router();

router.get("/auth", getAuthUrl); // 1️⃣ Cere link de login
router.get("/callback", googleCallback); // 2️⃣ Prinde redirectul Google
router.post("/add-event", addEventToGoogleCalendar); // 3️⃣ Adaugă eveniment

export default router;
