import { sendError } from "../utils/apiResponse.js";
import crypto from "crypto";

function keysMatch(providedKey, expectedKey) {
    const provided = Buffer.from(providedKey);
    const expected = Buffer.from(expectedKey);

    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}

export function requireAdminApiKey(req, res, next) {
    const providedKey = req.get("x-admin-api-key");

    if (!providedKey) {
        return sendError(res, {
            status: 401,
            message: "Admin API key is required.",
            code: "ADMIN_KEY_REQUIRED",
        });
    }

    if (!process.env.ADMIN_API_KEY || !keysMatch(providedKey, process.env.ADMIN_API_KEY)) {
        return sendError(res, {
            status: 403,
            message: "Admin API key is invalid.",
            code: "ADMIN_KEY_INVALID",
        });
    }

    return next();
}
