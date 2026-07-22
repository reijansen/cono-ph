import { sql } from "../config/db.js";

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

function formatMatchedToxin(value) {
    const toxin = String(value ?? "").trim();
    return toxin || "Unidentified";
}

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function hasUsableSequence(value) {
    const sequence = normalize(value).trim();
    return Boolean(sequence && !["unavailable", "n/a", "na", "none", "-"].includes(sequence));
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
    const field = sortBy || "accession";

    return [...rows].sort((left, right) => {
        const a = left[field];
        const b = right[field];
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        return String(a).localeCompare(String(b)) * direction;
    });
}

function mapConopeptideDetail(row) {
    if (!row) return null;

    return {
        accession: row.accession,
        title: row.accession,
        subtitle: "Conopeptide Precursor",
        status: String(row.doi ?? "Unavailable") === "Unpublished" ? "Unpublished" : "Published",
        topSummaryItems: [
            { label: "Conopeptide ID", value: row.accession || "Unavailable" },
            { label: "Gene superfamily", value: row.superfamily || "Unavailable" },
            { label: "Precursor length", value: `${String(row.precursorLength ?? "Unavailable")} aa` },
            { label: "Cysteine Framework", value: row.cysteineFramework || "Unavailable" },
        ],
        generalInformation: {
            conopeptideId: row.accession || "Unavailable",
            species: row.speciesName || "Unavailable",
            speciesId: row.speciesId || "Unavailable",
            sequenceRemarks: row.remarksSequence || "Unavailable",
        },
        sequenceInformation: {
            precursorSequence: row.precursorSequence || "Unavailable",
            precursorLength: `${String(row.precursorLength ?? "Unavailable")} aa`,
        },
        sequenceArchitecture: [
            { label: "Signal peptide", value: row.signalPeptide || "Unavailable" },
            { label: "Propeptide", value: row.propeptideSequence || "Unavailable" },
            { label: "Mature peptide", value: row.maturePeptideSequence || "Unavailable" },
            { label: "Post peptide", value: row.postPeptideSequence || "Unavailable" },
        ],
        classification: {
            geneSuperfamily: row.superfamily || "Unavailable",
            maturePeptideLength: `${String(row.matureLength ?? "Unavailable")} aa`,
            numberOfCysteines: String(row.numCysteineResidues ?? "Unavailable"),
            cysteinePattern: row.cysteinePattern || "Unavailable",
            cysteineFramework: row.cysteineFramework || "Unavailable",
        },
        similarity: {
            matchedToxin: formatMatchedToxin(row.matchedToxin),
            percentSimilarity: String(row.percentSimilarity ?? "Unavailable"),
            similaritySource: row.sourcePercentSimilarity || "Unavailable",
        },
        expression: {
            expressionValue: String(row.expressionValue ?? "Unavailable"),
        },
        reference: {
            doi: row.doi || "Unavailable",
        },
    };
}

export async function listConopeptides(filters = {}) {
    const rows = await CONOPEPTIDE_SELECT;
    let filtered = rows.filter((row) => {
        const searchTerm = normalize(filters.search).trim();
        const searchable = normalize([row.accession, row.speciesName, row.superfamily, row.cysteineFramework, row.predictedPeptide, row.maturePeptideSequence, row.matchedToxin, row.doi].join(" "));

        if (searchTerm && !searchable.includes(searchTerm)) return false;
        if (filters.species && !String(filters.species).startsWith("All ") && row.speciesName !== filters.species) return false;
        if (filters.superfamily && !String(filters.superfamily).startsWith("All ") && row.superfamily !== filters.superfamily) return false;
        if (filters.cysteineFramework && !String(filters.cysteineFramework).startsWith("All ") && row.cysteineFramework !== filters.cysteineFramework) return false;
        if ((filters.hasMaturePeptideSequence === "yes" || filters.hasPredictedPeptide === "yes") && !hasUsableSequence(row.maturePeptideSequence)) return false;
        return true;
    });

    filtered = sortRows(filtered, filters.sortBy, filters.order);
    const { rows: paginatedRows, pagination } = paginate(filtered, filters.page, filters.limit);

    return { rows: paginatedRows, pagination, total: filtered.length };
}

export async function getConopeptideById(accession) {
    const rows = await sql`${CONOPEPTIDE_SELECT} WHERE accession = ${accession}`;
    return mapConopeptideDetail(rows[0] ?? null);
}

export async function listConopeptideFilters() {
    const rows = await CONOPEPTIDE_SELECT;
    return {
        species: Array.from(new Set(rows.map((row) => row.speciesName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        superfamily: Array.from(new Set(rows.map((row) => row.superfamily).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        cysteineFramework: Array.from(new Set(rows.map((row) => row.cysteineFramework).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    };
}

export async function getConopeptideSummary() {
    const rows = await CONOPEPTIDE_SELECT;
    return { conopeptideCount: rows.length };
}
