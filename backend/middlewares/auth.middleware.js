import asyncHandler from "express-async-handler";
import { ApiError } from "../utills/ApiError.js";
import jwt from "jsonwebtoken";

/**
 * middleware to provide logged in user details to all protected routes
 */
const VerifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthenticated user !"));
    }

    const decodedData = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedData) {
      return res.status(401).json(new ApiError(401, "token expirres"));
    } else {
      req.user = decodedData;
      next();
    }
  } catch (error) {
    return res.status(401).json(new ApiError(401, "token expires!"));
  }
};

export default VerifyJWT;
