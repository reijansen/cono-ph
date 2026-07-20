import { sql } from "../config/db.js";
import {
    loadBiomarkerSeedRows,
    loadConopeptideSeedRows,
    loadPublicationSeedRows,
    loadSpeciesSeedRows,
    loadTaxonomySeedRows,
} from "../utils/backupData.js";

async function upsertRows(tableName, idColumn, columns, rows) {
    if (!rows.length) return;

    const updateColumns = columns.filter((column) => column !== idColumn);
    const columnList = columns.join(", ");
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const updateList = updateColumns.map((column) => `${column} = EXCLUDED.${column}`).join(", ");

    for (const row of rows) {
        const values = columns.map((column) => row[column]);
        await sql.unsafe(
            `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholders}) ON CONFLICT (${idColumn}) DO UPDATE SET ${updateList}`,
            values,
        );
    }
}

async function main() {
    await upsertRows("species", "species_id", [
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
    ], await loadSpeciesSeedRows());

    await upsertRows("taxonomy", "species_id", [
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
    ], await loadTaxonomySeedRows());

    await upsertRows("conopeptide", "accession", [
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
    ], await loadConopeptideSeedRows());

    await upsertRows("biomarker", "biomarker_id", [
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
    ], await loadBiomarkerSeedRows());

    await upsertRows("publication", "publication_id", [
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
    ], await loadPublicationSeedRows());

    console.log("Seed completed successfully.");
}

main().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});

