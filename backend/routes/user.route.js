import express from "express";
import { signUp } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/sign-up", upload.single("avatar"), signUp);

export default router;
