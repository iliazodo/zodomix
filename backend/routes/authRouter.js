import expres from "express";
import { signup, login, logout, forgotPassword, resetPassword } from "../controllers/authController.js";
import {authLimit} from "../middleware/rateLimit.js";

const router = expres.Router();

router.post("/signup" , authLimit , signup);
router.post("/login" , authLimit , login);
router.post("/logout", logout);
router.post("/forgot-password", authLimit, forgotPassword);
router.post("/reset-password/:token", authLimit, resetPassword);

export default router;