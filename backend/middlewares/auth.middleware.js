import asyncHandler from "express-async-handler";
import { ApiError } from "../utills/ApiError.js";
import jwt from "jsonwebtoken";

/**
 * middleware to provide logged in user details to all protected routes
 */
const VerifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json(new ApiError(401, "Unauthenticated user !"));
  }

  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedData) {
    return res.status(401).json(new ApiError(401, "token expirres"));
  }

  req.user = decodedData;
  next();
});

export default VerifyJWT;
