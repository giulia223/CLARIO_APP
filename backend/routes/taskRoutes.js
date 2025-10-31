import express from "express";
import { getTasks, createTask, deleteTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);

router.post("/", createTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;