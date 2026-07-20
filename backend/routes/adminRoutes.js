import express from "express";

import {
    adminLogin,
    adminLogout,
    createAdminResourceRow,
    deleteAdminResourceRow,
    getAdminResourceRow,
    getAdminResources,
    getAdminSession,
    listAdminResourceRows,
    updateAdminResourceRow,
} from "../controllers/adminController.js";
import { requireAdminSession } from "../middlewares/adminSessionAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/session", getAdminSession);

router.use(requireAdminSession);
router.get("/resources", getAdminResources);
router.get("/:resource", listAdminResourceRows);
router.post("/:resource", createAdminResourceRow);
router.get("/:resource/:id", getAdminResourceRow);
router.put("/:resource/:id", updateAdminResourceRow);
router.delete("/:resource/:id", deleteAdminResourceRow);

export default router;
