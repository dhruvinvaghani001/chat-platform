import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { uploadOnCloudinary } from "../utills/clodinray.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const acessToken = await user.genrateAccessToken();
    const refreshToken = await user.genrateRefreshToken();
    return { acessToken, refreshToken };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/*  
    Handles User Regestration logic
    @req[body] : {username,email,password,confirmPasswod}
    @description : signup user (register user)
    @routes : api/user/sign-up 
*/
const signUp = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json(new ApiError(400, "All fields are requied !"));
  }

  const existeUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existeUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User Aledy exist with this username or email"));
  }

  if (password != confirmPassword) {
    return res
      .status(409)
      .json(new ApiError(409, "password and confirm password must be same"));
  }

  // const avatarLocalFilePath = req.file?.path;

  // if (!avatarLocalFilePath) {
  //   return res.status(400).json(new ApiError(400, "avatar image required !"));
  // }

  //const avataResponse = await uploadOnCloudinary(avatarLocalFilePath);

  const avatarURI = `https://api.dicebear.com/9.x/lorelei/svg?seed=${username}`

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatarURI,
  });

  if (!user) {
    return res.status(400).json(new ApiError(400, "Error while Sign-up !"));
  }

  const newUser = await User.findById(user._id).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, { user: newUser }, "sign-up Successfully!"));
});

/* 
  Handle login logic
  @req[body] : {username,email,password}
  @description : for user to login 
  @routes : api/user/login
*/
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are Required !"));
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist !"));
  }

  const passCheck = await user.isPasswodCorrect(password);

  if (!passCheck) {
    return res.status(409).json(new ApiError(409, "Password is not correct !"));
  }

  const loginUser = await User.findById(user._id).select("-password");
  const { acessToken, refreshToken } = await genrateAccessAndRefreshToken(
    user._id
  );

  console.log(refreshToken);

  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const formatedUser = {
    _id: loginUser.id,
    username: loginUser.username,
    email: loginUser.email,
    avatar: loginUser.avatar,
    acessToken: acessToken,
  };

  res
    .status(200)
    .json(new ApiResponse(200, formatedUser, "login successfully!"));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshtoken) {
    return res.status(400).json(new ApiError(400, "unauthanticated !"));
  }

  const decodedData = await jwt.verify(
    cookies.refreshtoken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodedData) {
    return res.status(403).json(new ApiError(403, "forbidden!"));
  }

  const user = await User.findById(decodedData._id);
  const acessToken = await user.genrateAccessToken();

  const formatedUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    acessToken: acessToken,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, formatedUser , "new acesstoken genarted!"));
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  return res
    .status(200)
    .clearCookie("refreshtoken")
    .json(new ApiResponse(200, "", "logout successfully!"));
});

export { signUp, login, logout, refreshAcessToken };
