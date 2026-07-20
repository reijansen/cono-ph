import { sql } from "../config/db.js";
import { getAdminResource, adminResources } from "../config/adminResources.js";
import { ApiError } from "../utils/apiError.js";

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function coerceValue(value, type) {
    if (type === "number") {
        if (value === "" || value == null) return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    if (type === "boolean") {
        return value === true || value === "true" || value === "1" || value === "yes";
    }

    return value == null ? "" : String(value);
}

function cleanPayload(resource, payload, { partial = false } = {}) {
    const next = {};

    for (const column of resource.columns) {
        if (!(column in payload)) continue;
        next[column] = coerceValue(payload[column], resource.types[column]);
    }

    if (!partial) {
        for (const column of resource.required) {
            if (!String(next[column] ?? "").trim()) {
                throw new ApiError(400, `${column} is required`, "VALIDATION_ERROR");
            }
        }
    }

    return next;
}

function paginate(rows, page, limit) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(Number(limit) || 25, 100));
    const start = (safePage - 1) * safeLimit;

    return {
        rows: rows.slice(start, start + safeLimit),
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: rows.length,
            totalPages: Math.max(1, Math.ceil(rows.length / safeLimit)),
        },
    };
}

function assertResource(resourceName) {
    const resource = getAdminResource(resourceName);
    if (!resource) {
        throw new ApiError(404, "Admin resource not found", "ADMIN_RESOURCE_NOT_FOUND");
    }
    return resource;
}

export function listAdminResourceMetadata() {
    return Object.entries(adminResources).map(([key, resource]) => ({
        key,
        label: resource.label,
        idColumn: resource.idColumn,
        columns: resource.columns,
        required: resource.required,
        types: resource.types,
    }));
}

export async function listAdminRows(resourceName, filters = {}) {
    const resource = assertResource(resourceName);
    const rows = await sql.unsafe(`SELECT ${resource.columns.join(", ")} FROM ${resource.table}`);
    const search = normalize(filters.search).trim();
    let filteredRows = search
        ? rows.filter((row) => resource.searchable.some((column) => normalize(row[column]).includes(search)))
        : rows;

    if (filters.filterColumn && filters.filterValue && resource.columns.includes(filters.filterColumn)) {
        const filterValue = normalize(filters.filterValue).trim();
        filteredRows = filteredRows.filter((row) => normalize(row[filters.filterColumn]).includes(filterValue));
    }

    filteredRows.sort((left, right) => String(left[resource.idColumn] ?? "").localeCompare(String(right[resource.idColumn] ?? "")));

    return paginate(filteredRows, filters.page, filters.limit);
}

export async function getAdminRow(resourceName, id) {
    const resource = assertResource(resourceName);
    const rows = await sql.unsafe(
        `SELECT ${resource.columns.join(", ")} FROM ${resource.table} WHERE ${resource.idColumn} = $1 LIMIT 1`,
        [id],
    );
    return rows[0] ?? null;
}

export async function createAdminRow(resourceName, payload) {
    const resource = assertResource(resourceName);
    const data = cleanPayload(resource, payload);
    const columns = resource.columns.filter((column) => column in data);
    const values = columns.map((column) => data[column]);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    const rows = await sql.unsafe(
        `INSERT INTO ${resource.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING ${resource.columns.join(", ")}`,
        values,
    );

    return rows[0] ?? null;
}

export async function updateAdminRow(resourceName, id, payload) {
    const resource = assertResource(resourceName);
    const existing = await getAdminRow(resourceName, id);
    if (!existing) return null;

    const data = cleanPayload(resource, payload, { partial: true });
    const columns = resource.columns.filter((column) => column !== resource.idColumn && column in data);

    if (columns.length === 0) {
        return existing;
    }

    const setList = columns.map((column, index) => `${column} = $${index + 1}`).join(", ");
    const values = columns.map((column) => data[column]);

    const rows = await sql.unsafe(
        `UPDATE ${resource.table} SET ${setList} WHERE ${resource.idColumn} = $${columns.length + 1} RETURNING ${resource.columns.join(", ")}`,
        [...values, id],
    );

    return rows[0] ?? null;
}

export async function deleteAdminRow(resourceName, id) {
    const resource = assertResource(resourceName);
    const rows = await sql.unsafe(
        `DELETE FROM ${resource.table} WHERE ${resource.idColumn} = $1 RETURNING ${resource.columns.join(", ")}`,
        [id],
    );

    return rows[0] ?? null;
}
