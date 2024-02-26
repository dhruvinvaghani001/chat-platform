import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { uploadOnCloudinary } from "../utills/clodinray.js";

/*
    @req[body] : {username,email,password,confirmPasswod}
    @utility : signup user (register user)
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

  const avataresponse = await uploadOnCloudinary(avatarLocalFilePath);

  console.log(avataresponse);

  const user = await User.create({
    username,
    email,
    password,
  
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

export { signUp };
