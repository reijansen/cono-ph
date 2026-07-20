const localOrigins = ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"];

function parseOrigins(value = "") {
    return value
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);
}

export function buildCorsOptions() {
    const configuredOrigins = parseOrigins(process.env.CORS_ORIGINS || process.env.CORS_ORIGIN);
    const allowedOrigins = new Set([
        ...configuredOrigins,
        ...(process.env.NODE_ENV === "production" ? [] : localOrigins),
    ]);

    return {
        origin(origin, callback) {
            if (!origin) {
                callback(null, true);
                return;
            }

            const normalizedOrigin = origin.replace(/\/$/, "");
            if (allowedOrigins.has(normalizedOrigin)) {
                callback(null, true);
                return;
            }

            const error = new Error("CORS origin not allowed");
            error.status = 403;
            error.code = "CORS_ORIGIN_NOT_ALLOWED";
            callback(error);
        },
    };
}
