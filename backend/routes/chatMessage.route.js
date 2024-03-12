import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { uploadForMessageFile } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.use(VerifyJWT);

router.route("/:chatId").get(getAllMessages);
router
  .route("/:chatId")
  .post(
    uploadForMessageFile.fields([{ name: "attachmentFiles", maxCount: 5 }]),
    sendMessage
  );

export default router;
