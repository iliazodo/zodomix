import express from "express";

import { addVoiceMember, removeVoiceMember } from "../controllers/voiceController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addVoiceMember" , protectRoute, addVoiceMember);
router.delete("/removeVoiceMember" , protectRoute, removeVoiceMember);

export default router;