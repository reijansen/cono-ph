import express from "express";

import {
    getAllSpecies,
    getSpeciesOptions,
    createSpeciesController,
    getSpecies,
    updateSpeciesController,
    deleteSpeciesController,
} from "../controllers/speciesController.js";
import { requireAdminApiKey } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/", getAllSpecies);
router.get("/filters", getSpeciesOptions);
router.get("/:id", getSpecies);
router.post("/", requireAdminApiKey, createSpeciesController);
router.put("/:id", requireAdminApiKey, updateSpeciesController);
router.delete("/:id", requireAdminApiKey, deleteSpeciesController);

export default router;
