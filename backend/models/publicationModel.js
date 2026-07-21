import { sql } from "../config/db.js";

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

const SPECIES_LINK_SELECT = sql`
    SELECT species_id AS "speciesId", scientific_name AS "scientificName", doi
    FROM species
`;

const CONOPEPTIDE_LINK_SELECT = sql`
    SELECT accession, doi
    FROM conopeptide
`;

const BIOMARKER_LINK_SELECT = sql`
    SELECT biomarker_id AS "biomarkerId", publication_doi AS "publicationDoi"
    FROM biomarker
`;

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function normalizeDoi(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/(dx\.)?doi\.org\//, "")
        .replace(/^doi:\s*/, "")
        .replace(/[.,;\s]+$/, "");
}

function splitDoiList(value) {
    return String(value ?? "")
        .split(/[,;]+/)
        .map(normalizeDoi)
        .filter((item) => item && item !== "unavailable" && item !== "unpublished");
}

function doiListIncludes(value, doi) {
    const normalizedDoi = normalizeDoi(doi);
    if (!normalizedDoi) return false;
    return splitDoiList(value).includes(normalizedDoi);
}

function uniqueCount(rows, idGetter) {
    return new Set(rows.map(idGetter).filter(Boolean)).size;
}

function buildPagination(total, page, limit) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
}

function paginate(rows, page, limit) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 5);
    const start = (safePage - 1) * safeLimit;
    return {
        rows: rows.slice(start, start + safeLimit),
        pagination: buildPagination(rows.length, safePage, safeLimit),
    };
}

function sortRows(rows, sortBy, order) {
    const direction = String(order ?? "DESC").toUpperCase() === "ASC" ? 1 : -1;
    const field = sortBy || "year";

    return [...rows].sort((left, right) => {
        const a = left[field];
        const b = right[field];
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        return String(a).localeCompare(String(b)) * direction;
    });
}

async function enrichPublicationRows(rows) {
    const [speciesRows, conopeptideRows, biomarkerRows] = await Promise.all([
        SPECIES_LINK_SELECT,
        CONOPEPTIDE_LINK_SELECT,
        BIOMARKER_LINK_SELECT,
    ]);

    return rows.map((row) => {
        const linkedSpecies = uniqueCount(
            speciesRows.filter((species) => doiListIncludes(species.doi, row.doi)),
            (species) => species.speciesId,
        );
        const linkedConopeptides = uniqueCount(
            conopeptideRows.filter((conopeptide) => doiListIncludes(conopeptide.doi, row.doi)),
            (conopeptide) => conopeptide.accession,
        );
        const linkedBiomarkers = uniqueCount(
            biomarkerRows.filter((biomarker) => doiListIncludes(biomarker.publicationDoi, row.doi)),
            (biomarker) => biomarker.biomarkerId,
        );

        return {
            ...row,
            linkedSpecies: linkedSpecies || Number(row.linkedSpecies || 0),
            linkedConopeptides: linkedConopeptides || Number(row.linkedConopeptides || 0),
            linkedBiomarkers: linkedBiomarkers || Number(row.linkedBiomarkers || 0),
        };
    });
}

export async function listPublications(filters = {}) {
    const rows = await enrichPublicationRows(await PUBLICATION_SELECT);
    let filtered = rows.filter((row) => {
        const searchTerm = normalize(filters.search).trim();
        const searchable = normalize(Object.values(row).join(" "));

        if (searchTerm && !searchable.includes(searchTerm)) return false;
        if (filters.year && !String(filters.year).startsWith("All ") && row.year !== filters.year) return false;
        if (filters.journal && !String(filters.journal).startsWith("All ") && row.journal !== filters.journal) return false;
        return true;
    });

    filtered = sortRows(filtered, filters.sortBy, filters.order);
    const { rows: paginatedRows, pagination } = paginate(filtered, filters.page, filters.limit);

    return { rows: paginatedRows, pagination, total: filtered.length };
}

export async function getPublicationById(publicationId) {
    const rows = await sql`${PUBLICATION_SELECT} WHERE publication_id = ${publicationId}`;
    const enrichedRows = await enrichPublicationRows(rows);
    return enrichedRows[0] ?? null;
}

export async function listPublicationFilters() {
    const rows = await PUBLICATION_SELECT;
    return {
        year: Array.from(new Set(rows.map((row) => row.year).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        journal: Array.from(new Set(rows.map((row) => row.journal).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    };
}

export async function getPublicationSummary() {
    const rows = await enrichPublicationRows(await PUBLICATION_SELECT);
    return { publicationCount: rows.length };
}
