import express from "express";
import { login, logout, signUp } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import VerifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", upload.single("avatar"), signUp);
router.post("/login", login);
router.post("/logout", VerifyJWT, logout);



export default router;
