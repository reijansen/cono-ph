import { sql } from "../config/db.js";

const BIOMARKER_SELECT = sql`
    SELECT
        biomarker_id AS "biomarkerId",
        species_id AS "speciesId",
        species_name AS "speciesName",
        marker_type AS "markerType",
        province,
        municipality,
        accession,
        sequence_length AS "sequenceLength",
        sequence,
        source_method AS "sourceMethod",
        sequence_database AS "sequenceDatabase",
        validation_status AS "validationStatus",
        publication_doi AS "publicationDoi"
    FROM biomarker
`;

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function hasUsableSequence(value) {
    const sequence = String(value ?? "").trim();
    const normalized = normalize(sequence);
    if (!sequence || ["unavailable", "n/a", "na", "none", "-"].includes(normalized)) return false;
    return true;
}

function getPublicBiomarkerRows(rows) {
    const referencedSpeciesIds = new Set(
        rows.map((row) => String(row?.speciesId ?? "").trim()).filter(Boolean),
    );

    return rows.filter((row) => !isLegacySpecimenIdRow(row, referencedSpeciesIds));
}

function isLegacySpecimenIdRow(row, referencedSpeciesIds = new Set()) {
    const biomarkerId = String(row?.biomarkerId ?? "").trim();
    const speciesId = String(row?.speciesId ?? "").trim();
    return Boolean(biomarkerId && ((speciesId && biomarkerId === speciesId) || referencedSpeciesIds.has(biomarkerId)));
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
    const safeLimit = Math.max(1, Number(limit) || 10);
    const start = (safePage - 1) * safeLimit;
    return {
        rows: rows.slice(start, start + safeLimit),
        pagination: buildPagination(rows.length, safePage, safeLimit),
    };
}

function sortRows(rows, sortBy, order) {
    const direction = String(order ?? "DESC").toUpperCase() === "ASC" ? 1 : -1;
    const field = sortBy || "biomarkerId";

    return [...rows].sort((left, right) => {
        const a = left[field];
        const b = right[field];
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        return String(a).localeCompare(String(b)) * direction;
    });
}

function normalizeStatus(status) {
    const value = String(status ?? "Unavailable");
    return value === "Putative" ? "Partial" : value;
}

function mapBiomarkerDetail(row) {
    if (!row) return null;

    const status = normalizeStatus(row.validationStatus);

    return {
        biomarkerId: row.biomarkerId,
        title: row.biomarkerId,
        subtitle: "Biomarker Record",
        status,
        topSummaryItems: [
            { label: "Barcode ID", value: row.biomarkerId || "Unavailable" },
            { label: "Species Name", value: row.speciesName || "Unavailable" },
            { label: "Specimen ID", value: row.speciesId || "Unavailable" },
            { label: "Gene Marker", value: row.markerType || "Unavailable" },
            { label: "Collection Province", value: row.province || "Unavailable" },
            { label: "Validation Status", value: status },
        ],
        overview: {
            fields: [
                { label: "Barcode ID", value: row.biomarkerId || "Unavailable" },
                { label: "Species Name", value: row.speciesName || "Unavailable" },
                { label: "Gene Marker", value: row.markerType || "Unavailable" },
                { label: "External Accession", value: row.accession || "Unavailable" },
                { label: "Sequence Length (bp)", value: String(row.sequenceLength ?? "Unavailable") },
                { label: "Collection Province", value: row.province || "Unavailable" },
                { label: "Validation Status", value: status },
                { label: "Publication DOI", value: row.publicationDoi || "Unavailable" },
            ],
        },
        sequenceTab: {
            sequence: row.sequence || "Unavailable",
            length: String(row.sequenceLength ?? "Unavailable"),
            translated: "Unavailable",
            translatedNote: "Rendered from database data.",
            summaryItems: [
                { label: "Sequence Length (bp)", value: String(row.sequenceLength ?? "Unavailable") },
                { label: "Source Method", value: row.sourceMethod || "Unavailable" },
                { label: "Sequence Completeness", value: status },
            ],
        },
        annotationsTab: {
            summary: "Rendered from database data.",
            items: [
                { label: "Validation Status", value: status },
                { label: "Gene Marker", value: row.markerType || "Unavailable" },
                { label: "External Accession", value: row.accession || "Unavailable" },
                { label: "Coverage Note", value: row.sourceMethod || "Unavailable" },
                { label: "Source of Percent Similarity", value: "Unavailable" },
                { label: "Expression Value", value: "Unavailable" },
                { label: "Curated Annotation Remarks", value: row.sequenceDatabase || "Unavailable" },
            ],
        },
        metadataTab: {
            rows: [
                { label: "Barcode ID", value: row.biomarkerId || "Unavailable" },
                { label: "Species Name", value: row.speciesName || "Unavailable" },
                { label: "Specimen ID", value: row.speciesId || "Unavailable" },
                { label: "Collection Province", value: row.province || "Unavailable" },
                { label: "Collection Site (Municipality)", value: row.municipality || "Unavailable" },
                { label: "Source Method", value: row.sourceMethod || "Unavailable" },
                { label: "Sequence Database", value: row.sequenceDatabase || "Unavailable" },
                { label: "Validation Status", value: status },
            ],
        },
    };
}

export async function listBiomarkers(filters = {}) {
    const rows = getPublicBiomarkerRows(await BIOMARKER_SELECT).filter((row) => hasUsableSequence(row.sequence));
    let filtered = rows.filter((row) => {
        const searchTerm = normalize(filters.search).trim();
        const searchable = normalize([row.biomarkerId, row.speciesId, row.speciesName, row.markerType, row.accession, row.sequence, row.province, row.validationStatus, row.publicationDoi].join(" "));

        if (searchTerm && !searchable.includes(searchTerm)) return false;
        if (filters.markerType && !String(filters.markerType).startsWith("All ") && row.markerType !== filters.markerType) return false;
        if (filters.species && !String(filters.species).startsWith("All ") && row.speciesName !== filters.species) return false;
        if (filters.province && !String(filters.province).startsWith("All ") && row.province !== filters.province) return false;
        if (Array.isArray(filters.status) && filters.status.length > 0 && !filters.status.includes(normalizeStatus(row.validationStatus))) return false;
        if (filters.hasAccession && !String(row.accession ?? "").trim()) return false;
        return true;
    });

    filtered = sortRows(filtered, filters.sortBy, filters.order);
    const { rows: paginatedRows, pagination } = paginate(filtered, filters.page, filters.limit);

    return { rows: paginatedRows.map((row) => ({ ...row, validationStatus: normalizeStatus(row.validationStatus) })), pagination, total: filtered.length };
}

export async function getBiomarkerById(biomarkerId) {
    const rows = getPublicBiomarkerRows(await BIOMARKER_SELECT).filter((row) => row.biomarkerId === biomarkerId && hasUsableSequence(row.sequence));
    return mapBiomarkerDetail(rows[0] ?? null);
}

export async function listBiomarkerFilters() {
    const rows = getPublicBiomarkerRows(await BIOMARKER_SELECT).filter((row) => hasUsableSequence(row.sequence));
    return {
        markerType: Array.from(new Set(rows.map((row) => row.markerType).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        species: Array.from(new Set(rows.map((row) => row.speciesName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        province: Array.from(new Set(rows.map((row) => row.province).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        status: Array.from(new Set(rows.map((row) => normalizeStatus(row.validationStatus)).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    };
}

export async function getBiomarkerSummary() {
    const rows = getPublicBiomarkerRows(await BIOMARKER_SELECT).filter((row) => hasUsableSequence(row.sequence));
    return { biomarkerCount: rows.length };
}
