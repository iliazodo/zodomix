import express from "express";

import { addUser, isUserValid, getLeaderboard, getProfilePictures, updateProfile } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addUserToGroup" , protectRoute, addUser);

router.get("/isUserValid" , protectRoute , isUserValid);
router.get("/leaderboard", getLeaderboard);
router.get("/pictures", getProfilePictures);
router.put("/updateProfile", protectRoute, updateProfile);

export default router;