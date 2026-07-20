import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getDashboardSummary } from "../models/dashboardModel.js";

export const getDashboardSummaryController = asyncHandler(async (_req, res) => {
    const data = await getDashboardSummary();
    return sendSuccess(res, {
        data,
        message: "Successfully fetched dashboard summary.",
    });
});

