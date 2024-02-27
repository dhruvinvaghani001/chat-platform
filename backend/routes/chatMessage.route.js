import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();
router.use(VerifyJWT);

router.route("/:chatId").get(getAllMessages).post(sendMessage);

export default router;
