export class ApiError extends Error {
    constructor(statusCode, message, code = "INTERNAL_SERVER_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

