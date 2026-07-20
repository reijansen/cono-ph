import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { parsePositiveInt, parseString } from "../utils/query.js";
import {
    getPublicationById,
    listPublicationFilters,
    listPublications,
} from "../models/publicationModel.js";

export const getAllPublications = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listPublications({
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 5),
        search: parseString(req.query.search),
        sortBy: parseString(req.query.sortBy),
        order: parseString(req.query.order, "DESC"),
        year: parseString(req.query.year),
        journal: parseString(req.query.journal),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched publications.",
    });
});

export const getPublication = asyncHandler(async (req, res) => {
    const record = await getPublicationById(req.params.id);

    if (!record) {
        throw new ApiError(404, "Publication not found", "PUBLICATION_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: record,
        message: "Successfully fetched publication.",
    });
});

export const getPublicationOptions = asyncHandler(async (_req, res) => {
    const filters = await listPublicationFilters();
    return sendSuccess(res, {
        data: filters,
        message: "Successfully fetched publication filters.",
    });
});

