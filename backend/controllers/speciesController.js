import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { parsePositiveInt, parseString } from "../utils/query.js";
import {
    createSpecies,
    deleteSpecies,
    getSpeciesById,
    listSpecies,
    updateSpecies,
} from "../models/speciesModel.js";

export const getAllSpecies = asyncHandler(async (req, res) => {
    const { rows, pagination } = await listSpecies({
        page: parsePositiveInt(req.query.page, 1),
        limit: parsePositiveInt(req.query.limit, 10),
        search: parseString(req.query.search),
        sortBy: parseString(req.query.sortBy, "createdAt"),
        order: parseString(req.query.order, "DESC"),
        subgenus: parseString(req.query.subgenus),
        province: parseString(req.query.province),
        municipality: parseString(req.query.municipality),
        diet: parseString(req.query.diet),
    });

    return sendSuccess(res, {
        data: rows,
        pagination,
        message: "Successfully fetched species.",
    });
});

export const getSpecies = asyncHandler(async (req, res) => {
    const species = await getSpeciesById(req.params.id);

    if (!species) {
        throw new ApiError(404, "Species not found", "SPECIES_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: species,
        message: "Successfully fetched species.",
    });
});

export const createSpeciesController = asyncHandler(async (req, res) => {
    const created = await createSpecies(req.body);

    if (!created) {
        throw new ApiError(400, "Scientific name and common name are required", "VALIDATION_ERROR");
    }

    return sendSuccess(res, {
        status: 201,
        data: created,
        message: "Species created successfully.",
    });
});

export const updateSpeciesController = asyncHandler(async (req, res) => {
    const updated = await updateSpecies(req.params.id, req.body);

    if (!updated) {
        throw new ApiError(404, "Species not found", "SPECIES_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: updated,
        message: "Species updated successfully.",
    });
});

export const deleteSpeciesController = asyncHandler(async (req, res) => {
    const deleted = await deleteSpecies(req.params.id);

    if (!deleted) {
        throw new ApiError(404, "Species not found", "SPECIES_NOT_FOUND");
    }

    return sendSuccess(res, {
        data: deleted,
        message: "Species deleted successfully.",
    });
});

