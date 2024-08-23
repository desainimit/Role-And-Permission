import asyncHandler from "express-async-handler";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const login = asyncHandler(async (req, res) => {
    console.log("Login controller");
    
});


export { login };