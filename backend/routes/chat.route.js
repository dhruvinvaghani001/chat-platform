import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import {
    addMemberInGroupChat,
  createGroup,
  createOneToOneOrGetChat,
  deleteGroup,
  deleteOneToOneChat,
  getAllChats,
  getDetailsOfGroupChat,
  leaveGroup,
  removeMemberFromGroup,
  renameGroup,
  seachAvailableUsers,
} from "../controllers/chat.controller.js";

const router = express.Router();
router.use(VerifyJWT);

router.route("/c/:reciverId").post(createOneToOneOrGetChat);
router.route("/c/:chatId").delete(deleteOneToOneChat)
router.route("/group").post(createGroup);
router.route("/group/:chatId").get(getDetailsOfGroupChat).patch(renameGroup).delete(deleteGroup);

router.route("/group/:chatId/add").patch(addMemberInGroupChat)
router.route("/group/:chatId/remove/:memberId").patch(removeMemberFromGroup)

router.route("/group/leave/:chatId").patch(leaveGroup);

router.route("/").get(getAllChats);

router.route("/available-user").get(seachAvailableUsers);


export default router;
