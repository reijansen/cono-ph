export function parsePositiveInt(value, fallback) {
    const parsed = Number.parseInt(Array.isArray(value) ? value[0] : value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseString(value, fallback = "") {
    if (Array.isArray(value)) {
        return String(value[0] ?? fallback).trim();
    }

    return String(value ?? fallback).trim();
}

export function parseBoolean(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (Array.isArray(value)) return parseBoolean(value[0], fallback);

    const normalized = String(value ?? "").trim().toLowerCase();
    if (!normalized) return fallback;
    return normalized === "true" || normalized === "1" || normalized === "yes";
}

export function parseStringArray(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value !== "string") return [];
    return value
        .split(",")
        .map((item) => String(item).trim())
        .filter(Boolean);
}

