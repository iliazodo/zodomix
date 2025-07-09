import express from "express";

import {
  sendMessage,
  getMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { messageLimit } from "../middleware/rateLimit.js";
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/send/:group", messageLimit, sendMessage);
router.get("/get/:group", getMessage);
router.delete("/delete", protectRoute , deleteMessage);

export default router;
