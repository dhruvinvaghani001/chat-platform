import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
  createGroup,
  createOneToOneOrGetChat,
  getDetailsOfGroupChat,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.use(VerifyJWT);

router.route("/c/:reciverId").post(createOneToOneOrGetChat);
router.route("/group").post(createGroup);
router.route("/group/:chatId").get(getDetailsOfGroupChat);

export default router;
