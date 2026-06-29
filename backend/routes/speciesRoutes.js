import express from "express";

import {
    getAllSpecies,
    createSpecies,
    getSpecies,
    updateSpecies,
    deleteSpecies,
} from "../controllers/speciesControllers.js";

const router = express.Router();

router.get("/", getAllSpecies);
router.get("/:id", getSpecies);
router.post("/", createSpecies);
router.put("/:id", updateSpecies);
router.delete("/:id", deleteSpecies);

export default router;
