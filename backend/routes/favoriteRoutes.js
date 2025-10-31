import express from "express";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../controllers/favoriteVidController.js";

const router = express.Router();

router.get("/", getFavorites);

router.post("/", addFavorite);

router.delete("/:id", deleteFavorite);

export default router;
