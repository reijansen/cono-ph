import express from "express";
import { getAllConopeptides, getConopeptide, getConopeptideOptions } from "../controllers/conopeptideController.js";

const router = express.Router();

router.get("/", getAllConopeptides);
router.get("/filters", getConopeptideOptions);
router.get("/:id", getConopeptide);

export default router;

