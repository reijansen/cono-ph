import crypto from "crypto";

const cookieName = "cono_admin_session";
const sessionMaxAgeMs = 1000 * 60 * 60 * 8;

function getSecret() {
    if (!process.env.ADMIN_SESSION_SECRET) {
        throw new Error("ADMIN_SESSION_SECRET is required for admin sessions.");
    }

    return process.env.ADMIN_SESSION_SECRET;
}

function base64UrlEncode(value) {
    return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function sign(payload) {
    return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function timingSafeStringEqual(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseCookies(header = "") {
    return Object.fromEntries(
        header
            .split(";")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
                const separator = part.indexOf("=");
                if (separator === -1) return [part, ""];
                return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
            }),
    );
}

function serializeCookie(value, options = {}) {
    const parts = [`${cookieName}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly"];
    const sameSite = options.sameSite || (process.env.NODE_ENV === "production" ? "None" : "Lax");

    parts.push(`Max-Age=${Math.floor((options.maxAgeMs ?? sessionMaxAgeMs) / 1000)}`);
    parts.push(`SameSite=${sameSite}`);

    if (options.secure ?? process.env.NODE_ENV === "production") {
        parts.push("Secure");
    }

    return parts.join("; ");
}

export function createAdminSessionCookie() {
    const payload = base64UrlEncode({
        role: "admin",
        issuedAt: Date.now(),
        expiresAt: Date.now() + sessionMaxAgeMs,
    });
    return serializeCookie(`${payload}.${sign(payload)}`);
}

export function clearAdminSessionCookie() {
    return `${cookieName}=; Path=/; HttpOnly; Max-Age=0; SameSite=${process.env.NODE_ENV === "production" ? "None" : "Lax"}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function readAdminSession(req) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[cookieName];
    if (!token) return null;

    const [payload, signature] = token.split(".");
    if (!payload || !signature) {
        return null;
    }

    try {
        if (!timingSafeStringEqual(signature, sign(payload))) {
            return null;
        }

        const session = base64UrlDecode(payload);
        if (session.role !== "admin" || Number(session.expiresAt) < Date.now()) {
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

export function adminPasswordMatches(password) {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || !password) return false;

    return timingSafeStringEqual(String(password), String(expected));
}
