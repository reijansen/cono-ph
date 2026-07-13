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
                id VARCHAR(20) PRIMARY KEY,
                scientific_name VARCHAR(255) NOT NULL,
                common_name VARCHAR(255) NOT NULL,
                subgenus VARCHAR(255) NOT NULL,
                diet_type VARCHAR(255) NOT NULL,
                region VARCHAR(255),   
                province VARCHAR(255),
                municipality VARCHAR(255),
                shell_image TEXT,
                tissue_source TEXT,
                num_coi SMALLINT,
                num_conopeptides SMALLINT,
                doi VARCHAR(255),
                species_depository TEXT, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS conopeptide(
                id VARCHAR(20) PRIMARY KEY,
                species_id VARCHAR(20) NOT NULL,
                scientific_name VARCHAR(255) NOT NULL,
                precursor_sequence TEXT NOT NULL,
                remark_sequence TEXT,
                signal_peptide TEXT NOT NULL,
                propeptide_sequence TEXT, 
                mature_peptide_sequence TEXT NOT NULL,
                post_peptide_sequence TEXT, 
                gene_superfamily VARCHAR(255), 
                matched_toxin VARCHAR(50),
                percent_similarity REAL,
                source_percent_similarity VARCHAR(5), 
                expression_value REAL,
                doi TEXT,
                len_precursor_sequence SMALLINT,
                len_mature_conopeptide SMALLINT,
                num_cysteine_residues SMALLINT,
                cysteine_pattern VARCHAR(10),
                cysteine_framework VARCHAR(10)
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS barcode(
                specimen_id VARCHAR(20) PRIMARY KEY,
                species_name VARCHAR(255) NOT NULL,
                gene_marker VARCHAR(255) NOT NULL,
                length_sequence SMALLINT NOT NULL,
                sequence TEXT ,
                source_method VARCHAR(255),
                collection_province VARCHAR(255),
                collection_site VARCHAR(255),
                platform_sequence VARCHAR(255),
                db_sequence VARCHAR(255),
                accession_external VARCHAR(50),
                validation_status VARCHAR(255),
                publication_doi TEXT
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS publication (
                id VARCHAR(20) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                year_published VARCHAR(4) NOT NULL,
                journal VARCHAR(255),
                doi TEXT NOT NULL,
                species_reported VARCHAR(255)
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS taxonomy (
                id VARCHAR(20) PRIMARY KEY,
                domain VARCHAR(255), 
                kingdom VARCHAR(255),
                phylum VARCHAR(255),
                class VARCHAR(255),
                taxonomy_order VARCHAR(255),
                family VARCHAR(255),
                genus VARCHAR(255),
                subgenus VARCHAR(255),
                species VARCHAR(255) NOT NULL
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
