import express from "express";
import VerifyJWT from "../middlewares/auth.middleware.js";
import { createOneToOneOrGetChat } from "../controllers/chat.controller.js";

const router = express.Router();
router.use(VerifyJWT);

router.post("/:reciverId",createOneToOneOrGetChat); 


export default router;