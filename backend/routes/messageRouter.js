import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { sendMessage , getMessage } from "../controllers/messageController.js";
import { messageLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/send/:group", protectRoute, messageLimit, sendMessage);
router.get("/get/:group", protectRoute, getMessage);

export default router;
