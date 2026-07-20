import { randomUUID } from "crypto";
import { sql } from "../config/db.js";

const SPECIES_SELECT = sql`
    SELECT
        species_id AS "speciesId",
        scientific_name AS "scientificName",
        common_name AS "commonName",
        subgenus,
        class_name AS "className",
        order_name AS "orderName",
        family_name AS "familyName",
        genus_name AS "genusName",
        province,
        municipality,
        num_conopeptides AS "precursorsCount",
        num_conopeptides AS "numConopeptides",
        diet_type AS "diet",
        sequencing_platform AS "sequencingPlatform",
        tissue_source AS "tissueSource",
        raw_data_in_ncbi_sra AS "rawDataInNcbiSra",
        shell_image AS image,
        project,
        doi,
        status,
        created_at AS "createdAt"
    FROM species
`;

const TAXONOMY_SELECT = sql`
    SELECT
        species_id AS "speciesId",
        scientific_name AS "scientificName",
        common_name AS "commonName",
        class_name AS "className",
        order_name AS "orderName",
        family_name AS "familyName",
        genus_name AS "genusName",
        subgenus,
        organisms_diet AS "organismsDiet",
        anatomical_sample AS "anatomicalSample",
        tissue_source AS "tissueSource"
    FROM taxonomy
`;

const CONOPEPTIDE_SELECT = sql`
    SELECT
        accession,
        species_id AS "speciesId",
        species_name AS "speciesName",
        superfamily,
        framework,
        predicted_peptide AS "predictedPeptide",
        matched_toxin AS "matchedToxin",
        precursor_sequence AS "precursorSequence",
        signal_peptide AS "signalPeptide",
        propeptide_sequence AS "propeptideSequence",
        mature_peptide_sequence AS "maturePeptideSequence",
        post_peptide_sequence AS "postPeptideSequence",
        remarks_sequence AS "remarksSequence",
        doi,
        percent_similarity AS "percentSimilarity",
        source_percent_similarity AS "sourcePercentSimilarity",
        expression_value AS "expressionValue",
        precursor_length AS "precursorLength",
        mature_length AS "matureLength",
        num_cysteine_residues AS "numCysteineResidues",
        cysteine_pattern AS "cysteinePattern",
        cysteine_framework AS "cysteineFramework"
    FROM conopeptide
`;

const PUBLICATION_SELECT = sql`
    SELECT
        publication_id AS "publicationId",
        title,
        authors,
        year_published AS year,
        journal,
        doi,
        evidence_type AS "evidenceType",
        linked_species AS "linkedSpecies",
        linked_conopeptides AS "linkedConopeptides",
        linked_biomarkers AS "linkedBiomarkers",
        province,
        status
    FROM publication
`;

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function buildPagination(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
}

function matchesSearch(row, fields, search) {
    const term = normalize(search).trim();
    if (!term) return true;
    return fields.some((field) => normalize(row[field]).includes(term));
}

function sortRows(rows, sortBy, order, fallbackField) {
    const direction = String(order ?? "DESC").toUpperCase() === "ASC" ? 1 : -1;
    const field = sortBy || fallbackField;

    return [...rows].sort((left, right) => {
        const a = left[field];
        const b = right[field];

        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;

        if (typeof a === "number" && typeof b === "number") {
            return (a - b) * direction;
        }

        return String(a).localeCompare(String(b)) * direction;
    });
}

function paginate(rows, page, limit) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const start = (safePage - 1) * safeLimit;
    return {
        rows: rows.slice(start, start + safeLimit),
        pagination: buildPagination(rows.length, safePage, safeLimit),
    };
}

function mapSpeciesDetail(species, taxonomy, conopeptides, publications) {
    if (!species) return null;

    const scientificName = species.scientificName || taxonomy?.scientificName || "";
    const commonName = species.commonName || taxonomy?.commonName || "";

    return {
        speciesId: species.speciesId,
        species: {
            scientificName,
            commonName,
            subgenus: species.subgenus || taxonomy?.subgenus || "",
            className: species.className || taxonomy?.className || "",
            orderName: species.orderName || taxonomy?.orderName || "",
            familyName: species.familyName || taxonomy?.familyName || "",
            genusName: species.genusName || taxonomy?.genusName || "",
            image: species.image || "",
        },
        taxonomy: {
            scientificName,
            commonName,
            className: taxonomy?.className || species.className || "",
            orderName: taxonomy?.orderName || species.orderName || "",
            familyName: taxonomy?.familyName || species.familyName || "",
            genusName: taxonomy?.genusName || species.genusName || "",
            subgenus: taxonomy?.subgenus || species.subgenus || "",
            organismsDiet: taxonomy?.organismsDiet || species.diet || "",
            anatomicalSample: taxonomy?.anatomicalSample || "Venom gland",
        },
        collection: {
            province: species.province || "Unavailable",
            municipality: species.municipality || "Unavailable",
            psgc: "Unavailable",
            specimenRepository: "Unavailable",
            tissueSource: species.tissueSource || taxonomy?.tissueSource || "Unavailable",
        },
        molecular: {
            specimensSequenced: "Unavailable",
            totalConopeptides: String(species.precursorsCount ?? species.numConopeptides ?? 0),
            totalGeneSuperfamilies: "Unavailable",
            sequencingPlatform: species.sequencingPlatform || "Unavailable",
            coiMarker: "Unavailable",
            rawDataAvailable: species.rawDataInNcbiSra ? "Available" : "Unavailable",
            sraAccession: "Unavailable",
        },
        publication: {
            doi: species.doi || "Unavailable",
            title: `Species record for ${scientificName || commonName || species.speciesId}`,
            authors: "Unavailable",
            project: species.project || "Unavailable",
        },
        statistics: [
            { label: "Conopeptide Precursors", value: String(species.precursorsCount ?? 0) },
            { label: "Total Gene Superfamilies", value: "Unavailable" },
            { label: "Specimens Sequenced", value: "Unavailable" },
            { label: "Sequencing Platform", value: species.sequencingPlatform || "Unavailable" },
            { label: "Raw Data in NCBI SRA", value: species.rawDataInNcbiSra ? "Available" : "Unavailable" },
        ],
        conopeptides,
        specimens: [],
        publications,
    };
}

function mapSpeciesRow(row) {
    if (!row) return null;

    return {
        speciesId: row.speciesId,
        scientificName: row.scientificName,
        commonName: row.commonName,
        subgenus: row.subgenus,
        className: row.className,
        orderName: row.orderName,
        familyName: row.familyName,
        genusName: row.genusName,
        province: row.province,
        municipality: row.municipality,
        precursorsCount: row.precursorsCount ?? row.numConopeptides ?? 0,
        numConopeptides: row.numConopeptides ?? row.precursorsCount ?? 0,
        diet: row.diet,
        sequencingPlatform: row.sequencingPlatform,
        tissueSource: row.tissueSource,
        rawDataInNcbiSra: row.rawDataInNcbiSra,
        image: row.image,
        imagePosition: "center center",
        project: row.project,
        doi: row.doi,
        status: row.status,
    };
}

export async function listSpecies(filters = {}) {
    const rows = await SPECIES_SELECT;
    let filtered = rows.filter((row) => {
        if (!matchesSearch(row, ["speciesId", "scientificName", "commonName", "subgenus", "province", "municipality", "diet", "project", "doi"], filters.search)) {
            return false;
        }
        if (filters.subgenus && !String(filters.subgenus).startsWith("All ") && row.subgenus !== filters.subgenus) return false;
        if (filters.province && !String(filters.province).startsWith("All ") && row.province !== filters.province) return false;
        if (filters.municipality && !String(filters.municipality).startsWith("All ") && row.municipality !== filters.municipality) return false;
        if (filters.diet && !String(filters.diet).startsWith("All ") && row.diet !== filters.diet) return false;
        return true;
    });

    filtered = sortRows(filtered, filters.sortBy, filters.order, "createdAt");
    const { rows: paginatedRows, pagination } = paginate(filtered, filters.page, filters.limit);

    return {
        rows: paginatedRows,
        pagination,
        total: filtered.length,
    };
}

export async function getSpeciesById(speciesId) {
    const rows = await sql`${SPECIES_SELECT} WHERE species_id = ${speciesId}`;
    const species = rows[0] ?? null;

    if (!species) return null;

    const taxonomyRows = await sql`${TAXONOMY_SELECT} WHERE species_id = ${speciesId}`;
    const relatedConopeptides = (await sql`${CONOPEPTIDE_SELECT} WHERE species_id = ${speciesId}`)
        .map((row) => ({
            conopeptideId: row.accession,
            species: row.speciesName || species.scientificName || "Unavailable",
            publication: row.doi || "Unavailable",
            geneSuperfamily: row.superfamily || "Unavailable",
        }));

    const relatedPublications = (await PUBLICATION_SELECT).filter((row) => {
        const needle = species.doi ? normalize(species.doi) : normalize(species.scientificName);
        return needle && (
            normalize(row.title).includes(needle) ||
            normalize(row.authors).includes(needle) ||
            normalize(row.doi).includes(needle)
        );
    });

    return mapSpeciesDetail(species, taxonomyRows[0] ?? null, relatedConopeptides, relatedPublications);
}

export async function createSpecies(data) {
    const scientificName = String(data.scientific_name ?? data.scientificName ?? "").trim();
    const commonName = String(data.common_name ?? data.commonName ?? "").trim();

    if (!scientificName || !commonName) {
        return null;
    }

    const speciesId = String(data.species_id ?? data.speciesId ?? randomUUID()).slice(0, 20);
    const numConopeptides = Number(data.num_conopeptides ?? data.numConopeptides ?? data.num_related_publications ?? data.numRelatedPublications ?? 0);

    const rows = await sql`
        INSERT INTO species (
            species_id,
            scientific_name,
            common_name,
            subgenus,
            class_name,
            order_name,
            family_name,
            genus_name,
            province,
            municipality,
            num_conopeptides,
            diet_type,
            sequencing_platform,
            tissue_source,
            raw_data_in_ncbi_sra,
            shell_image,
            project,
            doi,
            status
        ) VALUES (
            ${speciesId},
            ${scientificName},
            ${commonName},
            ${String(data.subgenus ?? "")},
            ${String(data.class_name ?? data.className ?? "")},
            ${String(data.order_name ?? data.orderName ?? "")},
            ${String(data.family_name ?? data.familyName ?? "")},
            ${String(data.genus_name ?? data.genusName ?? "")},
            ${String(data.province ?? "")},
            ${String(data.municipality ?? "")},
            ${Number.isFinite(numConopeptides) ? numConopeptides : 0},
            ${String(data.diet_type ?? data.diet ?? "")},
            ${String(data.sequencing_platform ?? data.sequencingPlatform ?? "")},
            ${String(data.tissue_source ?? data.tissueSource ?? "")},
            ${Boolean(data.raw_data_in_ncbi_sra ?? data.rawDataInNcbiSra ?? false)},
            ${String(data.shell_image ?? data.image ?? "")},
            ${String(data.project ?? "")},
            ${String(data.doi ?? "")},
            ${String(data.status ?? "Published")}
        )
        RETURNING *
    `;

    return mapSpeciesRow(rows[0] ?? null);
}

export async function updateSpecies(speciesId, data) {
    const current = await sql`${SPECIES_SELECT} WHERE species_id = ${speciesId}`;
    if (!current[0]) return null;

    const next = {
        scientific_name: String(data.scientific_name ?? data.scientificName ?? current[0].scientificName),
        common_name: String(data.common_name ?? data.commonName ?? current[0].commonName),
        subgenus: String(data.subgenus ?? current[0].subgenus ?? ""),
        class_name: String(data.class_name ?? data.className ?? current[0].className ?? ""),
        order_name: String(data.order_name ?? data.orderName ?? current[0].orderName ?? ""),
        family_name: String(data.family_name ?? data.familyName ?? current[0].familyName ?? ""),
        genus_name: String(data.genus_name ?? data.genusName ?? current[0].genusName ?? ""),
        province: String(data.province ?? current[0].province ?? ""),
        municipality: String(data.municipality ?? current[0].municipality ?? ""),
        num_conopeptides: Number.isFinite(Number(data.num_conopeptides ?? data.numConopeptides ?? data.num_related_publications ?? data.numRelatedPublications))
            ? Number(data.num_conopeptides ?? data.numConopeptides ?? data.num_related_publications ?? data.numRelatedPublications)
            : current[0].precursorsCount ?? 0,
        diet_type: String(data.diet_type ?? data.diet ?? current[0].diet ?? ""),
        sequencing_platform: String(data.sequencing_platform ?? data.sequencingPlatform ?? current[0].sequencingPlatform ?? ""),
        tissue_source: String(data.tissue_source ?? data.tissueSource ?? current[0].tissueSource ?? ""),
        raw_data_in_ncbi_sra: Boolean(data.raw_data_in_ncbi_sra ?? data.rawDataInNcbiSra ?? current[0].rawDataInNcbiSra ?? false),
        shell_image: String(data.shell_image ?? data.image ?? current[0].image ?? ""),
        project: String(data.project ?? current[0].project ?? ""),
        doi: String(data.doi ?? current[0].doi ?? ""),
        status: String(data.status ?? current[0].status ?? "Published"),
    };

    const rows = await sql`
        UPDATE species
        SET
            scientific_name = ${next.scientific_name},
            common_name = ${next.common_name},
            subgenus = ${next.subgenus},
            class_name = ${next.class_name},
            order_name = ${next.order_name},
            family_name = ${next.family_name},
            genus_name = ${next.genus_name},
            province = ${next.province},
            municipality = ${next.municipality},
            num_conopeptides = ${next.num_conopeptides},
            diet_type = ${next.diet_type},
            sequencing_platform = ${next.sequencing_platform},
            tissue_source = ${next.tissue_source},
            raw_data_in_ncbi_sra = ${next.raw_data_in_ncbi_sra},
            shell_image = ${next.shell_image},
            project = ${next.project},
            doi = ${next.doi},
            status = ${next.status}
        WHERE species_id = ${speciesId}
        RETURNING *
    `;

    return mapSpeciesRow(rows[0] ?? null);
}

export async function deleteSpecies(speciesId) {
    const rows = await sql`DELETE FROM species WHERE species_id = ${speciesId} RETURNING *`;
    return mapSpeciesRow(rows[0] ?? null);
}

export async function listSpeciesOptions() {
    const rows = await SPECIES_SELECT;
    return {
        subgenus: Array.from(new Set(rows.map((row) => row.subgenus).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        province: Array.from(new Set(rows.map((row) => row.province).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        municipality: Array.from(new Set(rows.map((row) => row.municipality).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        diet: Array.from(new Set(rows.map((row) => row.diet).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    };
}

export async function getSpeciesSummary() {
    const [speciesRows, conopeptideRows, publicationRows] = await Promise.all([
        SPECIES_SELECT,
        CONOPEPTIDE_SELECT,
        PUBLICATION_SELECT,
    ]);

    return {
        speciesCount: speciesRows.length,
        conopeptideCount: conopeptideRows.length,
        publicationCount: publicationRows.length,
    };
}
