import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import speciesRoutes from "./routes/speciesRoutes.js";
import conopeptideRoutes from "./routes/conopeptideRoutes.js";
import biomarkerRoutes from "./routes/biomarkerRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import taxonomyRoutes from "./routes/taxonomyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { buildCorsOptions } from "./config/cors.js";
import { initializeDatabase } from "./config/initDatabase.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3333;
const app = express();

app.set("trust proxy", 1);
app.use(cors(buildCorsOptions()));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
    });
});

app.use("/api/species", speciesRoutes);
app.use("/api/conopeptides", conopeptideRoutes);
app.use("/api/biomarkers", biomarkerRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/taxonomy", taxonomyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is listening at: ${String(PORT)}`);
        });
    } catch (error) {
        console.error("Failed to initialize database", error);
        process.exit(1);
    }
}

start();
