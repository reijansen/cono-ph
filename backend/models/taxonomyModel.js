import { sql } from "../config/db.js";

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
    const direction = String(order ?? "ASC").toUpperCase() === "ASC" ? 1 : -1;
    const field = sortBy || "scientificName";

    return [...rows].sort((left, right) => {
        const a = left[field];
        const b = right[field];
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        return String(a).localeCompare(String(b)) * direction;
    });
}

export async function listTaxonomy(filters = {}) {
    const rows = await TAXONOMY_SELECT;
    let filtered = rows.filter((row) => {
        const searchTerm = normalize(filters.search).trim();
        const searchable = normalize(Object.values(row).join(" "));

        if (searchTerm && !searchable.includes(searchTerm)) return false;
        if (filters.className && !String(filters.className).startsWith("All ") && row.className !== filters.className) return false;
        if (filters.orderName && !String(filters.orderName).startsWith("All ") && row.orderName !== filters.orderName) return false;
        if (filters.familyName && !String(filters.familyName).startsWith("All ") && row.familyName !== filters.familyName) return false;
        if (filters.genusName && !String(filters.genusName).startsWith("All ") && row.genusName !== filters.genusName) return false;
        if (filters.subgenus && !String(filters.subgenus).startsWith("All ") && row.subgenus !== filters.subgenus) return false;
        return true;
    });

    filtered = sortRows(filtered, filters.sortBy, filters.order);
    const { rows: paginatedRows, pagination } = paginate(filtered, filters.page, filters.limit);
    return { rows: paginatedRows, pagination, total: filtered.length };
}

export async function getTaxonomyBySpeciesId(speciesId) {
    const rows = await sql`${TAXONOMY_SELECT} WHERE species_id = ${speciesId}`;
    return rows[0] ?? null;
}

export async function listTaxonomyFilters() {
    const rows = await TAXONOMY_SELECT;
    return {
        className: Array.from(new Set(rows.map((row) => row.className).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        orderName: Array.from(new Set(rows.map((row) => row.orderName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        familyName: Array.from(new Set(rows.map((row) => row.familyName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        genusName: Array.from(new Set(rows.map((row) => row.genusName).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
        subgenus: Array.from(new Set(rows.map((row) => row.subgenus).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    };
}
