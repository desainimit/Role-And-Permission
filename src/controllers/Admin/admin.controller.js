import asyncHandler from "express-async-handler";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Admin } from "../../models/admin.model.js";
import { User } from "../../models/user.model.js";
import { cookiesOptions } from "../../constants.js";
import { removeAccessToken } from "../../helper/removeAccessToken.js";

const generateAccessAndRefreshToken = asyncHandler(async (userId) => {
  const admin = await Admin.findById(userId);

  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
});

// const autoRegisterAdmin = asyncHandler(async () => {
//   const ExistAdmin = await Admin.findOne({
//     $or: [{ email: "admin@gmail.com" }, { username: "admin" }],
//   });

//   if (ExistAdmin) return;

//   const adminUser = await Admin.create({
//     fullName: "Admin",
//     username: "admin",
//     email: "admin@gmail.com",
//     password: "admin@123",
//   });

//   if (!adminUser) {
//     throw new ApiError(500, "Something went wrong while registering the admin");
//   }

//   console.log("Admin user created successfully");
// });

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const admin = await Admin.findOne({ $or: [{ username }, { email }] });
  if (!admin) {
    throw new ApiError(400, "Admin not found");
  }

  const verifyPassword = await admin.isValidPassword(password);
  if (!verifyPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const loggedAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken -__v -createdAt -updatedAt"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedAdmin,
          accessToken,
          refreshToken,
        },
        "Admin logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await removeAccessToken(Admin, req.user);
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 5;

  if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
    throw new ApiError(400, "Invalid page or limit value");
  }

  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password -refreshToken");

  if (users.length === 0) {
    return res.status(200).json(new ApiResponse(200, users, "No users found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { login, getAllUsers, logout };
