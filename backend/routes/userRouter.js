import express from "express";

import { addUser, isUserValid, getLeaderboard, getProfilePictures, updateProfile, muteUser, unmuteUser, blockUser, unblockUser, getLists } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addUserToGroup" , protectRoute, addUser);

router.get("/isUserValid" , protectRoute , isUserValid);
router.get("/leaderboard", getLeaderboard);
router.get("/pictures", getProfilePictures);
router.put("/updateProfile", protectRoute, updateProfile);

router.post("/mute", protectRoute, muteUser);
router.post("/unmute", protectRoute, unmuteUser);
router.post("/block", protectRoute, blockUser);
router.post("/unblock", protectRoute, unblockUser);
router.get("/lists", protectRoute, getLists);

export default router;