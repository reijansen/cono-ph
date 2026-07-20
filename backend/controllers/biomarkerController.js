import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { parseBoolean, parsePositiveInt, parseString, parseStringArray } from "../utils/query.js";
import {
    getBiomarkerById,
    listBiomarkerFilters,
    listBiomarkers,
} from "../models/biomarkerModel.js";

export const getAllBiomarkers = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listBiomarkers({
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 10),
        search: parseString(req.query.search),
        sortBy: parseString(req.query.sortBy),
        order: parseString(req.query.order, "DESC"),
        markerType: parseString(req.query.markerType),
        species: parseString(req.query.species),
        province: parseString(req.query.province),
        status: parseStringArray(req.query.status),
        hasAccession: parseBoolean(req.query.hasAccession),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched biomarkers.",
    });
});

export const getBiomarker = asyncHandler(async (req, res) => {
    const record = await getBiomarkerById(req.params.id);

    if (!record) {
        throw new ApiError(404, "Biomarker not found", "BIOMARKER_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: record,
        message: "Successfully fetched biomarker.",
    });
});

export const getBiomarkerOptions = asyncHandler(async (_req, res) => {
    const filters = await listBiomarkerFilters();
    return sendSuccess(res, {
        data: filters,
        message: "Successfully fetched biomarker filters.",
    });
});

