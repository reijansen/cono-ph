// external packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// from directory
import speciesRoutes from "./routes/speciesRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

// config
dotenv.config();
const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors()); // avoid cross origins (CORS) error,,, typically arising from kulang authentication
app.use(express.json());
app.use(helmet()); // security middleware that helps protect app by using multiple HTTP headers
app.use(morgan("dev")); // log requests

// Apply Arcjet RATE LIMITING thingy; aka bot detection
// NOTE FROM TIM: Temporarily commenting this out as it always blocks all API calls except for GET all species
// WILL UNCOMMENT as soon as I can figure this out... hopefully, I do

// app.use(async (req, res, next) => {
//     try {
//         const decision = await aj.protect(req, {
//             request: 0, // specify that each request consumes 1 token
//         });

//         if (decision.isDenied()) {
//             if (decision.reason.isRateLimit()) {
//                 res.status(429).json({
//                     error: "Too many requests, please try again",
//                 });
//             } else if (decision.reason.isBot()) {
//                 res.status(403).json({
//                     error: "Bot access denied",
//                 });
//             } else {
//                 res.status(403).json({ error: "Forbidden" });
//             }
//             return;
//         }

//         // check for spoofed bots
//         // isSpoofedBot = decision.results.some(
//         //     (result) => result.reason.isBot() && result.reason.isSpoofed()
//         // );

//         if (
//             decision.results.some(
//                 (result) => result.reason.isBot() && result.reason.isSpoofed()
//             )
//         ) {
//             res.status(403).json({ error: "spoofed bot detected" });
//             return;
//         }

//         // call the next function if not denied
//         next();
//     } catch (error) {
//         console.log("Arcjet Error", error);
//         next(error);
//     }
// });

// API handling
app.use("/api/species", speciesRoutes);

async function initializeDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS species(
                species_id SERIAL PRIMARY KEY,
                scientific_name VARCHAR(255) NOT NULL,
                common_name VARCHAR(255) NOT NULL,
                num_related_publications SMALLINT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized successfully!");
    } catch (error) {
        console.log("ERROR initializing DB from function initializeDB", error);
    }
}

initializeDB().then(() => {
    // listen to port
    app.listen(PORT, () => {
        console.log("Server is listening at: " + String(PORT));
    });
});
