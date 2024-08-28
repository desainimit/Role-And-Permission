import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";

const getDataById = asyncHandler(async (model, _id, selectField) => {
  const data = await model.findById(_id);

  if (selectField) {
    try {
      return await model.findById(_id).select(selectField);
    } catch (error) {
      throw new ApiError(400, "Invalid select field");
    }
  }

  if (!data) {
    throw new ApiError(404, "Data not found");
  }
  return data;
});

export { getDataById };
