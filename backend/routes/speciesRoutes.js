import express from "express";

import {
    getAllSpecies,
    createSpeciesController,
    getSpecies,
    updateSpeciesController,
    deleteSpeciesController,
} from "../controllers/speciesController.js";

const router = express.Router();

router.get("/", getAllSpecies);
router.get("/:id", getSpecies);
router.post("/", createSpeciesController);
router.put("/:id", updateSpeciesController);
router.delete("/:id", deleteSpeciesController);

export default router;
