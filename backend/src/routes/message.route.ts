import express, { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getAllChats,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router: Router = express.Router();

router.get("/conversations", protectRoute, getAllChats);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
