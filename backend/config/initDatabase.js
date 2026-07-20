import { sql } from "./db.js";
import {
    loadBiomarkerSeedRows,
    loadConopeptideSeedRows,
    loadPublicationSeedRows,
    loadSpeciesSeedRows,
    loadTaxonomySeedRows,
} from "../utils/backupData.js";

async function createTables() {
    await sql`
        CREATE TABLE IF NOT EXISTS species (
            species_id TEXT PRIMARY KEY,
            scientific_name TEXT NOT NULL,
            common_name TEXT NOT NULL,
            subgenus TEXT,
            class_name TEXT,
            order_name TEXT,
            family_name TEXT,
            genus_name TEXT,
            province TEXT,
            municipality TEXT,
            num_conopeptides INTEGER DEFAULT 0,
            diet_type TEXT,
            sequencing_platform TEXT,
            tissue_source TEXT,
            raw_data_in_ncbi_sra BOOLEAN DEFAULT FALSE,
            shell_image TEXT,
            project TEXT,
            doi TEXT,
            status TEXT DEFAULT 'Published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS taxonomy (
            species_id TEXT PRIMARY KEY,
            scientific_name TEXT NOT NULL,
            common_name TEXT NOT NULL,
            class_name TEXT,
            order_name TEXT,
            family_name TEXT,
            genus_name TEXT,
            subgenus TEXT,
            organisms_diet TEXT,
            anatomical_sample TEXT,
            tissue_source TEXT
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS conopeptide (
            accession TEXT PRIMARY KEY,
            species_id TEXT,
            species_name TEXT,
            superfamily TEXT,
            framework TEXT,
            predicted_peptide TEXT,
            matched_toxin TEXT,
            precursor_sequence TEXT,
            signal_peptide TEXT,
            propeptide_sequence TEXT,
            mature_peptide_sequence TEXT,
            post_peptide_sequence TEXT,
            remarks_sequence TEXT,
            doi TEXT,
            percent_similarity NUMERIC,
            source_percent_similarity TEXT,
            expression_value NUMERIC,
            precursor_length INTEGER,
            mature_length INTEGER,
            num_cysteine_residues INTEGER,
            cysteine_pattern TEXT,
            cysteine_framework TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS biomarker (
            biomarker_id TEXT PRIMARY KEY,
            species_id TEXT,
            species_name TEXT,
            marker_type TEXT,
            province TEXT,
            municipality TEXT,
            accession TEXT,
            sequence_length INTEGER,
            sequence TEXT,
            source_method TEXT,
            sequence_database TEXT,
            validation_status TEXT,
            publication_doi TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS publication (
            publication_id TEXT PRIMARY KEY,
            title TEXT,
            authors TEXT,
            year_published TEXT,
            journal TEXT,
            doi TEXT,
            evidence_type TEXT,
            linked_species INTEGER DEFAULT 0,
            linked_conopeptides INTEGER DEFAULT 0,
            linked_biomarkers INTEGER DEFAULT 0,
            province TEXT,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
}

async function seedTable({ tableName, idColumn, rows, columns }) {
    const [{ count }] = await sql.unsafe(`SELECT COUNT(*)::int AS count FROM ${tableName}`);

    if (count > 0 || rows.length === 0) {
        return;
    }

    for (const row of rows) {
        const values = columns.map((column) => row[column]);
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

        await sql.unsafe(
            `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders}) ON CONFLICT (${idColumn}) DO NOTHING`,
            values,
        );
    }
}

export async function initializeDatabase() {
    await createTables();

    await seedTable({
        tableName: "species",
        idColumn: "species_id",
        rows: await loadSpeciesSeedRows(),
        columns: [
            "species_id",
            "scientific_name",
            "common_name",
            "subgenus",
            "class_name",
            "order_name",
            "family_name",
            "genus_name",
            "province",
            "municipality",
            "num_conopeptides",
            "diet_type",
            "sequencing_platform",
            "tissue_source",
            "raw_data_in_ncbi_sra",
            "shell_image",
            "project",
            "doi",
            "status",
        ],
    });

    await seedTable({
        tableName: "taxonomy",
        idColumn: "species_id",
        rows: await loadTaxonomySeedRows(),
        columns: [
            "species_id",
            "scientific_name",
            "common_name",
            "class_name",
            "order_name",
            "family_name",
            "genus_name",
            "subgenus",
            "organisms_diet",
            "anatomical_sample",
            "tissue_source",
        ],
    });

    await seedTable({
        tableName: "conopeptide",
        idColumn: "accession",
        rows: await loadConopeptideSeedRows(),
        columns: [
            "accession",
            "species_id",
            "species_name",
            "superfamily",
            "framework",
            "predicted_peptide",
            "matched_toxin",
            "precursor_sequence",
            "signal_peptide",
            "propeptide_sequence",
            "mature_peptide_sequence",
            "post_peptide_sequence",
            "remarks_sequence",
            "doi",
            "percent_similarity",
            "source_percent_similarity",
            "expression_value",
            "precursor_length",
            "mature_length",
            "num_cysteine_residues",
            "cysteine_pattern",
            "cysteine_framework",
        ],
    });

    await seedTable({
        tableName: "biomarker",
        idColumn: "biomarker_id",
        rows: await loadBiomarkerSeedRows(),
        columns: [
            "biomarker_id",
            "species_id",
            "species_name",
            "marker_type",
            "province",
            "municipality",
            "accession",
            "sequence_length",
            "sequence",
            "source_method",
            "sequence_database",
            "validation_status",
            "publication_doi",
        ],
    });

    await seedTable({
        tableName: "publication",
        idColumn: "publication_id",
        rows: await loadPublicationSeedRows(),
        columns: [
            "publication_id",
            "title",
            "authors",
            "year_published",
            "journal",
            "doi",
            "evidence_type",
            "linked_species",
            "linked_conopeptides",
            "linked_biomarkers",
            "province",
            "status",
        ],
    });
}
