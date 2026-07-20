import { sendError } from "../utils/apiResponse.js";

export function notFoundHandler(_req, res) {
    return sendError(res, {
        status: 404,
        message: "Route not found",
        code: "ROUTE_NOT_FOUND",
    });
}

export function errorHandler(err, _req, res, _next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";
    const code = err.code || "INTERNAL_SERVER_ERROR";

    return sendError(res, { status, message, code });
}

