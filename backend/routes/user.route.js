import express from "express";
import {
  login,
  logout,
  refreshAcessToken,
  signUp,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import VerifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup",signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshAcessToken);

export default router;
