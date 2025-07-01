import express from "express";
import { getAiMessages, messageToAi } from "../controllers/aiController.js";
import { messageLimit} from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/message/send" , messageLimit , messageToAi);
router.get("/message/get" , getAiMessages);

export default router;