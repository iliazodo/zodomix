import expres from "express";
import { signup, login, logout, forgotPassword, resetPassword, deleteAccount } from "../controllers/authController.js";
import {authLimit} from "../middleware/rateLimit.js";
import protectRoute from "../middleware/protectRoute.js";

const router = expres.Router();

router.post("/signup" , authLimit , signup);
router.post("/login" , authLimit , login);
router.post("/logout", logout);
router.post("/forgot-password", authLimit, forgotPassword);
router.post("/reset-password/:token", authLimit, resetPassword);
router.delete("/delete-account", protectRoute, deleteAccount);

export default router;