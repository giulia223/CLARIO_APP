import express from "express";
import { createJournalEntry, getJournalEntry, updateJournalEntry, deleteJournalEntry }  from "../controllers/journalEntryController.js";

const router = express.Router();

router.get("/", getJournalEntry);

router.post("/", createJournalEntry);

router.patch("/:id", updateJournalEntry);

router.delete("/:id", deleteJournalEntry);

export default router;
