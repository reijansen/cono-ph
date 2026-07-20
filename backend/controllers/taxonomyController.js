import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { parsePositiveInt, parseString } from "../utils/query.js";
import {
    getTaxonomyBySpeciesId,
    listTaxonomy,
    listTaxonomyFilters,
} from "../models/taxonomyModel.js";

export const getAllTaxonomy = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listTaxonomy({
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 10),
        search: parseString(req.query.search),
        sortBy: parseString(req.query.sortBy),
        order: parseString(req.query.order, "ASC"),
        className: parseString(req.query.className),
        orderName: parseString(req.query.orderName),
        familyName: parseString(req.query.familyName),
        genusName: parseString(req.query.genusName),
        subgenus: parseString(req.query.subgenus),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched taxonomy.",
    });
});

export const getTaxonomy = asyncHandler(async (req, res) => {
    const record = await getTaxonomyBySpeciesId(req.params.id);

    if (!record) {
        throw new ApiError(404, "Taxonomy not found", "TAXONOMY_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: record,
        message: "Successfully fetched taxonomy.",
    });
});

export const getTaxonomyOptions = asyncHandler(async (_req, res) => {
    const filters = await listTaxonomyFilters();
    return sendSuccess(res, {
        data: filters,
        message: "Successfully fetched taxonomy filters.",
    });
});

