import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { uploadOnCloudinary } from "../utills/clodinray.js";

/*  
    Handles User Regestration logic
    @req[body] : {username,email,password,confirmPasswod}
    @description : signup user (register user)
    @routes : api/user/sign-up 
*/
const signUp = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    throw new ApiError(400, "All fields are requied !");
  }

  const existeUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existeUser) {
    throw new ApiError(409, "User Aledy exist with this username or email");
  }

  if (password != confirmPassword) {
    throw new ApiError(409, "password and confirm password must be same");
  }

  const avatarLocalFilePath = req.file?.path;

  if (!avatarLocalFilePath) {
    throw new ApiError(400, "avatar image required !");
  }

  const avataResponse = await uploadOnCloudinary(avatarLocalFilePath);

  const user = await User.create({
    username,
    email,
    password,
    avatar: avataResponse?.url,
  });

  if (!user) {
    throw new ApiError(400, "Error while Sign-up !");
  }

  const newUser = await User.findById(user._id).select("-password");

  const token = await user.genrateJwtToken();

  res.cookie("token", token);

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
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are Required !");
  }

  const user = await User.findOne({ $and: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User does not exist !");
  }

  const passCheck = await user.isPasswodCorrect(password);

  if (!passCheck) {
    throw new ApiError(409, "Password is not correct !");
  }

  const loginUser = await User.findById(user._id).select("-password");
  const token = await user.genrateJwtToken();
  res.cookie("token", token);

  res.status(200).json(new ApiResponse(200, loginUser, "login successfully!"));
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  return res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, "", "logout successfully!"));
});

export { signUp, login, logout };
