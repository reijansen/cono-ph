import express from "express";
import { getAllBiomarkers, getBiomarker, getBiomarkerOptions } from "../controllers/biomarkerController.js";

const router = express.Router();

router.get("/", getAllBiomarkers);
router.get("/filters", getBiomarkerOptions);
router.get("/:id", getBiomarker);

export default router;

