import express from "express";

import { addUser, isUserValid, getLeaderboard } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addUserToGroup" , protectRoute, addUser);

router.get("/isUserValid" , protectRoute , isUserValid);
router.get("/leaderboard", getLeaderboard);

export default router;