import expres from "express";
import { signup , login , logout } from "../controllers/authController.js";
import authLimit from "../middleware/rateLimit.js";

const router = expres.Router();

router.post("/signup" , authLimit , signup);
router.post("/login" , authLimit , login);
router.post("/logout" , logout);

export default router;