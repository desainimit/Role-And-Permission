import asyncHandler from "express-async-handler";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { cookiesOptions } from "../../constants.js";
import { removeAccessToken } from "../../helper/removeAccessToken.js";
import { Role } from "../../models/role.model.js";
import { UserRoles } from "../../models/userRoles.model.js";
import { getDataById } from "../../helper/getDataById.js";

const generateAccessAndRefreshToken = asyncHandler(async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
});

const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  const userRoleId = await Role.findOne({ name: "user" });
  if (!userRoleId) {
    throw new ApiError(500, "Something went wrong while assigning user role");
  }

  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  const userRole = await UserRoles.create({
    user_id: user._id,
    user_type: "user",
    role_id: userRoleId,
  });

  if (!userRole) {
    throw new ApiError(500, "Something went wrong while assigning user role");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await removeAccessToken(User, req.user);
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const generateRefreshToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoded = await jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decoded) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (IncomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
      user._id
    );

    const authorized = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookies("accessToken", accessToken, cookiesOptions)
      .cookies("refreshToken", refreshToken, cookiesOptions)
      .json(
        200,
        { user: authorized, accessToken, refreshToken },
        "Token refreshed successfully"
      );
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Unauthorized request");
  }
});

const userProfile = asyncHandler(async (req, res) => {
  const user = await getDataById(User, req.user, "-password -refreshToken -__v");
  return res.status(200).json(new ApiResponse(200, user, "User profile"));
});

export { register, login, logout, generateRefreshToken, userProfile };
