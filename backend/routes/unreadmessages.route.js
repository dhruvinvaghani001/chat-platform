import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
  addBulk,
  addunreadMessage,
  deleteUnreadMessages,
  getUnreadMessageBymember,
} from "../controllers/unreadmessages.controller.js";

const router = express.Router();

router.use(VerifyJWT);

router.route("/").get(getUnreadMessageBymember);
router.route("/:chatId").delete(deleteUnreadMessages);

router.route("/u/:userId/c/:chatId/m/:messageId").post(addunreadMessage);

router.route("/add").post(addBulk);


export default router;
