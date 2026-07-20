export function sendSuccess(res, { status = 200, data = null, message = "OK", pagination } = {}) {
    const payload = {
        success: true,
        data,
        message,
    };

    if (pagination) {
        payload.pagination = pagination;
    }

    return res.status(status).json(payload);
}

export function sendError(res, { status = 500, message = "Internal server error", code = "INTERNAL_SERVER_ERROR" } = {}) {
    return res.status(status).json({
        success: false,
        message,
        error: code,
    });
}

