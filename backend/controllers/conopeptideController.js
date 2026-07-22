import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { parsePositiveInt, parseString, parseStringArray } from "../utils/query.js";
import {
    getConopeptideById,
    listConopeptideFilters,
    listConopeptides,
} from "../models/conopeptideModel.js";

export const getAllConopeptides = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listConopeptides({
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 10),
        search: parseString(req.query.search),
        sortBy: parseString(req.query.sortBy),
        order: parseString(req.query.order, "DESC"),
        species: parseStringArray(req.query.species),
        superfamily: parseStringArray(req.query.superfamily),
        cysteineFramework: parseStringArray(req.query.cysteineFramework),
        hasMaturePeptideSequence: parseString(req.query.hasMaturePeptideSequence),
        hasPredictedPeptide: parseString(req.query.hasPredictedPeptide),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched conopeptides.",
    });
});

export const getConopeptide = asyncHandler(async (req, res) => {
    const record = await getConopeptideById(req.params.id);

    if (!record) {
        throw new ApiError(404, "Conopeptide not found", "CONOPEPTIDE_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: record,
        message: "Successfully fetched conopeptide.",
    });
});

export const getConopeptideOptions = asyncHandler(async (_req, res) => {
    const filters = await listConopeptideFilters();
    return sendSuccess(res, {
        data: filters,
        message: "Successfully fetched conopeptide filters.",
    });
});

