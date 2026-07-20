import { readAdminSession } from "../utils/adminSession.js";
import { sendError } from "../utils/apiResponse.js";

export function requireAdminSession(req, res, next) {
    const session = readAdminSession(req);

    if (!session) {
        return sendError(res, {
            status: 401,
            message: "Admin session is required.",
            code: "ADMIN_SESSION_REQUIRED",
        });
    }

    req.adminSession = session;
    return next();
}
