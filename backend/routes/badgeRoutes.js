import express from "express";
import { getBadges, checkForBadge } from "../controllers/badgeController.js";

const router = express.Router();

router.get("/:userId", getBadges);
router.post("/check/:userId/:badgeId", checkForBadge);

export default router;

