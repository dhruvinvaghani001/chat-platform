import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
  deleteUnreadMessages,
  getUnreadMessageBymember,
} from "../controllers/unreadmessages.controller.js";

const router = express.Router();

router.use(VerifyJWT);

router.route("/").get(getUnreadMessageBymember);
router.route("/:chatId").delete(deleteUnreadMessages);

export default router;
