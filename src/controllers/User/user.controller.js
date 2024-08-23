import asyncHandler from "express-async-handler";
import { User } from "../../models/User/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { cookiesOptions } from "../../constants.js";

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
  console.log(req.body);

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(400, "Username or email already exists");
  }

  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

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
  const user = req.user;
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );
  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while logging out the user");
  }

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

export { register, login, logout, generateRefreshToken };
