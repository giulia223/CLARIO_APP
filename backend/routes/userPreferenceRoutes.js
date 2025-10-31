import express from "express";
import {
  recordPreference,
  getPersonalizedRecom,
} from "../controllers/userPreferenceController.js";

const router = express.Router();


router.post("/preferences", recordPreference);


router.get("/recommendations", getPersonalizedRecom);

export default router;
