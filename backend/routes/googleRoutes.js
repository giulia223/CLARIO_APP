import express from "express";
import {
  getAuthUrl,
  googleCallback,
  addEventToGoogleCalendar,
  startAuthRedirect,
} from "../controllers/googleController.js";

const router = express.Router();

router.get("/auth", getAuthUrl); 
router.get("/start", startAuthRedirect); 
router.get("/callback", googleCallback); 
router.post("/add-event", addEventToGoogleCalendar); 

export default router;
