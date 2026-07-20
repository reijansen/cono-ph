import express from "express";
import { getAllTaxonomy, getTaxonomy, getTaxonomyOptions } from "../controllers/taxonomyController.js";

const router = express.Router();

router.get("/", getAllTaxonomy);
router.get("/filters", getTaxonomyOptions);
router.get("/:id", getTaxonomy);

export default router;

