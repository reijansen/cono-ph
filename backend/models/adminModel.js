import { sql } from "../config/db.js";
import { getAdminResource, getOrderedAdminResourceEntries } from "../config/adminResources.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";

function normalize(value) {
    return String(value ?? "").toLowerCase();
}

function normalizeKey(value) {
    return String(value ?? "")
        .replace(/^\uFEFF/, "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
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

function normalizeImportPayload(resource, payload) {
    const aliases = Object.fromEntries(
        Object.entries(resource.importAliases ?? {}).map(([key, value]) => [normalizeKey(key), value]),
    );
    const next = {};

    for (const [key, value] of Object.entries(payload)) {
        const normalizedKey = String(key).trim();
        const column = aliases[normalizeKey(normalizedKey)] ?? normalizedKey;
        next[column] = value;
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
    return getOrderedAdminResourceEntries().map(([key, resource]) => ({
        key,
        label: resource.label,
        idColumn: resource.idColumn,
        columns: resource.columns,
        required: resource.required,
        types: resource.types,
        readOnly: Boolean(resource.readOnly),
    }));
}

function parseCsv(content) {
    const normalizedContent = String(content ?? "")
        .replace(/^\uFEFF/, "")
        .replace(/,"""([^",\r\n]+)(?=,)/g, ",$1");
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    const pushCell = () => {
        row.push(cell);
        cell = "";
    };

    const pushRow = () => {
        if (row.some((value) => String(value).trim())) rows.push(row);
        row = [];
    };

    for (let index = 0; index < normalizedContent.length; index += 1) {
        const character = normalizedContent[index];
        const nextCharacter = normalizedContent[index + 1];

        if (inQuotes) {
            if (character === "\"") {
                if (nextCharacter === "\"") {
                    cell += "\"";
                    index += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += character;
            }
            continue;
        }

        if (character === "\"") {
            inQuotes = true;
            continue;
        }

        if (character === ",") {
            pushCell();
            continue;
        }

        if (character === "\n") {
            pushCell();
            pushRow();
            continue;
        }

        if (character !== "\r") {
            cell += character;
        }
    }

    if (cell.length > 0 || row.length > 0) {
        pushCell();
        pushRow();
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim());
    return rows.slice(1).map((values) => {
        const record = {};
        headers.forEach((header, index) => {
            record[header] = values[index] ?? "";
        });
        return record;
    });
}

async function archiveExistingRecord(resourceName, resource, id, existing, reason = "import-overwrite") {
    const archiveId = crypto.randomUUID();
    await sql.unsafe(
        "INSERT INTO admin_archive (archive_id, resource_name, record_id, record_data, archived_by) VALUES ($1, $2, $3, $4::jsonb, $5)",
        [archiveId, resourceName, String(id), JSON.stringify({ ...existing, archive_reason: reason }), "admin"],
    );
    return archiveId;
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
    if (resource.readOnly) {
        throw new ApiError(400, "This admin resource is read-only", "ADMIN_RESOURCE_READ_ONLY");
    }

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
    if (resource.readOnly) {
        throw new ApiError(400, "This admin resource is read-only", "ADMIN_RESOURCE_READ_ONLY");
    }

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
    if (resource.readOnly) {
        throw new ApiError(400, "This admin resource is read-only", "ADMIN_RESOURCE_READ_ONLY");
    }

    const existing = await getAdminRow(resourceName, id);
    if (!existing) return null;

    const archiveId = await archiveExistingRecord(resourceName, resource, id, existing, "manual-archive");

    await sql.unsafe(
        `DELETE FROM ${resource.table} WHERE ${resource.idColumn} = $1`,
        [id],
    );

    return { ...existing, archived: true, archive_id: archiveId };
}

export async function restoreArchivedRow(archiveId) {
    const archiveResource = assertResource("archive");
    const archive = await getAdminRow("archive", archiveId);
    if (!archive) return null;

    const resource = assertResource(archive.resource_name);
    if (resource.readOnly) {
        throw new ApiError(400, "Archived resource cannot be restored", "ARCHIVE_RESTORE_INVALID_RESOURCE");
    }

    const existing = await getAdminRow(archive.resource_name, archive.record_id);
    if (existing) {
        throw new ApiError(409, "An active record with this primary key already exists", "ARCHIVE_RESTORE_CONFLICT");
    }

    const recordData = archive.record_data ?? {};
    const data = cleanPayload(resource, recordData);
    const columns = resource.columns.filter((column) => column in data);
    const values = columns.map((column) => data[column]);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    const restoredRows = await sql.unsafe(
        `INSERT INTO ${resource.table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING ${resource.columns.join(", ")}`,
        values,
    );

    await sql.unsafe(`DELETE FROM ${archiveResource.table} WHERE ${archiveResource.idColumn} = $1`, [archiveId]);

    return restoredRows[0] ?? null;
}

export async function permanentlyDeleteArchivedRow(archiveId) {
    const archiveResource = assertResource("archive");
    const rows = await sql.unsafe(
        `DELETE FROM ${archiveResource.table} WHERE ${archiveResource.idColumn} = $1 RETURNING ${archiveResource.columns.join(", ")}`,
        [archiveId],
    );

    return rows[0] ?? null;
}

export async function importAdminCsv(resourceName, { filename = "dataset.csv", csvText = "" } = {}) {
    const resource = assertResource(resourceName);
    if (resource.readOnly) {
        throw new ApiError(400, "This admin resource cannot import CSV", "ADMIN_IMPORT_READ_ONLY");
    }

    if (!String(filename).toLowerCase().endsWith(".csv")) {
        throw new ApiError(400, "Only CSV files are supported", "ADMIN_IMPORT_INVALID_FILE");
    }

    if (!csvText || Buffer.byteLength(csvText, "utf8") > 2_500_000) {
        throw new ApiError(400, "CSV file is empty or too large", "ADMIN_IMPORT_INVALID_SIZE");
    }

    const parsedRows = parseCsv(csvText);
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const skippedReasons = new Map();

    const trackSkipped = (reason) => {
        skippedCount += 1;
        skippedReasons.set(reason, (skippedReasons.get(reason) || 0) + 1);
    };

    for (const row of parsedRows) {
        const data = cleanPayload(resource, normalizeImportPayload(resource, row), { partial: true });
        const id = data[resource.idColumn];

        if (!String(id ?? "").trim()) {
            trackSkipped(`Missing ${resource.idColumn}`);
            continue;
        }

        let missingRequiredField = "";
        for (const column of resource.required) {
            if (!String(data[column] ?? "").trim()) {
                missingRequiredField = column;
                break;
            }
        }
        if (missingRequiredField) {
            trackSkipped(`Missing ${missingRequiredField}`);
            continue;
        }

        const existing = await getAdminRow(resourceName, id);
        const columns = resource.columns.filter((column) => column in data);
        const values = columns.map((column) => data[column]);

        if (existing) {
            await archiveExistingRecord(resourceName, resource, id, existing, "csv-import-overwrite");
            const updateColumns = columns.filter((column) => column !== resource.idColumn);
            const setList = updateColumns.map((column, index) => `${column} = $${index + 1}`).join(", ");
            const updateValues = updateColumns.map((column) => data[column]);

            if (updateColumns.length > 0) {
                await sql.unsafe(
                    `UPDATE ${resource.table} SET ${setList} WHERE ${resource.idColumn} = $${updateColumns.length + 1}`,
                    [...updateValues, id],
                );
            }
            updatedCount += 1;
        } else {
            const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
            await sql.unsafe(
                `INSERT INTO ${resource.table} (${columns.join(", ")}) VALUES (${placeholders})`,
                values,
            );
            createdCount += 1;
        }
    }

    const log = {
        log_id: crypto.randomUUID(),
        resource_name: resourceName,
        original_filename: filename,
        imported_row_count: parsedRows.length,
        created_count: createdCount,
        updated_count: updatedCount,
        skipped_count: skippedCount,
        status: "completed",
        notes: [
            "CSV import used upsert by primary key. Existing records were archived before update.",
            skippedReasons.size
                ? `Skipped rows: ${Array.from(skippedReasons.entries()).map(([reason, count]) => `${reason} (${count})`).join(", ")}.`
                : "",
        ].filter(Boolean).join(" "),
        imported_by: "admin",
    };

    if (parsedRows.length > 0 && skippedCount === parsedRows.length) {
        throw new ApiError(
            400,
            `${resource.label} CSV import skipped all ${skippedCount} rows. ${log.notes}`,
            "ADMIN_IMPORT_ALL_ROWS_SKIPPED",
        );
    }

    await sql.unsafe(
        "INSERT INTO dataset_import_logs (log_id, resource_name, original_filename, imported_row_count, created_count, updated_count, skipped_count, status, notes, imported_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        [
            log.log_id,
            log.resource_name,
            log.original_filename,
            log.imported_row_count,
            log.created_count,
            log.updated_count,
            log.skipped_count,
            log.status,
            log.notes,
            log.imported_by,
        ],
    );

    return log;
}
