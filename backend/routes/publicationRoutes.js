import express from "express";
import { getAllPublications, getPublication, getPublicationOptions } from "../controllers/publicationController.js";

const router = express.Router();

router.get("/", getAllPublications);
router.get("/filters", getPublicationOptions);
router.get("/:id", getPublication);

export default router;

