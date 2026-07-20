import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { parsePositiveInt, parseString } from "../utils/query.js";
import {
    adminPasswordMatches,
    clearAdminSessionCookie,
    createAdminSessionCookie,
    readAdminSession,
} from "../utils/adminSession.js";
import {
    createAdminRow,
    deleteAdminRow,
    getAdminRow,
    importAdminCsv,
    listAdminResourceMetadata,
    listAdminRows,
    permanentlyDeleteArchivedRow,
    restoreArchivedRow,
    updateAdminRow,
} from "../models/adminModel.js";

const loginAttempts = new Map();
const loginWindowMs = 1000 * 60 * 10;
const maxLoginAttempts = 8;

function getClientKey(req) {
    return req.ip || req.socket?.remoteAddress || "unknown";
}

function assertLoginAllowed(req) {
    const key = getClientKey(req);
    const now = Date.now();
    const attempt = loginAttempts.get(key) ?? { count: 0, resetAt: now + loginWindowMs };

    if (attempt.resetAt < now) {
        loginAttempts.set(key, { count: 0, resetAt: now + loginWindowMs });
        return;
    }

    if (attempt.count >= maxLoginAttempts) {
        throw new ApiError(429, "Too many login attempts. Try again later.", "LOGIN_RATE_LIMITED");
    }
}

function recordLoginFailure(req) {
    const key = getClientKey(req);
    const now = Date.now();
    const attempt = loginAttempts.get(key) ?? { count: 0, resetAt: now + loginWindowMs };
    loginAttempts.set(key, {
        count: attempt.resetAt < now ? 1 : attempt.count + 1,
        resetAt: attempt.resetAt < now ? now + loginWindowMs : attempt.resetAt,
    });
}

function clearLoginFailures(req) {
    loginAttempts.delete(getClientKey(req));
}

export const adminLogin = asyncHandler(async (req, res) => {
    assertLoginAllowed(req);

    if (!adminPasswordMatches(req.body?.password)) {
        recordLoginFailure(req);
        throw new ApiError(401, "Invalid admin credentials.", "ADMIN_LOGIN_FAILED");
    }

    clearLoginFailures(req);
    res.setHeader("Set-Cookie", createAdminSessionCookie());

    return sendSuccess(res, {
        data: { authenticated: true },
        message: "Admin login successful.",
    });
});

export const adminLogout = asyncHandler(async (_req, res) => {
    res.setHeader("Set-Cookie", clearAdminSessionCookie());

    return sendSuccess(res, {
        data: { authenticated: false },
        message: "Admin logout successful.",
    });
});

export const getAdminSession = asyncHandler(async (req, res) => {
    const session = readAdminSession(req);

    return sendSuccess(res, {
        data: { authenticated: Boolean(session) },
        message: session ? "Admin session is active." : "No active admin session.",
    });
});

export const getAdminResources = asyncHandler(async (_req, res) => {
    return sendSuccess(res, {
        data: listAdminResourceMetadata(),
        message: "Successfully fetched admin resources.",
    });
});

export const listAdminResourceRows = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listAdminRows(req.params.resource, {
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 25),
        search: parseString(req.query.search),
        filterColumn: parseString(req.query.filterColumn),
        filterValue: parseString(req.query.filterValue),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched admin records.",
    });
});

export const getAdminResourceRow = asyncHandler(async (req, res) => {
    const row = await getAdminRow(req.params.resource, req.params.id);

    if (!row) {
        throw new ApiError(404, "Admin record not found", "ADMIN_RECORD_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: row,
        message: "Successfully fetched admin record.",
    });
});

export const createAdminResourceRow = asyncHandler(async (req, res) => {
    const row = await createAdminRow(req.params.resource, req.body ?? {});

    return sendSuccess(res, {
        status: 201,
        data: row,
        message: "Admin record created successfully.",
    });
});

export const updateAdminResourceRow = asyncHandler(async (req, res) => {
    const row = await updateAdminRow(req.params.resource, req.params.id, req.body ?? {});

    if (!row) {
        throw new ApiError(404, "Admin record not found", "ADMIN_RECORD_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: row,
        message: "Admin record updated successfully.",
    });
});

export const deleteAdminResourceRow = asyncHandler(async (req, res) => {
    const row = await deleteAdminRow(req.params.resource, req.params.id);

    if (!row) {
        throw new ApiError(404, "Admin record not found", "ADMIN_RECORD_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: row,
        message: "Admin record archived successfully.",
    });
});

export const listAdminDatasetLogs = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listAdminRows("datasetLogs", {
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 25),
        search: parseString(req.query.search),
        filterColumn: parseString(req.query.filterColumn),
        filterValue: parseString(req.query.filterValue),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched dataset import logs.",
    });
});

export const restoreAdminArchiveRow = asyncHandler(async (req, res) => {
    const row = await restoreArchivedRow(req.params.archiveId);

    if (!row) {
        throw new ApiError(404, "Archived record not found", "ARCHIVE_RECORD_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: row,
        message: "Archived record restored successfully.",
    });
});

export const permanentlyDeleteAdminArchiveRow = asyncHandler(async (req, res) => {
    const row = await permanentlyDeleteArchivedRow(req.params.archiveId);

    if (!row) {
        throw new ApiError(404, "Archived record not found", "ARCHIVE_RECORD_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: row,
        message: "Archived record permanently deleted.",
    });
});

export const importAdminResourceCsv = asyncHandler(async (req, res) => {
    const result = await importAdminCsv(req.params.resource, {
        filename: parseString(req.body?.filename, "dataset.csv"),
        csvText: parseString(req.body?.csvText),
    });

    return sendSuccess(res, {
        data: result,
        message: "CSV import completed.",
    });
});
